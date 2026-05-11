"use server"

import { prisma, auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function toggleProductAvailability(id: string, isAvailable: boolean) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized")

  await prisma.product.update({
    where: { id },
    data: { isAvailable }
  })

  revalidatePath("/admin/menu")
  revalidatePath("/app/menu")
}
