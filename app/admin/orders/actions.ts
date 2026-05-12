"use server"

import { auth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { consumeInventoryForOrder } from "@/lib/supabase/fifo"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  const updates: Record<string, string> = { status: newStatus }
  if (newStatus === "COMPLETED") updates.paymentStatus = "PAID"

  await supabase
    .from('Order')
    .update(updates)
    .eq('id', orderId)

  if (newStatus === "PREPARING") {
    await consumeInventoryForOrder(orderId)
  }

  revalidatePath("/admin/orders")
  revalidatePath("/admin")
  revalidatePath("/admin/inventory")
  revalidatePath("/admin/profit")
  revalidatePath("/app/orders")
}

export async function markOrderPaid(orderId: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await supabase
    .from("Order")
    .update({ paymentStatus: "PAID" })
    .eq("id", orderId)

  revalidatePath("/admin/orders")
  revalidatePath("/app/orders")
}
