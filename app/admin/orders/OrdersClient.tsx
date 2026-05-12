"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { markOrderPaid, updateOrderStatus } from "./actions"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, ArrowRight, Banknote, ReceiptText } from "lucide-react"

type OrderItem = {
  id: string
  quantity: number
  productNameSnapshot: string
}

type Order = {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  fulfillmentType?: string | null
  total: number
  createdAt: string
  notes?: string | null
  user?: {
    name?: string | null
    phone?: string | null
    email?: string | null
  } | null
  items: OrderItem[]
}

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [orders, setOrders] = useState(initialOrders)

  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  useEffect(() => {
    const interval = window.setInterval(() => {
      startTransition(() => {
        router.refresh()
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [router, startTransition])

  const columns = [
    { id: "NEW", title: "New Orders", color: "bg-blue-50 border-blue-200", titleColor: "text-blue-700" },
    { id: "PREPARING", title: "Preparing", color: "bg-orange-50 border-orange-200", titleColor: "text-orange-700" },
    { id: "READY", title: "Ready for Pickup", color: "bg-green-50 border-green-200", titleColor: "text-green-700" },
  ]

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map((o) => o.id === orderId ? {
      ...o,
      status: newStatus,
      paymentStatus: newStatus === "COMPLETED" ? "PAID" : o.paymentStatus,
    } : o))
    await updateOrderStatus(orderId, newStatus)
  }

  const handleMarkPaid = async (orderId: string) => {
    setOrders(prev => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: "PAID" } : o))
    await markOrderPaid(orderId)
  }

  return (
    <div className="flex-1 overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max h-full">
        {columns.map(col => {
          const colOrders = orders.filter(o => o.status === col.id)
          return (
            <div key={col.id} className={`w-80 flex flex-col rounded-2xl border ${col.color}`}>
              <div className="p-4 border-b border-inherit">
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold ${col.titleColor}`}>{col.title}</h3>
                  <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">{colOrders.length}</span>
                </div>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {colOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusChange={handleStatusChange} 
                    onMarkPaid={handleMarkPaid}
                  />
                ))}
                {colOrders.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-sm text-muted-foreground">
                    No orders
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({
  order,
  onStatusChange,
  onMarkPaid,
}: {
  order: Order,
  onStatusChange: (id: string, status: string) => void,
  onMarkPaid: (id: string) => void,
}) {
  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0)
  const isCounterPending = order.paymentMethod === "Counter" && order.paymentStatus !== "PAID"
  const fulfillmentLabel = getFulfillmentLabel(order.fulfillmentType)
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-border/50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-bold text-sm">#{order.orderNumber}</span>
          <p className="text-xs text-muted-foreground">{order.user?.name || "Customer"}</p>
          <p className="text-[10px] text-muted-foreground">{order.user?.phone || order.user?.email || "No contact added"}</p>
        </div>
        <div className="flex items-center text-xs text-muted-foreground font-medium">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-foreground">
          {fulfillmentLabel}
        </span>
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-bold uppercase text-foreground">
          {order.paymentMethod === "Counter" ? "Pay at counter" : order.paymentMethod === "Online" ? "Online / Stripe pending" : order.paymentMethod}
        </span>
        <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
          order.paymentStatus === "PAID" ? "bg-success/20 text-success-foreground" : "bg-warning/20 text-warning-foreground"
        }`}>
          {order.paymentStatus === "PAID" ? "Paid" : "Payment pending"}
        </span>
      </div>
      
      <div className="py-2 mb-2 border-y border-dashed space-y-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-xs">
            <span><span className="font-bold">{item.quantity}x</span> {item.productNameSnapshot}</span>
          </div>
        ))}
        {order.notes && <p className="text-[10px] italic text-muted-foreground mt-1 text-red-500">Note: {order.notes}</p>}
      </div>
      
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-muted-foreground">{itemCount} items</span>
        <span className="font-mono font-bold text-primary">RM{order.total.toFixed(2)}</span>
      </div>

      <div className="flex gap-2 mb-2">
        <a 
          href={`/app/orders/${order.id}/receipt`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 text-center py-2 rounded-lg bg-secondary text-[10px] font-bold uppercase hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
        >
          <ReceiptText className="w-3 h-3" />
          View Receipt
        </a>
      </div>

      {isCounterPending && (
        <Button size="sm" variant="outline" className="mb-2 w-full" onClick={() => onMarkPaid(order.id)}>
          <Banknote className="mr-1 h-4 w-4" />
          Mark Counter Payment Paid
        </Button>
      )}

      <div className="flex gap-2">
        {order.status === "NEW" && (
          <>
            <Button size="sm" variant="outline" className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => onStatusChange(order.id, "CANCELLED")}>
              Reject
            </Button>
            <Button size="sm" className="flex-1" onClick={() => onStatusChange(order.id, "PREPARING")}>
              Prepare
            </Button>
          </>
        )}
        {order.status === "PREPARING" && (
          <Button size="sm" className="w-full bg-warning text-warning-foreground hover:bg-warning/90" onClick={() => onStatusChange(order.id, "READY")}>
            Ready for Pickup <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        )}
        {order.status === "READY" && (
          <Button size="sm" className="w-full bg-success text-success-foreground hover:bg-success/90" onClick={() => onStatusChange(order.id, "COMPLETED")}>
            Complete Order <CheckCircle2 className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}

function getFulfillmentLabel(value?: string | null) {
  if (value === "DINE_IN") return "Dine-in"
  if (value === "WALK_IN") return "Walk-in"
  return "Takeaway"
}
