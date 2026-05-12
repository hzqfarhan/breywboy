export const dynamic = "force-dynamic"

import { MetricCard } from "@/components/admin/MetricCard"
import { getInventoryOverview } from "@/lib/supabase/inventory"
import { getProfitDashboard } from "@/lib/supabase/costing"
import { SimpleBarChart } from "./ProfitCharts"

type InventoryBatchForChart = {
  quantityRemaining?: number | null
  costPerUnit?: number | null
  rawMaterial?: { category?: string | null } | null
}

export default async function ProfitOverviewPage() {
  const [profit, inventory] = await Promise.all([getProfitDashboard(), getInventoryOverview()])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Profit Overview</h2>
        <p className="text-sm text-muted-foreground">Revenue, FIFO COGS, gross profit, and margin signals.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Today's Revenue" value={`RM${profit.revenue.toFixed(2)}`} />
        <MetricCard title="Today's COGS" value={`RM${profit.cogs.toFixed(2)}`} />
        <MetricCard title="Today's Gross Profit" value={`RM${profit.grossProfit.toFixed(2)}`} />
        <MetricCard title="Gross Margin %" value={`${profit.grossMargin.toFixed(1)}%`} />
        <MetricCard title="Low Stock Items" value={inventory.lowStock.length} />
        <MetricCard title="Expiring Soon" value={inventory.expiringSoon.length} />
        <MetricCard title="Inventory Value" value={`RM${inventory.inventoryValue.toFixed(2)}`} />
        <MetricCard title="Top Profitable Product" value={profit.topProfitableProduct} />
        <MetricCard title="Lowest Margin Product" value={profit.lowestMarginProduct} />
        <MetricCard title="Most Used Ingredient Today" value={profit.mostUsedIngredientToday} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 font-heading text-lg font-bold">Revenue vs COGS vs Gross Profit</h3>
          <SimpleBarChart
            xKey="label"
            data={[{ label: "Today", revenue: profit.revenue, cogs: profit.cogs, grossProfit: profit.grossProfit }]}
            bars={[
              { key: "revenue", name: "Revenue", color: "#111" },
              { key: "cogs", name: "COGS", color: "#777" },
              { key: "grossProfit", name: "Gross Profit", color: "#bbb" },
            ]}
          />
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 font-heading text-lg font-bold">Product Profit Ranking</h3>
          <SimpleBarChart
            xKey="name"
            data={profit.productRanking.slice(0, 6)}
            bars={[{ key: "profit", name: "Gross Profit", color: "#111" }]}
          />
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 font-heading text-lg font-bold">Ingredient Usage</h3>
          <SimpleBarChart
            xKey="name"
            data={profit.ingredientUsage.slice(0, 6)}
            bars={[{ key: "quantity", name: "Quantity", color: "#111" }]}
          />
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 font-heading text-lg font-bold">Inventory Value by Category</h3>
          <SimpleBarChart
            xKey="category"
            data={getInventoryValueByCategory(inventory.batches)}
            bars={[{ key: "value", name: "Value", color: "#111" }]}
          />
        </section>
      </div>
    </div>
  )
}

function getInventoryValueByCategory(batches: InventoryBatchForChart[]) {
  const map = new Map<string, number>()
  for (const batch of batches) {
    const category = batch.rawMaterial?.category || "Other"
    map.set(category, (map.get(category) || 0) + Number(batch.quantityRemaining || 0) * Number(batch.costPerUnit || 0))
  }
  return Array.from(map.entries()).map(([category, value]) => ({ category, value: Number(value.toFixed(2)) }))
}
