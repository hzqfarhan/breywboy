import { prisma } from "@/lib/auth"
import { MenuClient } from "./MenuClient"

export default async function AdminMenuPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }]
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Menu Management</h2>
          <p className="text-muted-foreground text-sm">Manage your products and availability</p>
        </div>
      </div>
      
      <MenuClient initialProducts={products} />
    </div>
  )
}
