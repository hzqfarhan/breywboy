import { supabase } from "./client"

type RecipeItem = {
  rawMaterialId: string
  quantity: number
  unit: string
  wastePercent?: number | null
  rawMaterial?: { name: string } | null
}

type Recipe = {
  id: string
  productId: string
  items?: RecipeItem[]
}

export type CostBreakdownLine = {
  rawMaterialId: string
  rawMaterialName: string
  quantity: number
  unit: string
  cost: number
}

export async function getActiveRecipe(productId: string): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from("Recipe")
    .select("*, items:RecipeItem(*, rawMaterial:RawMaterial(*))")
    .eq("productId", productId)
    .eq("isActive", true)
    .maybeSingle()

  if (error) console.error("[costing] getActiveRecipe:", error.message)
  return data
}

export async function estimateProductCost(productId: string) {
  const recipe = await getActiveRecipe(productId)
  if (!recipe?.items?.length) return { cost: 0, breakdown: [] as CostBreakdownLine[] }

  const breakdown: CostBreakdownLine[] = []
  let cost = 0

  for (const item of recipe.items) {
    const quantityWithWaste = Number(item.quantity || 0) * (1 + Number(item.wastePercent || 0) / 100)
    const { data: batches } = await supabase
      .from("RawMaterialBatch")
      .select("*")
      .eq("rawMaterialId", item.rawMaterialId)
      .eq("status", "ACTIVE")
      .gt("quantityRemaining", 0)
      .order("purchaseDate", { ascending: true })
      .order("createdAt", { ascending: true })
      .limit(1)

    const unitCost = Number(batches?.[0]?.costPerUnit || 0)
    const lineCost = quantityWithWaste * unitCost
    cost += lineCost
    breakdown.push({
      rawMaterialId: item.rawMaterialId,
      rawMaterialName: item.rawMaterial?.name || "Raw material",
      quantity: quantityWithWaste,
      unit: item.unit,
      cost: lineCost,
    })
  }

  return { cost, breakdown }
}

export async function refreshProductCostSnapshot(product: {
  id: string
  basePrice?: number | null
  icedPrice?: number | null
  hotPrice?: number | null
}) {
  const sellingPrice = Number(product.icedPrice ?? product.hotPrice ?? product.basePrice ?? 0)
  const { cost } = await estimateProductCost(product.id)
  const estimatedProfit = sellingPrice - cost
  const estimatedMargin = sellingPrice > 0 ? (estimatedProfit / sellingPrice) * 100 : 0

  const { data, error } = await supabase
    .from("ProductCostSnapshot")
    .insert({
      productId: product.id,
      estimatedCost: cost,
      sellingPrice,
      estimatedProfit,
      estimatedMargin,
    })
    .select()
    .single()

  if (error) console.error("[costing] refreshProductCostSnapshot:", error.message)
  return data
}

export async function getProductMargins() {
  const { data: products } = await supabase
    .from("Product")
    .select("*, category:Category(*)")
    .order("name")

  const rows = []
  for (const product of products || []) {
    const sellingPrice = Number(product.icedPrice ?? product.hotPrice ?? product.basePrice ?? 0)
    const estimate = await estimateProductCost(product.id)
    const profit = sellingPrice - estimate.cost
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0
    rows.push({
      ...product,
      sellingPrice,
      estimatedCost: estimate.cost,
      estimatedProfit: profit,
      estimatedMargin: margin,
      lastCostUpdate: new Date().toISOString(),
    })
  }

  return rows
}

export async function getProfitDashboard() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: orders } = await supabase
    .from("Order")
    .select("*, orderCost:OrderCost(*)")
    .gte("createdAt", today.toISOString())

  const { data: itemCosts } = await supabase
    .from("OrderItemCost")
    .select("*, product:Product(*)")
    .gte("createdAt", today.toISOString())

  const { data: movements } = await supabase
    .from("StockMovement")
    .select("*, rawMaterial:RawMaterial(*)")
    .eq("type", "SALE_CONSUMPTION")
    .gte("createdAt", today.toISOString())

  const revenue = (orders || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
  const cogs = (orders || []).reduce((sum, order) => sum + Number(order.orderCost?.[0]?.cogs || 0), 0)
  const grossProfit = revenue - cogs
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0

  const productMap = new Map<string, { name: string; profit: number; revenue: number; cogs: number }>()
  for (const row of itemCosts || []) {
    const current = productMap.get(row.productId) || {
      name: row.product?.name || "Product",
      profit: 0,
      revenue: 0,
      cogs: 0,
    }
    current.profit += Number(row.grossProfit || 0)
    current.revenue += Number(row.revenue || 0)
    current.cogs += Number(row.cogs || 0)
    productMap.set(row.productId, current)
  }

  const usageMap = new Map<string, { name: string; quantity: number; cost: number }>()
  for (const movement of movements || []) {
    const key = movement.rawMaterialId
    const current = usageMap.get(key) || {
      name: movement.rawMaterial?.name || "Ingredient",
      quantity: 0,
      cost: 0,
    }
    current.quantity += Number(movement.quantity || 0)
    current.cost += Number(movement.totalCost || 0)
    usageMap.set(key, current)
  }

  const productRanking = Array.from(productMap.values()).sort((a, b) => b.profit - a.profit)
  const ingredientUsage = Array.from(usageMap.values()).sort((a, b) => b.quantity - a.quantity)

  return {
    revenue,
    cogs,
    grossProfit,
    grossMargin,
    productRanking,
    ingredientUsage,
    topProfitableProduct: productRanking[0]?.name || "No sales yet",
    lowestMarginProduct: [...productRanking].sort((a, b) => (a.profit / Math.max(a.revenue, 1)) - (b.profit / Math.max(b.revenue, 1)))[0]?.name || "No sales yet",
    mostUsedIngredientToday: ingredientUsage[0]?.name || "No usage yet",
  }
}
