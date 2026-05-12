export const dynamic = "force-dynamic";

import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { getOrderById } from "@/lib/supabase/orders"
import { ArrowLeft, ReceiptText } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

type OrderItem = {
  id: string
  productNameSnapshot: string
  unitPrice: number
  quantity: number
  total: number
  customizations: string | null
}

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const order = await getOrderById(params.id)

  const isAdmin = session?.user?.role === "ADMIN"
  const isOwner = order?.userId === session?.user?.id

  if (!order || (!isOwner && !isAdmin)) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CustomerTopBar title={`Receipt #${order.orderNumber}`} showBack />

      <main className="p-4 pb-32">
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b border-dashed p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              <ReceiptText className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-primary">Breywboy</h1>
            <p className="text-xs text-muted-foreground">Official Receipt</p>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <ReceiptField label="Order" value={`#${order.orderNumber}`} />
              <ReceiptField label="Status" value={order.status} />
              <ReceiptField label="Date" value={new Date(order.createdAt).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })} />
              <ReceiptField label={order.fulfillmentType === "DINE_IN" ? "Serve" : "Pickup"} value={new Date(order.pickupTime).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" })} />
              <ReceiptField label="Type" value={getFulfillmentLabel(order.fulfillmentType)} />
              <ReceiptField label="Payment" value={order.paymentMethod === "Counter" ? "Pay at counter" : "Online - Stripe pending"} />
              <ReceiptField label="Paid" value={order.paymentStatus === "PAID" ? "Yes" : "Pending"} />
            </div>

            <div className="border-y border-dashed py-4">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Items</h2>
              <div className="space-y-3">
                {order.items.map((item: OrderItem) => {
                  const details = parseCustomizations(item.customizations)

                  return (
                    <div key={item.id} className="text-sm">
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold">{item.quantity}x {item.productNameSnapshot}</p>
                          {details && <p className="text-xs text-muted-foreground">{details}</p>}
                          <p className="font-mono text-[11px] text-muted-foreground">RM{item.unitPrice.toFixed(2)} each</p>
                        </div>
                        <p className="font-mono font-bold">RM{item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <TotalRow label="Subtotal" value={order.subtotal} />
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-success-foreground font-medium italic">
                  <span>Discount ({order.promoCode || 'Promo'})</span>
                  <span className="font-mono">-RM{order.discount.toFixed(2)}</span>
                </div>
              )}
              <TotalRow label="Total" value={order.total} strong />
            </div>

            {order.paymentStatus !== "PAID" && (
              <p className="rounded-xl bg-warning/10 p-3 text-xs text-warning-foreground">
                Payment is still pending. Please show this receipt at the counter.
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-md">
          <Link
            href={`/app/orders/${order.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full rounded-full")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Order Status
          </Link>
        </div>
      </main>
    </div>
  )
}

function getFulfillmentLabel(value?: string | null) {
  if (value === "DINE_IN") return "Dine-in"
  if (value === "WALK_IN") return "Walk-in"
  return "Takeaway"
}

function ReceiptField({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-xl bg-secondary p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
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

function parseCustomizations(customizations: string | null) {
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

    return parts.join(" • ")
  } catch {
    return ""
  }
}
