"use server"

import type { CartItem } from "@/lib/store"
import { auth } from "@/lib/auth"
import { createWalkInOrder } from "@/lib/supabase/orders"
import { revalidatePath } from "next/cache"

export async function createWalkInOrderAction(
  cartItems: CartItem[],
  paymentMethod: string,
  customerName: string,
  notes: string
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")
  if (cartItems.length === 0) throw new Error("Cart is empty")

  const order = await createWalkInOrder(
    cartItems,
    paymentMethod,
    customerName.trim(),
    notes.trim()
  )

  revalidatePath("/admin")
  revalidatePath("/admin/orders")
  revalidatePath("/admin/pos")

  return {
    id: order.id as string,
    orderNumber: order.orderNumber as string,
  }
}
