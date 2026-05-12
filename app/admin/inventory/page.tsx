export const dynamic = "force-dynamic"

import { MetricCard } from "@/components/admin/MetricCard"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { getInventoryOverview } from "@/lib/supabase/inventory"

export default async function InventoryOverviewPage() {
  const overview = await getInventoryOverview()
  const usageToday = overview.movements.filter((movement) => movement.type === "SALE_CONSUMPTION")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Inventory & Profit</h2>
        <p className="text-sm text-muted-foreground">FIFO stock, low-stock alerts, expiry watch, and ingredient usage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Inventory Value" value={`RM${overview.inventoryValue.toFixed(2)}`} />
        <MetricCard title="Low Stock Items" value={overview.lowStock.length} />
        <MetricCard title="Expiring Soon" value={overview.expiringSoon.length} note="Within 7 days" />
        <MetricCard title="Out of Stock" value={overview.outOfStock.length} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 font-heading text-lg font-bold">Stock Alerts</h3>
          <div className="space-y-3">
            {[...overview.outOfStock, ...overview.lowStock].slice(0, 8).map((material) => (
              <div key={material.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{material.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{Number(material.currentStock).toFixed(2)} {material.unit}</p>
                </div>
                <StatusBadge tone={Number(material.currentStock) <= 0 ? "bad" : "warn"}>
                  {Number(material.currentStock) <= 0 ? "Out" : "Low"}
                </StatusBadge>
              </div>
            ))}
            {overview.lowStock.length === 0 && overview.outOfStock.length === 0 && (
              <p className="text-sm text-muted-foreground">No stock alerts right now.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border bg-white p-5">
          <h3 className="mb-4 font-heading text-lg font-bold">Recent Stock Movements</h3>
          <div className="space-y-3">
            {overview.movements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{movement.rawMaterial?.name || "Ingredient"}</p>
                  <p className="text-xs text-muted-foreground">{movement.type.replaceAll("_", " ")}</p>
                </div>
                <p className="font-mono text-sm">{Number(movement.quantity).toFixed(2)} {movement.unit}</p>
              </div>
            ))}
            {overview.movements.length === 0 && <p className="text-sm text-muted-foreground">No stock movements yet.</p>}
          </div>
        </section>
      </div>

      <section className="rounded-lg border bg-white p-5">
        <h3 className="mb-4 font-heading text-lg font-bold">Ingredient Usage Today</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {usageToday.slice(0, 6).map((movement) => (
            <div key={movement.id} className="rounded-lg border p-4">
              <p className="font-medium">{movement.rawMaterial?.name}</p>
              <p className="font-mono text-sm text-muted-foreground">{Number(movement.quantity).toFixed(2)} {movement.unit}</p>
            </div>
          ))}
          {usageToday.length === 0 && <p className="text-sm text-muted-foreground">No ingredient usage recorded today.</p>}
        </div>
      </section>
    </div>
  )
}
