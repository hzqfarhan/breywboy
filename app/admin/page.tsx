export const dynamic = "force-dynamic";
import { getAllOrders } from "@/lib/supabase/orders"
import { DollarSign, ShoppingBag, Coffee, CheckCircle2 } from "lucide-react"

export default async function AdminDashboard() {
  const orders = await getAllOrders()
  
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border min-h-[400px] flex flex-col">
          <h3 className="font-heading font-bold text-lg mb-6">Revenue Overview</h3>
          <div className="flex-1 flex items-center justify-center bg-secondary/30 rounded-xl border border-dashed">
             <p className="text-muted-foreground text-sm">Recharts Line Chart Placeholder</p>
          </div>
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
