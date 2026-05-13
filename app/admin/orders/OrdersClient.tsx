"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { markOrderPaid, updateOrderStatus } from "./actions"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, ArrowRight, Banknote, ReceiptText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type OrderItem = {
  id: string
  quantity: number
  productNameSnapshot: string
  unitPrice?: number | null
  total?: number | null
  customizations?: string | null
}

type Order = {
  id: string
  orderNumber: string
  status: string
  paymentMethod: string
  paymentStatus: string
  fulfillmentType?: string | null
  total: number
  subtotal?: number | null
  discount?: number | null
  promoCode?: string | null
  pickupTime?: string | null
  createdAt: string
  notes?: string | null
  user?: {
    name?: string | null
    phone?: string | null
    email?: string | null
  } | null
  items: OrderItem[]
}

const POLL_INTERVAL_MS = 5000

const columns = [
  { id: "NEW", title: "New Orders", color: "bg-blue-50 border-blue-200", titleColor: "text-blue-700" },
  { id: "PREPARING", title: "Preparing", color: "bg-orange-50 border-orange-200", titleColor: "text-orange-700" },
  { id: "READY", title: "Ready for Pickup", color: "bg-green-50 border-green-200", titleColor: "text-green-700" },
] as const

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null)
  const ordersSignatureRef = useRef(getOrdersSignature(initialOrders))

  useEffect(() => {
    const nextSignature = getOrdersSignature(initialOrders)
    if (ordersSignatureRef.current !== nextSignature) {
      ordersSignatureRef.current = nextSignature
      setOrders(initialOrders)
    }
  }, [initialOrders])

  useEffect(() => {
    let isPolling = false
    const controller = new AbortController()

    const refreshOrders = async () => {
      if (isPolling || document.visibilityState === "hidden") return
      isPolling = true

      try {
        const response = await fetch("/api/admin/orders", {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        })

        if (response.ok) {
          const data = await response.json() as { orders?: Order[] }
          const nextOrders = data.orders || []
          const nextSignature = getOrdersSignature(nextOrders)

          if (ordersSignatureRef.current !== nextSignature) {
            ordersSignatureRef.current = nextSignature
            setOrders(nextOrders)
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("[orders] refresh failed:", error)
        }
      } finally {
        isPolling = false
      }
    }

    const interval = window.setInterval(refreshOrders, POLL_INTERVAL_MS)

    return () => {
      controller.abort()
      window.clearInterval(interval)
    }
  }, [])

  const ordersByStatus = useMemo(() => {
    return columns.reduce<Record<(typeof columns)[number]["id"], Order[]>>((groups, column) => {
      groups[column.id] = []
      return groups
    }, { NEW: [], PREPARING: [], READY: [] })
  }, [])

  const groupedOrders = useMemo(() => {
    const groups = { ...ordersByStatus, NEW: [...ordersByStatus.NEW], PREPARING: [...ordersByStatus.PREPARING], READY: [...ordersByStatus.READY] }

    for (const order of orders) {
      if (order.status === "NEW" || order.status === "PREPARING" || order.status === "READY") {
        groups[order.status].push(order)
      }
    }

    return groups
  }, [orders, ordersByStatus])

  const handleStatusChange = useCallback(async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map((o) => o.id === orderId ? {
      ...o,
      status: newStatus,
      paymentStatus: newStatus === "COMPLETED" ? "PAID" : o.paymentStatus,
    } : o))
    ordersSignatureRef.current = ""
    await updateOrderStatus(orderId, newStatus)
  }, [])

  const handleMarkPaid = useCallback(async (orderId: string) => {
    setOrders(prev => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: "PAID" } : o))
    ordersSignatureRef.current = ""
    await markOrderPaid(orderId)
  }, [])

  return (
    <div className="flex-1 overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max h-full">
        {columns.map(col => {
          const colOrders = groupedOrders[col.id]
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
                    onViewReceipt={setReceiptOrder}
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

      <Dialog open={Boolean(receiptOrder)} onOpenChange={(open) => !open && setReceiptOrder(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {receiptOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Receipt #{receiptOrder.orderNumber}</DialogTitle>
              </DialogHeader>
              <ReceiptPreview order={receiptOrder} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const OrderCard = memo(function OrderCard({
  order,
  onViewReceipt,
  onStatusChange,
  onMarkPaid,
}: {
  order: Order,
  onViewReceipt: (order: Order) => void,
  onStatusChange: (id: string, status: string) => void,
  onMarkPaid: (id: string) => void,
}) {
  const itemCount = useMemo(() => order.items.reduce((acc, item) => acc + item.quantity, 0), [order.items])
  const isCounterPending = order.paymentMethod === "Counter" && order.paymentStatus !== "PAID"
  const fulfillmentLabel = getFulfillmentLabel(order.fulfillmentType)
  const createdTime = useMemo(() => {
    return new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }, [order.createdAt])
  
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
          {createdTime}
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
        <button
          type="button"
          onClick={() => onViewReceipt(order)}
          className="flex-1 text-center py-2 rounded-lg bg-secondary text-[10px] font-bold uppercase hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
        >
          <ReceiptText className="w-3 h-3" />
          View Receipt
        </button>
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
          <Button
            size="sm"
            className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
            onClick={() => {
              announceReadyOrder(order.orderNumber)
              onStatusChange(order.id, "READY")
            }}
          >
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
})

function ReceiptPreview({ order }: { order: Order }) {
  const subtotal = order.subtotal ?? order.total
  const discount = order.discount ?? 0

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="border-b border-dashed p-5 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
          <ReceiptText className="h-6 w-6" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-primary">Breywboy</h2>
        <p className="text-xs text-muted-foreground">Official Receipt</p>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <ReceiptField label="Order" value={`#${order.orderNumber}`} />
          <ReceiptField label="Status" value={order.status} />
          <ReceiptField label="Date" value={formatDateTime(order.createdAt)} />
          <ReceiptField label={order.fulfillmentType === "DINE_IN" ? "Serve" : "Pickup"} value={order.pickupTime ? formatDateTime(order.pickupTime) : "-"} />
          <ReceiptField label="Type" value={getFulfillmentLabel(order.fulfillmentType)} />
          <ReceiptField label="Payment" value={getPaymentLabel(order.paymentMethod)} />
          <ReceiptField label="Paid" value={order.paymentStatus === "PAID" ? "Yes" : "Pending"} />
          <ReceiptField label="Customer" value={order.user?.name || "Customer"} />
        </div>

        <div className="border-y border-dashed py-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => {
              const details = parseCustomizations(item.customizations)
              const lineTotal = item.total ?? (item.unitPrice ?? 0) * item.quantity

              return (
                <div key={item.id} className="text-sm">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold">{item.quantity}x {item.productNameSnapshot}</p>
                      {details && <p className="text-xs text-muted-foreground">{details}</p>}
                      {item.unitPrice != null && (
                        <p className="font-mono text-[11px] text-muted-foreground">RM{item.unitPrice.toFixed(2)} each</p>
                      )}
                    </div>
                    <p className="font-mono font-bold">RM{lineTotal.toFixed(2)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <TotalRow label="Subtotal" value={subtotal} />
          {discount > 0 && (
            <div className="flex justify-between text-sm text-success-foreground font-medium italic">
              <span>Discount ({order.promoCode || "Promo"})</span>
              <span className="font-mono">-RM{discount.toFixed(2)}</span>
            </div>
          )}
          <TotalRow label="Total" value={order.total} strong />
        </div>

        {order.paymentStatus !== "PAID" && (
          <p className="rounded-xl bg-warning/10 p-3 text-xs text-warning-foreground">
            Payment is still pending. Customer should show this receipt at the counter.
          </p>
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

function getPaymentLabel(value: string) {
  if (value === "Counter") return "Pay at counter"
  if (value === "Online") return "Online / Stripe pending"
  return value
}

function ReceiptField({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-medium text-foreground">{value}</p>
    </div>
  )
}

function TotalRow({ label, value, strong = false }: { label: string, value: number, strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "text-lg font-bold text-primary" : "text-sm"}`}>
      <span>{label}</span>
      <span className="font-mono">RM{value.toFixed(2)}</span>
    </div>
  )
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })
}

function parseCustomizations(customizations?: string | null) {
  if (!customizations) return ""

  try {
    const parsed = JSON.parse(customizations)
    const parts = [
      parsed.size,
      parsed.temperature,
      Array.isArray(parsed.addOns) && parsed.addOns.length > 0
        ? parsed.addOns.map((addOn: { name?: string }) => addOn.name).filter(Boolean).join(", ")
        : "",
      parsed.instructions ? `Note: ${parsed.instructions}` : "",
    ].filter(Boolean)

    return parts.join(" / ")
  } catch {
    return ""
  }
}

function announceReadyOrder(orderNumber: string) {
  if (!("speechSynthesis" in window)) return

  const spokenOrderNumber = orderNumber
    .replace(/^BB-/i, "")
    .split("")
    .join(" ")

  const utterance = new SpeechSynthesisUtterance(spokenOrderNumber)
  utterance.lang = "en-US"
  utterance.rate = 0.9
  utterance.pitch = 1
  utterance.volume = 1

  window.speechSynthesis.resume()
  window.speechSynthesis.speak(utterance)
}

function getOrdersSignature(orders: Order[]) {
  return orders
    .map((order) => [
      order.id,
      order.status,
      order.paymentStatus,
      order.total,
      order.items.length,
      order.items.map((item) => `${item.id}:${item.quantity}`).join(","),
    ].join(":"))
    .join("|")
}
