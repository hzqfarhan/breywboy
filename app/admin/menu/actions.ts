"use server"

import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await supabase
    .from('Product')
    .update({ isAvailable })
    .eq('id', id)

  revalidatePath("/admin/menu")
  revalidatePath("/app/menu")
}
