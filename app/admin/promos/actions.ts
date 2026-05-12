"use server"

import { auth } from "@/lib/auth"
import { createPromo, updatePromo, deletePromo, PromoInput } from "@/lib/supabase/promos"
import { revalidatePath } from "next/cache"

async function ensureAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
}

export async function createPromoAction(formData: FormData) {
  await ensureAdmin()
  
  const code = formData.get("code") as string
  const description = formData.get("description") as string
  const discountType = formData.get("discountType") as 'PERCENTAGE' | 'FIXED'
  const discountValue = parseFloat(formData.get("discountValue") as string) || 0
  const minOrderAmount = parseFloat(formData.get("minOrderAmount") as string) || 0
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null
  const startsAt = formData.get("startsAt") ? new Date(formData.get("startsAt") as string).toISOString() : new Date().toISOString()
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string).toISOString() : null
  const isActive = formData.get("isActive") === "on"

  await createPromo({
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxUses,
    startsAt,
    expiresAt,
    isActive
  })
  
  revalidatePath("/admin/promos")
}

export async function updatePromoAction(id: string, formData: FormData) {
  await ensureAdmin()

  const code = formData.get("code") as string
  const description = formData.get("description") as string
  const discountType = formData.get("discountType") as 'PERCENTAGE' | 'FIXED'
  const discountValue = parseFloat(formData.get("discountValue") as string) || 0
  const minOrderAmount = parseFloat(formData.get("minOrderAmount") as string) || 0
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string) : null
  const startsAt = formData.get("startsAt") ? new Date(formData.get("startsAt") as string).toISOString() : undefined
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string).toISOString() : null
  const isActive = formData.get("isActive") === "on"

  await updatePromo(id, {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxUses,
    startsAt,
    expiresAt,
    isActive
  })
  
  revalidatePath("/admin/promos")
}

export async function togglePromoActive(id: string, isActive: boolean) {
  await ensureAdmin()
  await updatePromo(id, { isActive })
  revalidatePath("/admin/promos")
}

export async function deletePromoAction(id: string) {
  await ensureAdmin()
  await deletePromo(id)
  revalidatePath("/admin/promos")
}
