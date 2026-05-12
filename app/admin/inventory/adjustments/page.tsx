export const dynamic = "force-dynamic"

import { getStockMovements } from "@/lib/supabase/inventory"

export default async function StockAdjustmentsPage() {
  const movements = await getStockMovements(50)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Stock Adjustments</h2>
        <p className="text-sm text-muted-foreground">Audit trail for purchase, sale consumption, waste, and manual movements.</p>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Material</th>
              <th className="p-3">Type</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Reference</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-b last:border-0">
                <td className="p-3">{new Date(movement.createdAt).toLocaleString("en-MY")}</td>
                <td className="p-3 font-medium">{movement.rawMaterial?.name}</td>
                <td className="p-3">{movement.type.replaceAll("_", " ")}</td>
                <td className="p-3 font-mono">{Number(movement.quantity).toFixed(2)} {movement.unit}</td>
                <td className="p-3 font-mono">RM{Number(movement.totalCost || 0).toFixed(2)}</td>
                <td className="p-3 text-xs text-muted-foreground">{movement.referenceType} {movement.referenceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
