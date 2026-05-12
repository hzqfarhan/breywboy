"use server"

import { updateUser } from "@/lib/supabase/users"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateProfileDetails(data: { name?: string, phone?: string, favouriteDrink?: string }) {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Unauthorized" }

  const res = await updateUser(session.user.id, data)
  
  if (res && typeof res === 'object' && res.success) {
    revalidatePath("/app/profile")
    revalidatePath("/app")
    return { success: true }
  }
  
  return { success: false, error: "Failed to update profile" }
}
