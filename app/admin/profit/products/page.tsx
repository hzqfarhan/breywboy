export const dynamic = "force-dynamic"

import { StatusBadge } from "@/components/admin/StatusBadge"
import { getProductMargins } from "@/lib/supabase/costing"

export default async function ProductMarginsPage() {
  const products = await getProductMargins()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Product Margins</h2>
        <p className="text-sm text-muted-foreground">Estimated cost uses the oldest active FIFO batch for each ingredient.</p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Selling Price</th>
              <th className="p-3">Estimated Cost</th>
              <th className="p-3">Gross Profit</th>
              <th className="p-3">Margin</th>
              <th className="p-3">Cost Trend</th>
              <th className="p-3">Suggested Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const lowMargin = product.estimatedMargin < 55
              return (
                <tr key={product.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{product.name}<p className="text-xs text-muted-foreground">{product.category?.name}</p></td>
                  <td className="p-3 font-mono">RM{product.sellingPrice.toFixed(2)}</td>
                  <td className="p-3 font-mono">RM{product.estimatedCost.toFixed(2)}</td>
                  <td className="p-3 font-mono">RM{product.estimatedProfit.toFixed(2)}</td>
                  <td className="p-3"><StatusBadge tone={lowMargin ? "warn" : "good"}>{product.estimatedMargin.toFixed(1)}%</StatusBadge></td>
                  <td className="p-3 text-xs text-muted-foreground">Live FIFO estimate</td>
                  <td className="p-3">{lowMargin ? "Margin rendah. Semak harga jual atau kos bahan." : "Healthy"}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
