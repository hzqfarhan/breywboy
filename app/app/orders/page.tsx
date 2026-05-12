export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth"
import { getUserOrders } from "@/lib/supabase/orders"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import Link from "next/link"
import { Coffee, ChevronRight, ReceiptText } from "lucide-react"

type OrderItem = {
  quantity: number
}

type Order = {
  id: string
  orderNumber: string
  status: string
  total: number
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

export default async function OrdersPage() {
  const session = await auth()
  const orders = await getUserOrders(session?.user?.id || '')

  const activeOrders = orders.filter(o => ["NEW", "PREPARING", "READY"].includes(o.status))
  const pastOrders = orders.filter(o => ["COMPLETED", "CANCELLED"].includes(o.status))

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title="Your Orders" />
      
      <div className="p-4 space-y-6">
        
        {activeOrders.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-heading font-bold text-lg text-primary">Active Orders</h3>
            <div className="space-y-3">
              {activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          </section>
        )}

        <section className="space-y-3">
          <h3 className="font-heading font-bold text-lg text-primary">Past Orders</h3>
          {pastOrders.length > 0 ? (
            <div className="space-y-3">
              {pastOrders.map(order => <OrderCard key={order.id} order={order} />)}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No past orders yet.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0)
  const isCompleted = order.status === "COMPLETED"
  const isCancelled = order.status === "CANCELLED"
  
  return (
    <Link href={`/app/orders/${order.id}`}>
      <div className="bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between hover:shadow-md transition-all">
        <div className="flex gap-4 items-center">
          <div className={`p-3 rounded-full ${isCompleted ? 'bg-secondary' : isCancelled ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">Order #{order.orderNumber}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCompleted ? 'bg-success/20 text-success-foreground' : 
                isCancelled ? 'bg-destructive/20 text-destructive' : 
                'bg-accent/20 text-accent'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {itemCount} items • RM{order.total.toFixed(2)}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground">
              {order.paymentMethod === "Counter" ? "Pay at counter" : "Online"} - {order.paymentStatus === "PAID" ? "Paid" : "Payment pending"}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ReceiptText className="h-4 w-4" />
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </Link>
  )
}
