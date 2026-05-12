"use server"

import { auth } from "@/lib/auth"
import { createCategory, updateCategory, deleteCategory } from "@/lib/supabase/categories"
import { revalidatePath } from "next/cache"

async function ensureAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
}

export async function createCategoryAction(formData: FormData) {
  await ensureAdmin()
  
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await createCategory({ name, slug, sortOrder, isActive })
  revalidatePath("/admin/categories")
  revalidatePath("/app/menu")
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await ensureAdmin()

  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await updateCategory(id, { name, slug, sortOrder, isActive })
  revalidatePath("/admin/categories")
  revalidatePath("/app/menu")
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  await ensureAdmin()
  await updateCategory(id, { isActive })
  revalidatePath("/admin/categories")
  revalidatePath("/app/menu")
}

export async function deleteCategoryAction(id: string) {
  await ensureAdmin()
  await deleteCategory(id)
  revalidatePath("/admin/categories")
  revalidatePath("/app/menu")
}
