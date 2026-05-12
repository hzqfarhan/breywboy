"use server"

import { auth } from "@/lib/auth"
import {
  createProduct,
  deleteProduct,
  setProductAvailability,
  updateProduct,
  type ProductInput,
} from "@/lib/supabase/menu"
import { revalidatePath } from "next/cache"

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await setProductAvailability(id, isAvailable)

  revalidatePath("/admin/menu")
  revalidatePath("/app/menu")
}

function toNumber(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

function productInputFromForm(formData: FormData): ProductInput {
  const hasTemperatureOption = formData.get("hasTemperatureOption") === "on"
  const basePrice = toNumber(formData.get("basePrice"))
  const hotPrice = toNumber(formData.get("hotPrice"))
  const icedPrice = toNumber(formData.get("icedPrice"))

  return {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    categoryId: String(formData.get("categoryId") || ""),
    imageUrl: String(formData.get("imageUrl") || "").trim() || null,
    basePrice: hasTemperatureOption ? null : basePrice,
    hotPrice: hasTemperatureOption ? hotPrice : null,
    icedPrice: hasTemperatureOption ? icedPrice : null,
    hasTemperatureOption,
    allowHot: hasTemperatureOption && formData.get("allowHot") === "on",
    allowIced: hasTemperatureOption && formData.get("allowIced") === "on",
    allowOatMilk: formData.get("allowOatMilk") === "on",
    allowExtraShot: formData.get("allowExtraShot") === "on",
    isAvailable: formData.get("isAvailable") === "on",
    isPopular: formData.get("isPopular") === "on",
  }
}

function revalidateMenuViews() {
  revalidatePath("/admin/menu")
  revalidatePath("/admin/storefront")
  revalidatePath("/app/menu")
  revalidatePath("/menu")
}

export async function createProductAction(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const input = productInputFromForm(formData)
  if (!input.name || !input.categoryId) throw new Error("Name and category are required")

  await createProduct(input)
  revalidateMenuViews()
}

export async function updateProductAction(id: string, formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const input = productInputFromForm(formData)
  if (!input.name || !input.categoryId) throw new Error("Name and category are required")

  await updateProduct(id, input)
  revalidateMenuViews()
}

export async function deleteProductAction(id: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await deleteProduct(id)
  revalidateMenuViews()
}
