import { prisma } from "@/lib/auth"
import { MenuClient } from "./MenuClient"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      products: {
        where: { isAvailable: true }
      }
    }
  })

  const addOns = await prisma.addOn.findMany({
    where: { isAvailable: true }
  })

  return (
    <div className="flex flex-col h-full bg-background">
      <CustomerTopBar title="Menu" />
      <MenuClient categories={categories} addOns={addOns} />
    </div>
  )
}
