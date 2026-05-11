export const dynamic = "force-dynamic";
import { prisma } from "@/lib/auth"
import { OrdersClient } from "./OrdersClient"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, phone: true } },
      items: true
    },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Order Management</h2>
          <p className="text-muted-foreground text-sm">Manage incoming orders</p>
        </div>
      </div>
      
      <OrdersClient initialOrders={orders} />
    </div>
  )
}
