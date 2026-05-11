export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase"
import { OrdersClient } from "./OrdersClient"

export default async function AdminOrdersPage() {
  const { data: rawOrders } = await supabase
    .from('Order')
    .select('*, user:User(name, phone), items:OrderItem(*)')
    .order('createdAt', { ascending: true })

  const orders = rawOrders || []

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
