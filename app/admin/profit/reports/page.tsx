export const dynamic = "force-dynamic"

import { MetricCard } from "@/components/admin/MetricCard"
import { getProfitDashboard } from "@/lib/supabase/costing"

export default async function ProfitReportsPage({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>
}) {
  const params = await searchParams
  const range = params?.range || "today"
  const profit = await getProfitDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Reports</h2>
        <p className="text-sm text-muted-foreground">Simple FIFO profit reporting. Current MVP calculations show today; filters are ready for expansion.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["today", "yesterday", "last-7-days", "this-month", "custom"].map((item) => (
          <a key={item} href={`/admin/profit/reports?range=${item}`} className={`rounded-full border px-4 py-2 text-sm font-medium ${range === item ? "bg-black text-white" : "bg-white"}`}>
            {item.replaceAll("-", " ")}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard title="Revenue" value={`RM${profit.revenue.toFixed(2)}`} />
        <MetricCard title="COGS" value={`RM${profit.cogs.toFixed(2)}`} />
        <MetricCard title="Gross Profit" value={`RM${profit.grossProfit.toFixed(2)}`} />
        <MetricCard title="Gross Margin" value={`${profit.grossMargin.toFixed(1)}%`} />
        <MetricCard title="Total Orders" value={profit.productRanking.length} />
        <MetricCard title="Average Order Value" value={profit.revenue > 0 ? `RM${profit.revenue.toFixed(2)}` : "RM0.00"} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ReportList title="Most Profitable Products" rows={profit.productRanking.map((row) => [row.name, `RM${row.profit.toFixed(2)}`])} />
        <ReportList title="Most Used Ingredients" rows={profit.ingredientUsage.map((row) => [row.name, `${row.quantity.toFixed(2)}`])} />
      </div>
    </div>
  )
}

function ReportList({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section className="rounded-lg border bg-white p-5">
      <h3 className="mb-4 font-heading text-lg font-bold">{title}</h3>
      <div className="space-y-3">
        {rows.slice(0, 8).map(([label, value]) => (
          <div key={label} className="flex justify-between border-b pb-3 last:border-0">
            <span>{label}</span>
            <span className="font-mono font-bold">{value}</span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No report data yet.</p>}
      </div>
    </section>
  )
}
