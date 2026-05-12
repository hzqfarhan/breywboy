export const dynamic = "force-dynamic"

import { getAllOrders } from "@/lib/supabase/orders"

type CostBreakdownLine = {
  rawMaterialId: string
  rawMaterialName: string
  cost: number
}

type OrderProfitItem = {
  id: string
  quantity: number
  productNameSnapshot: string
  total: number
}

type OrderItemCostRow = {
  orderItemId: string
  costBreakdown?: CostBreakdownLine[] | null
}

type OrderProfitRow = {
  id: string
  orderNumber: string
  total: number
  createdAt: string
  items?: OrderProfitItem[]
  itemCosts?: OrderItemCostRow[]
  orderCost?: {
    cogs?: number | null
    grossProfit?: number | null
    grossMargin?: number | null
  }[]
}

export default async function OrderProfitPage() {
  const orders = (await getAllOrders()) as OrderProfitRow[]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Order Profit</h2>
        <p className="text-sm text-muted-foreground">Actual FIFO COGS and item-level cost breakdowns.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {orders.map((order) => {
          const cost = order.orderCost?.[0]
          return (
            <div key={order.id} className="rounded-lg border bg-white p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold">#{order.orderNumber}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString("en-MY")}</p>
                </div>
                <p className="font-mono font-bold">RM{Number(order.total || 0).toFixed(2)}</p>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">COGS</p><p className="font-mono font-bold">RM{Number(cost?.cogs || 0).toFixed(2)}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Profit</p><p className="font-mono font-bold">RM{Number(cost?.grossProfit || 0).toFixed(2)}</p></div>
                <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">Margin</p><p className="font-mono font-bold">{Number(cost?.grossMargin || 0).toFixed(1)}%</p></div>
              </div>

              <div className="space-y-3">
                {(order.items || []).map((item) => {
                  const itemCost = (order.itemCosts || []).find((row) => row.orderItemId === item.id)
                  return (
                    <div key={item.id} className="border-t pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.quantity}x {item.productNameSnapshot}</span>
                        <span className="font-mono">RM{Number(item.total || 0).toFixed(2)}</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {(itemCost?.costBreakdown || []).map((line) => (
                          <div key={`${item.id}-${line.rawMaterialId}`} className="flex justify-between text-xs text-muted-foreground">
                            <span>{line.rawMaterialName}</span>
                            <span>RM{Number(line.cost || 0).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
