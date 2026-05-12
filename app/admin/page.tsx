export const dynamic = "force-dynamic";
import { getAllOrders } from "@/lib/supabase/orders"
import { DollarSign, ShoppingBag, Coffee, CheckCircle2 } from "lucide-react"
import { RevenueLineChart } from "./RevenueLineChart"
import { MetricCard } from "@/components/admin/MetricCard"
import { getProfitDashboard } from "@/lib/supabase/costing"
import { getInventoryOverview } from "@/lib/supabase/inventory"
import { SimpleBarChart } from "./profit/ProfitCharts"

type RevenuePoint = {
  label: string
  dateKey: string
  revenue: number
  orders: number
}

export default async function AdminDashboard() {
  const orders = await getAllOrders()
  const [profit, inventory] = await Promise.all([getProfitDashboard(), getInventoryOverview()])
  const chartData = getLastSevenDaysRevenue(orders)
  
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0)
  const pendingCount = orders.filter(o => o.status === "NEW" || o.status === "PREPARING").length
  const readyCount = orders.filter(o => o.status === "READY").length
  const completedCount = orders.filter(o => o.status === "COMPLETED").length

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`RM${totalRevenue.toFixed(2)}`} icon={<DollarSign />} trend="+12.5%" />
        <StatCard title="Pending Orders" value={pendingCount} icon={<ShoppingBag />} trend="Needs attention" trendUp={false} />
        <StatCard title="Ready Orders" value={readyCount} icon={<Coffee />} trend="Waiting for pickup" />
        <StatCard title="Completed" value={completedCount} icon={<CheckCircle2 />} trend="+18.2%" />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="font-heading text-xl font-bold">Inventory & Profit</h3>
          <p className="text-sm text-muted-foreground">FIFO costing, stock alerts, and margin health.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
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
          <div className="rounded-lg border bg-white p-5">
            <h4 className="mb-4 font-heading font-bold">Revenue vs COGS vs Gross Profit</h4>
            <SimpleBarChart
              xKey="label"
              data={[{ label: "Today", revenue: profit.revenue, cogs: profit.cogs, grossProfit: profit.grossProfit }]}
              bars={[
                { key: "revenue", name: "Revenue", color: "#111" },
                { key: "cogs", name: "COGS", color: "#777" },
                { key: "grossProfit", name: "Gross Profit", color: "#bbb" },
              ]}
            />
          </div>
          <div className="rounded-lg border bg-white p-5">
            <h4 className="mb-4 font-heading font-bold">Product Profit Ranking</h4>
            <SimpleBarChart xKey="name" data={profit.productRanking.slice(0, 6)} bars={[{ key: "profit", name: "Profit", color: "#111" }]} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border min-h-[400px] flex flex-col">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-lg">Revenue Overview</h3>
              <p className="text-sm text-muted-foreground">Daily sales and order volume for the last 7 days</p>
            </div>
            <div className="rounded-xl bg-secondary px-3 py-2 text-right">
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">7-day sales</p>
              <p className="font-mono text-sm font-bold text-primary">RM{chartData.reduce((sum, point) => sum + point.revenue, 0).toFixed(2)}</p>
            </div>
          </div>
          <RevenueLineChart data={chartData} />
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border min-h-[400px]">
          <h3 className="font-heading font-bold text-lg mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-bold text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.status}</p>
                </div>
                <span className="font-mono text-sm font-bold">RM{order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

function getLastSevenDaysRevenue(orders: Array<{ createdAt: string, total: number }>): RevenuePoint[] {
  const formatter = new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short" })
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (6 - index))

    return {
      label: formatter.format(date),
      dateKey: date.toISOString().slice(0, 10),
      revenue: 0,
      orders: 0,
    }
  })

  const dayMap = new Map(days.map((day) => [day.dateKey, day]))

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt)
    orderDate.setHours(0, 0, 0, 0)
    const dateKey = orderDate.toISOString().slice(0, 10)
    const point = dayMap.get(dateKey)

    if (point) {
      point.revenue += order.total || 0
      point.orders += 1
    }
  })

  return days.map((day) => ({
    ...day,
    revenue: Number(day.revenue.toFixed(2)),
  }))
}

function StatCard({ title, value, icon, trend, trendUp = true }: { title: string, value: string | number, icon: React.ReactNode, trend: string, trendUp?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold font-mono">{value}</h3>
        </div>
        <div className="p-3 bg-secondary rounded-xl text-primary">
          {icon}
        </div>
      </div>
      <p className={`text-sm font-medium ${trendUp ? 'text-success' : 'text-accent'}`}>{trend}</p>
    </div>
  )
}
