export const dynamic = "force-dynamic"

import { StatusBadge } from "@/components/admin/StatusBadge"
import { getRawMaterialBatches } from "@/lib/supabase/inventory"

export default async function StockBatchesPage() {
  const batches = await getRawMaterialBatches()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Stock Batches</h2>
        <p className="text-sm text-muted-foreground">FIFO batches sorted by oldest purchase date first.</p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">FIFO</th>
              <th className="p-3">Batch</th>
              <th className="p-3">Raw Material</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Purchase</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Purchased</th>
              <th className="p-3">Remaining</th>
              <th className="p-3">Cost / Unit</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={batch.id} className="border-b last:border-0">
                <td className="p-3 font-mono text-xs">#{index + 1}</td>
                <td className="p-3 font-medium">{batch.batchNumber}</td>
                <td className="p-3">{batch.rawMaterial?.name}</td>
                <td className="p-3">{batch.supplier?.name || "-"}</td>
                <td className="p-3">{formatDate(batch.purchaseDate)}</td>
                <td className="p-3">{batch.expiryDate ? formatDate(batch.expiryDate) : "-"}</td>
                <td className="p-3 font-mono">{Number(batch.quantityPurchased).toFixed(2)} {batch.unit}</td>
                <td className="p-3 font-mono">{Number(batch.quantityRemaining).toFixed(2)} {batch.unit}</td>
                <td className="p-3 font-mono">RM{Number(batch.costPerUnit).toFixed(4)}</td>
                <td className="p-3"><StatusBadge tone={batch.status === "ACTIVE" ? "good" : "neutral"}>{batch.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" })
}
