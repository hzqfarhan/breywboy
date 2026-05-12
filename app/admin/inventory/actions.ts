"use server"

import { auth } from "@/lib/auth"
import { createPurchaseWithBatch, saveRecipe, upsertRawMaterial } from "@/lib/supabase/inventory"
import { revalidatePath } from "next/cache"

function requireAdmin(role?: string | null) {
  if (role !== "ADMIN") throw new Error("Unauthorized")
}

export async function saveRawMaterialAction(formData: FormData) {
  const session = await auth()
  requireAdmin(session?.user?.role)

  await upsertRawMaterial({
    name: String(formData.get("name") || ""),
    sku: String(formData.get("sku") || ""),
    category: String(formData.get("category") || "Other"),
    unit: String(formData.get("unit") || "pcs"),
    minimumStock: Number(formData.get("minimumStock") || 0),
    isPerishable: formData.get("isPerishable") === "on",
  }, String(formData.get("id") || "") || undefined)

  revalidatePath("/admin/inventory")
  revalidatePath("/admin/inventory/materials")
}

export async function createPurchaseAction(formData: FormData) {
  const session = await auth()
  requireAdmin(session?.user?.role)

  await createPurchaseWithBatch({
    supplierId: String(formData.get("supplierId") || ""),
    invoiceNumber: String(formData.get("invoiceNumber") || "") || null,
    purchaseDate: String(formData.get("purchaseDate") || new Date().toISOString().slice(0, 10)),
    notes: String(formData.get("notes") || "") || null,
    items: [{
      rawMaterialId: String(formData.get("rawMaterialId") || ""),
      quantity: Number(formData.get("quantity") || 0),
      unit: String(formData.get("unit") || "pcs"),
      totalCost: Number(formData.get("totalCost") || 0),
      expiryDate: String(formData.get("expiryDate") || "") || null,
    }],
  })

  revalidatePath("/admin/inventory")
  revalidatePath("/admin/inventory/batches")
  revalidatePath("/admin/inventory/purchases")
}

export async function saveRecipeAction(formData: FormData) {
  const session = await auth()
  requireAdmin(session?.user?.role)

  const rawMaterialIds = formData.getAll("rawMaterialId").map(String)
  const quantities = formData.getAll("quantity").map(Number)
  const units = formData.getAll("unit").map(String)
  const wastePercents = formData.getAll("wastePercent").map(Number)

  await saveRecipe(
    String(formData.get("productId") || ""),
    String(formData.get("name") || "Recipe"),
    rawMaterialIds
      .map((rawMaterialId, index) => ({
        rawMaterialId,
        quantity: quantities[index] || 0,
        unit: units[index] || "pcs",
        wastePercent: wastePercents[index] || 0,
      }))
      .filter((item) => item.rawMaterialId && item.quantity > 0),
    String(formData.get("recipeId") || "") || undefined
  )

  revalidatePath("/admin/inventory/recipes")
  revalidatePath("/admin/profit/products")
}
