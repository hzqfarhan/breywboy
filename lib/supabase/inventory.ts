import { supabase } from "./client"
import { calculateCostPerBaseUnit, getBaseUnit, toBaseQuantity } from "@/lib/inventory/units"

export type RawMaterialInput = {
  name: string
  sku: string
  category: string
  unit: string
  minimumStock: number
  isPerishable: boolean
}

export type PurchaseItemInput = {
  rawMaterialId: string
  quantity: number
  unit: string
  totalCost: number
  expiryDate?: string | null
}

export type RecipeItemInput = {
  rawMaterialId: string
  quantity: number
  unit: string
  wastePercent: number
  notes?: string | null
}

type RecipeAvailabilityRow = {
  productId: string
  items?: {
    rawMaterialId: string
    quantity: number
    wastePercent?: number | null
    rawMaterial?: { currentStock?: number | null } | { currentStock?: number | null }[] | null
  }[]
}

export async function getInventorySettings() {
  const { data } = await supabase.from("InventorySetting").select("*").eq("id", "default").maybeSingle()

  return data || {
    id: "default",
    enableInventoryTracking: true,
    enableFifoCosting: true,
    allowNegativeStock: false,
    lowStockAlertEnabled: true,
    expiryAlertDays: 7,
    defaultWastePercent: 0,
    autoDeductStockOn: "ACCEPTED",
  }
}

export async function getRawMaterials() {
  const { data, error } = await supabase
    .from("RawMaterial")
    .select("*")
    .order("category")
    .order("name")

  if (error) console.error("[inventory] getRawMaterials:", error.message)
  return data || []
}

export async function getRawMaterialBatches() {
  const { data, error } = await supabase
    .from("RawMaterialBatch")
    .select("*, rawMaterial:RawMaterial(*), supplier:Supplier(*)")
    .order("purchaseDate", { ascending: true })
    .order("createdAt", { ascending: true })

  if (error) console.error("[inventory] getRawMaterialBatches:", error.message)
  return data || []
}

export async function getSuppliers() {
  const { data, error } = await supabase.from("Supplier").select("*").order("name")
  if (error) console.error("[inventory] getSuppliers:", error.message)
  return data || []
}

export async function getStockMovements(limit = 20) {
  const { data, error } = await supabase
    .from("StockMovement")
    .select("*, rawMaterial:RawMaterial(*), batch:RawMaterialBatch(*)")
    .order("createdAt", { ascending: false })
    .limit(limit)

  if (error) console.error("[inventory] getStockMovements:", error.message)
  return data || []
}

export async function upsertRawMaterial(input: RawMaterialInput, id?: string) {
  const payload = {
    ...input,
    unit: getBaseUnit(input.unit),
  }

  const query = id
    ? supabase.from("RawMaterial").update(payload).eq("id", id)
    : supabase.from("RawMaterial").insert({ ...payload, currentStock: 0 })

  const { data, error } = await query.select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function createPurchaseWithBatch(input: {
  supplierId: string
  invoiceNumber?: string | null
  purchaseDate: string
  notes?: string | null
  items: PurchaseItemInput[]
}) {
  const totalAmount = input.items.reduce((sum, item) => sum + item.totalCost, 0)
  const { data: purchase, error: purchaseError } = await supabase
    .from("Purchase")
    .insert({
      supplierId: input.supplierId,
      invoiceNumber: input.invoiceNumber || null,
      purchaseDate: input.purchaseDate,
      totalAmount,
      notes: input.notes || null,
    })
    .select()
    .single()

  if (purchaseError) throw new Error(purchaseError.message)

  for (const item of input.items) {
    const { data: material, error: materialError } = await supabase
      .from("RawMaterial")
      .select("*")
      .eq("id", item.rawMaterialId)
      .single()

    if (materialError) throw new Error(materialError.message)

    const baseQuantity = toBaseQuantity(item.quantity, item.unit)
    const baseUnit = getBaseUnit(item.unit)
    const costPerUnit = calculateCostPerBaseUnit(item.quantity, item.unit, item.totalCost)
    const batchNumber = `${material.sku || "MAT"}-${Date.now().toString().slice(-6)}`

    const { data: batch, error: batchError } = await supabase
      .from("RawMaterialBatch")
      .insert({
        rawMaterialId: item.rawMaterialId,
        batchNumber,
        supplierId: input.supplierId,
        purchaseDate: input.purchaseDate,
        expiryDate: item.expiryDate || null,
        quantityPurchased: baseQuantity,
        quantityRemaining: baseQuantity,
        unit: baseUnit,
        totalCost: item.totalCost,
        costPerUnit,
        status: "ACTIVE",
      })
      .select()
      .single()

    if (batchError) throw new Error(batchError.message)

    const { error: itemError } = await supabase.from("PurchaseItem").insert({
      purchaseId: purchase.id,
      rawMaterialId: item.rawMaterialId,
      batchId: batch.id,
      quantity: baseQuantity,
      unit: baseUnit,
      totalCost: item.totalCost,
      costPerUnit,
      expiryDate: item.expiryDate || null,
    })

    if (itemError) throw new Error(itemError.message)

    await supabase.from("StockMovement").insert({
      rawMaterialId: item.rawMaterialId,
      batchId: batch.id,
      type: "PURCHASE",
      quantity: baseQuantity,
      unit: baseUnit,
      costPerUnit,
      totalCost: item.totalCost,
      referenceType: "Purchase",
      referenceId: purchase.id,
      notes: `Purchase ${input.invoiceNumber || purchase.id}`,
    })

    await supabase
      .from("RawMaterial")
      .update({ currentStock: Number(material.currentStock || 0) + baseQuantity })
      .eq("id", item.rawMaterialId)
  }

  return purchase
}

export async function getInventoryOverview() {
  const [materials, batches, movements] = await Promise.all([
    getRawMaterials(),
    getRawMaterialBatches(),
    getStockMovements(10),
  ])

  const now = new Date()
  const sevenDays = new Date(now)
  sevenDays.setDate(now.getDate() + 7)

  const activeBatches = batches.filter((batch) => batch.status === "ACTIVE")
  const inventoryValue = activeBatches.reduce(
    (sum, batch) => sum + Number(batch.quantityRemaining || 0) * Number(batch.costPerUnit || 0),
    0
  )

  const lowStock = materials.filter((material) => Number(material.currentStock || 0) <= Number(material.minimumStock || 0))
  const outOfStock = materials.filter((material) => Number(material.currentStock || 0) <= 0)
  const expiringSoon = activeBatches.filter((batch) => {
    if (!batch.expiryDate) return false
    const expiry = new Date(batch.expiryDate)
    return expiry >= now && expiry <= sevenDays
  })

  return { materials, batches, movements, inventoryValue, lowStock, outOfStock, expiringSoon }
}

export async function getUnavailableProductIds() {
  const settings = await getInventorySettings()
  if (!settings.enableInventoryTracking || settings.allowNegativeStock) return []

  const { data: recipes, error } = await supabase
    .from("Recipe")
    .select("productId, items:RecipeItem(rawMaterialId, quantity, wastePercent, rawMaterial:RawMaterial(currentStock))")
    .eq("isActive", true)

  if (error) {
    console.error("[inventory] getUnavailableProductIds:", error.message)
    return []
  }

  return ((recipes || []) as RecipeAvailabilityRow[])
    .filter((recipe) =>
      (recipe.items || []).some((item) => {
        const required = Number(item.quantity || 0) * (1 + Number(item.wastePercent || 0) / 100)
        const rawMaterial = Array.isArray(item.rawMaterial) ? item.rawMaterial[0] : item.rawMaterial
        return Number(rawMaterial?.currentStock || 0) < required
      })
    )
    .map((recipe) => recipe.productId)
}

export async function getRecipes() {
  const { data, error } = await supabase
    .from("Recipe")
    .select("*, product:Product(*), items:RecipeItem(*, rawMaterial:RawMaterial(*))")
    .order("createdAt", { ascending: false })

  if (error) console.error("[inventory] getRecipes:", error.message)
  return data || []
}

export async function saveRecipe(productId: string, name: string, items: RecipeItemInput[], recipeId?: string) {
  const version = 1
  let recipe = null

  if (recipeId) {
    const { data, error } = await supabase
      .from("Recipe")
      .update({ name, isActive: true })
      .eq("id", recipeId)
      .select()
      .single()
    if (error) throw new Error(error.message)
    recipe = data
    await supabase.from("RecipeItem").delete().eq("recipeId", recipeId)
  } else {
    await supabase.from("Recipe").update({ isActive: false }).eq("productId", productId)
    const { data, error } = await supabase
      .from("Recipe")
      .insert({ productId, name, version, isActive: true })
      .select()
      .single()
    if (error) throw new Error(error.message)
    recipe = data
  }

  if (items.length) {
    const { error } = await supabase.from("RecipeItem").insert(
      items.map((item) => ({
        recipeId: recipe.id,
        rawMaterialId: item.rawMaterialId,
        quantity: toBaseQuantity(item.quantity, item.unit),
        unit: getBaseUnit(item.unit),
        wastePercent: item.wastePercent || 0,
        notes: item.notes || null,
      }))
    )
    if (error) throw new Error(error.message)
  }

  return recipe
}
