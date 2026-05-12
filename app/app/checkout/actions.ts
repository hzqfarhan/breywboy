"use server"

import { auth } from "@/lib/auth"
import type { CartItem } from "@/lib/store"
import { createOrder } from "@/lib/supabase/orders"
import { redirect } from "next/navigation"

export async function createOrderAction(
  cartItems: CartItem[],
  paymentMethod: string,
  pickupTime: string
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const order = await createOrder(
    session.user.id,
    cartItems,
    paymentMethod,
    pickupTime
  )

  redirect(`/app/orders/${order.id}`)
}
