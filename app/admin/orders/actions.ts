"use server"

import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await supabase
    .from('Order')
    .update({ status: newStatus })
    .eq('id', orderId)

  revalidatePath("/admin/orders")
}
