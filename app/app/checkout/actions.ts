"use server"

import { auth } from "@/lib/auth"
import type { CartItem } from "@/lib/store"
import { createOrder } from "@/lib/supabase/orders"
import { getPromoByCode, incrementPromoUsage } from "@/lib/supabase/promos"
import { redirect } from "next/navigation"

export async function createOrderAction(
  cartItems: CartItem[],
  paymentMethod: string,
  pickupTime: string,
  fulfillmentType: string,
  promoData?: { id: string, code: string, discount: number }
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

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

  redirect(`/app/orders/${order.id}`)
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
