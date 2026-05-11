export const dynamic = "force-dynamic";
import { getAllOrders } from "@/lib/supabase/orders"
import { OrdersClient } from "./OrdersClient"

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

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
