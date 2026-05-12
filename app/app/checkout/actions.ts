"use server"

import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { CartItem } from "@/lib/store"
import { createOrder } from "@/lib/supabase/orders"
import { getPromoByCode, incrementPromoUsage } from "@/lib/supabase/promos"
import { upsertUser } from "@/lib/supabase/users"

export async function createOrderAction(
  cartItems: CartItem[],
  paymentMethod: string,
  pickupTime: string,
  fulfillmentType: string,
  promoData?: { id: string, code: string, discount: number }
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await upsertUser({
    id: session.user.id,
    name: session.user.name || "Breywboy Customer",
    email: session.user.email || `${session.user.id}@breywboy.local`,
    passwordHash: "",
    role: session.user.role || "CUSTOMER",
    points: 0,
  })

  const order = await createOrder(
    session.user.id,
    cartItems,
    paymentMethod,
    pickupTime,
    fulfillmentType,
    promoData
  )

  if (promoData?.id) {
    await incrementPromoUsage(promoData.id)
  }

  revalidatePath("/app")
  revalidatePath("/app/orders")
  revalidatePath("/admin")
  revalidatePath("/admin/orders")

  return { orderId: order.id }
}

export async function validatePromoAction(code: string, subtotal: number) {
  const promo = await getPromoByCode(code)
  if (!promo) return { success: false, message: "Invalid promo code" }
  
  if (subtotal < (promo.minOrderAmount || 0)) {
    return { success: false, message: `Min order RM${promo.minOrderAmount.toFixed(2)} required` }
  }

  if (promo.maxUses && (promo.currentUses || 0) >= promo.maxUses) {
    return { success: false, message: "Promo code has reached max usage" }
  }

  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    return { success: false, message: "Promo code has expired" }
  }

  let discount = 0
  if (promo.discountType === 'PERCENTAGE') {
    discount = (subtotal * promo.discountValue) / 100
  } else {
    discount = promo.discountValue
  }

  return {
    success: true,
    promo: {
      id: promo.id,
      code: promo.code,
      discount: Math.min(discount, subtotal)
    }
  }
}
