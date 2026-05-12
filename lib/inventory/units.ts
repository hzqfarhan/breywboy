export const inventoryUnits = ["g", "kg", "ml", "L", "pcs", "pack", "bottle", "carton"] as const

export type InventoryUnit = (typeof inventoryUnits)[number]

const baseUnitByUnit: Record<InventoryUnit, InventoryUnit> = {
  g: "g",
  kg: "g",
  ml: "ml",
  L: "ml",
  pcs: "pcs",
  pack: "pack",
  bottle: "bottle",
  carton: "carton",
}

const factorToBase: Record<InventoryUnit, number> = {
  g: 1,
  kg: 1000,
  ml: 1,
  L: 1000,
  pcs: 1,
  pack: 1,
  bottle: 1,
  carton: 1,
}

export function getBaseUnit(unit: string): InventoryUnit {
  return baseUnitByUnit[unit as InventoryUnit] || (unit as InventoryUnit)
}

export function toBaseQuantity(quantity: number, unit: string) {
  return quantity * (factorToBase[unit as InventoryUnit] || 1)
}

export function convertQuantity(quantity: number, fromUnit: string, toUnit: string) {
  const fromBase = getBaseUnit(fromUnit)
  const toBase = getBaseUnit(toUnit)

  if (fromBase !== toBase) {
    throw new Error(`Cannot convert ${fromUnit} to ${toUnit}`)
  }

  const baseQuantity = toBaseQuantity(quantity, fromUnit)
  return baseQuantity / (factorToBase[toUnit as InventoryUnit] || 1)
}

export function calculateCostPerBaseUnit(quantity: number, unit: string, totalCost: number) {
  const baseQuantity = toBaseQuantity(quantity, unit)
  if (baseQuantity <= 0) return 0
  return totalCost / baseQuantity
}
