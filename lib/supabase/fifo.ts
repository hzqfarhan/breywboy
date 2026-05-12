import { supabase } from "./client"
import { getInventorySettings } from "./inventory"

type OrderItemRow = {
  id: string
  productId: string
  unitPrice: number
  quantity: number
  total: number
  customizations?: string | null
}

type Requirement = {
  rawMaterialId: string
  name: string
  quantity: number
  unit: string
}

export async function consumeInventoryForOrder(orderId: string) {
  const settings = await getInventorySettings()
  if (!settings.enableInventoryTracking || !settings.enableFifoCosting) return { skipped: true }

  const { data: existingCost } = await supabase.from("OrderCost").select("id").eq("orderId", orderId).maybeSingle()
  if (existingCost) return { skipped: true, reason: "already-costed" }

  const { data: order, error: orderError } = await supabase
    .from("Order")
    .select("*, items:OrderItem(*)")
    .eq("id", orderId)
    .single()

  if (orderError) throw new Error(orderError.message)

  let orderCogs = 0

  for (const item of (order.items || []) as OrderItemRow[]) {
    const requirements = await getRequirementsForOrderItem(item)
    const costBreakdown = []
    let itemCogs = 0

    for (const requirement of requirements) {
      const requiredQuantity = requirement.quantity * item.quantity
      const consumed = await consumeMaterialFifo({
        rawMaterialId: requirement.rawMaterialId,
        quantity: requiredQuantity,
        unit: requirement.unit,
        orderId,
        orderItemId: item.id,
        allowNegativeStock: settings.allowNegativeStock,
      })

      itemCogs += consumed.totalCost
      costBreakdown.push({
        rawMaterialId: requirement.rawMaterialId,
        rawMaterialName: requirement.name,
        quantity: requiredQuantity,
        unit: requirement.unit,
        cost: consumed.totalCost,
        batches: consumed.batches,
      })
    }

    const revenue = Number(item.total || item.unitPrice * item.quantity)
    const grossProfit = revenue - itemCogs
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0
    orderCogs += itemCogs

    const { error: itemCostError } = await supabase.from("OrderItemCost").insert({
      orderItemId: item.id,
      productId: item.productId,
      revenue,
      cogs: itemCogs,
      grossProfit,
      grossMargin,
      costBreakdown,
    })

    if (itemCostError) throw new Error(itemCostError.message)
  }

  const revenue = Number(order.total || order.subtotal || 0)
  const grossProfit = revenue - orderCogs
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0

  const { error: orderCostError } = await supabase.from("OrderCost").insert({
    orderId,
    revenue,
    cogs: orderCogs,
    grossProfit,
    grossMargin,
  })

  if (orderCostError) throw new Error(orderCostError.message)

  return { skipped: false, cogs: orderCogs, grossProfit, grossMargin }
}

async function getRequirementsForOrderItem(item: OrderItemRow): Promise<Requirement[]> {
  const { data: recipe } = await supabase
    .from("Recipe")
    .select("*, items:RecipeItem(*, rawMaterial:RawMaterial(*))")
    .eq("productId", item.productId)
    .eq("isActive", true)
    .maybeSingle()

  const requirements = new Map<string, Requirement>()

  for (const recipeItem of recipe?.items || []) {
    const quantityWithWaste = Number(recipeItem.quantity || 0) * (1 + Number(recipeItem.wastePercent || 0) / 100)
    requirements.set(recipeItem.rawMaterialId, {
      rawMaterialId: recipeItem.rawMaterialId,
      name: recipeItem.rawMaterial?.name || "Raw material",
      quantity: quantityWithWaste,
      unit: recipeItem.unit,
    })
  }

  const customizations = parseCustomizations(item.customizations)
  const addOns = customizations?.addOns || []

  if (addOns.some((addOn: { id?: string; name?: string }) => addOn.id === "addon-extra-shot" || addOn.name === "Extra Shot")) {
    await addRecipeByName(requirements, "Extra Shot")
  }

  if (addOns.some((addOn: { id?: string; name?: string }) => addOn.id === "addon-oat-milk" || addOn.name === "Oat Milk")) {
    await addRecipeByName(requirements, "Oat Milk")
    await subtractFreshMilk(requirements)
  }

  return Array.from(requirements.values()).filter((item) => item.quantity > 0)
}

async function addRecipeByName(requirements: Map<string, Requirement>, productName: string) {
  const { data: product } = await supabase.from("Product").select("id").eq("name", productName).maybeSingle()
  if (!product) return

  const { data: recipe } = await supabase
    .from("Recipe")
    .select("*, items:RecipeItem(*, rawMaterial:RawMaterial(*))")
    .eq("productId", product.id)
    .eq("isActive", true)
    .maybeSingle()

  for (const item of recipe?.items || []) {
    const current = requirements.get(item.rawMaterialId)
    const quantity = Number(item.quantity || 0) * (1 + Number(item.wastePercent || 0) / 100)
    requirements.set(item.rawMaterialId, {
      rawMaterialId: item.rawMaterialId,
      name: item.rawMaterial?.name || "Raw material",
      unit: item.unit,
      quantity: (current?.quantity || 0) + quantity,
    })
  }
}

async function subtractFreshMilk(requirements: Map<string, Requirement>) {
  const { data: material } = await supabase.from("RawMaterial").select("id").eq("name", "Fresh Milk").maybeSingle()
  if (!material) return

  const current = requirements.get(material.id)
  if (!current) return

  requirements.set(material.id, {
    ...current,
    quantity: Math.max(0, current.quantity - 160),
  })
}

async function consumeMaterialFifo(input: {
  rawMaterialId: string
  quantity: number
  unit: string
  orderId: string
  orderItemId: string
  allowNegativeStock: boolean
}) {
  const { data: batches } = await supabase
    .from("RawMaterialBatch")
    .select("*")
    .eq("rawMaterialId", input.rawMaterialId)
    .eq("status", "ACTIVE")
    .gt("quantityRemaining", 0)
    .order("purchaseDate", { ascending: true })
    .order("createdAt", { ascending: true })

  const available = (batches || []).reduce((sum, batch) => sum + Number(batch.quantityRemaining || 0), 0)
  if (!input.allowNegativeStock && available < input.quantity) {
    throw new Error("Insufficient stock for one or more recipe ingredients.")
  }

  let remaining = input.quantity
  let totalCost = 0
  const consumedBatches = []

  for (const batch of batches || []) {
    if (remaining <= 0) break
    const take = Math.min(Number(batch.quantityRemaining || 0), remaining)
    const lineCost = take * Number(batch.costPerUnit || 0)
    const quantityRemaining = Number(batch.quantityRemaining || 0) - take

    const { error: batchError } = await supabase
      .from("RawMaterialBatch")
      .update({
        quantityRemaining,
        status: quantityRemaining <= 0 ? "DEPLETED" : "ACTIVE",
      })
      .eq("id", batch.id)

    if (batchError) throw new Error(batchError.message)

    const { error: movementError } = await supabase.from("StockMovement").insert({
      rawMaterialId: input.rawMaterialId,
      batchId: batch.id,
      type: "SALE_CONSUMPTION",
      quantity: take,
      unit: input.unit,
      costPerUnit: batch.costPerUnit,
      totalCost: lineCost,
      referenceType: "OrderItem",
      referenceId: input.orderItemId,
      notes: `Order ${input.orderId}`,
    })

    if (movementError) throw new Error(movementError.message)

    totalCost += lineCost
    remaining -= take
    consumedBatches.push({ batchId: batch.id, batchNumber: batch.batchNumber, quantity: take, cost: lineCost })
  }

  if (remaining > 0 && input.allowNegativeStock) {
    consumedBatches.push({ batchId: null, batchNumber: "NEGATIVE", quantity: remaining, cost: 0 })
  }

  const { data: material } = await supabase.from("RawMaterial").select("currentStock").eq("id", input.rawMaterialId).single()
  await supabase
    .from("RawMaterial")
    .update({ currentStock: Number(material?.currentStock || 0) - input.quantity })
    .eq("id", input.rawMaterialId)

  return { totalCost, batches: consumedBatches }
}

function parseCustomizations(value?: string | null) {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
