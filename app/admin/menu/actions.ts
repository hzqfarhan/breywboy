"use server"

import { auth } from "@/lib/auth"
import { setProductAvailability } from "@/lib/supabase/menu"
import { revalidatePath } from "next/cache"

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") throw new Error("Unauthorized")

  await setProductAvailability(id, isAvailable)

  revalidatePath("/admin/menu")
  revalidatePath("/app/menu")
}
