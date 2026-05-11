"use server"

import { prisma, auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  })

  revalidatePath("/admin/orders")
}
