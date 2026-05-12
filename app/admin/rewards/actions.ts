"use server"

import { auth } from "@/lib/auth"
import { createReward, updateReward, deleteReward } from "@/lib/supabase/rewards"
import { revalidatePath } from "next/cache"

async function ensureAdmin() {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
}

export async function createRewardAction(formData: FormData) {
  await ensureAdmin()
  
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const pointsRequired = parseInt(formData.get("pointsRequired") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await createReward({ name, description, pointsRequired, isActive })
  revalidatePath("/admin/rewards")
  revalidatePath("/app/rewards")
}

export async function updateRewardAction(id: string, formData: FormData) {
  await ensureAdmin()

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const pointsRequired = parseInt(formData.get("pointsRequired") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await updateReward(id, { name, description, pointsRequired, isActive })
  revalidatePath("/admin/rewards")
  revalidatePath("/app/rewards")
}

export async function toggleRewardActive(id: string, isActive: boolean) {
  await ensureAdmin()
  await updateReward(id, { isActive })
  revalidatePath("/admin/rewards")
  revalidatePath("/app/rewards")
}

export async function deleteRewardAction(id: string) {
  await ensureAdmin()
  await deleteReward(id)
  revalidatePath("/admin/rewards")
  revalidatePath("/app/rewards")
}
