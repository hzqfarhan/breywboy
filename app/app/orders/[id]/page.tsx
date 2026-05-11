import { prisma, auth } from "@/lib/auth"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { notFound } from "next/navigation"
import { OrderTracker } from "./OrderTracker"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Coffee } from "lucide-react"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true }
  })

  if (!order || order.userId !== session?.user?.id) {
    notFound()
  }

  const isCompleted = order.status === "COMPLETED" || order.status === "CANCELLED"

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title={`Order #${order.orderNumber}`} showBack />
      
      <div className="p-4 space-y-6 pb-32">
        <div className="bg-white p-6 rounded-3xl shadow-sm border text-center">
          <h2 className="text-2xl font-heading font-bold text-primary mb-1">
            {order.status === "NEW" && "Order Received!"}
            {order.status === "PREPARING" && "Brewing now..."}
            {order.status === "READY" && "Ready for pickup!"}
            {order.status === "COMPLETED" && "Order Completed"}
            {order.status === "CANCELLED" && "Order Cancelled"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {order.status === "NEW" && "We've received your order and will start preparing it soon."}
            {order.status === "PREPARING" && "Our baristas are crafting your drinks."}
            {order.status === "READY" && "Your order is ready at the counter."}
            {order.status === "COMPLETED" && "Hope you enjoyed your Breywboy experience."}
            {order.status === "CANCELLED" && "This order was cancelled."}
          </p>
        </div>

        {!isCompleted && <OrderTracker status={order.status} />}

        <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-4">
          <h3 className="font-bold text-sm">Order Summary</h3>
          <div className="space-y-3">
            {order.items.map(item => {
              const customs = JSON.parse(item.customizations)
              return (
                <div key={item.id} className="flex gap-3 text-sm">
                  <span className="font-mono font-bold text-primary">{item.quantity}x</span>
                  <div className="flex-1">
                    <p className="font-bold">{item.productNameSnapshot}</p>
                    <p className="text-xs text-muted-foreground">
                      {customs.size}, {customs.temperature}
                    </p>
                  </div>
                  <span className="font-mono">RM{item.total.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
          
          <div className="pt-3 border-t flex justify-between font-bold text-lg text-primary">
            <span>Total</span>
            <span className="font-mono">RM{order.total.toFixed(2)}</span>
          </div>
        </div>

        {isCompleted && (
          <div className="flex gap-4">
            <Link href="/app/menu" className="w-full">
              <Button size="lg" className="w-full rounded-full shadow-md">
                Order Again
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
