export const dynamic = "force-dynamic"

import { StatusBadge } from "@/components/admin/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getRawMaterials } from "@/lib/supabase/inventory"
import { saveRawMaterialAction } from "../actions"

const categories = ["Coffee", "Dairy", "Non-Dairy Milk", "Powder", "Syrup", "Sauce", "Pasta", "Protein", "Frozen Food", "Bread", "Packaging", "Other"]
const units = ["g", "kg", "ml", "L", "pcs", "pack", "bottle", "carton"]

export default async function RawMaterialsPage() {
  const materials = await getRawMaterials()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Raw Materials</h2>
        <p className="text-sm text-muted-foreground">Create ingredients, packaging, and stock thresholds.</p>
      </div>

      <form action={saveRawMaterialAction} className="grid grid-cols-1 gap-3 rounded-lg border bg-white p-5 md:grid-cols-6">
        <Input name="name" placeholder="Raw material name" required />
        <Input name="sku" placeholder="SKU" required />
        <select name="category" className="rounded-md border bg-white px-3 py-2 text-sm">
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select name="unit" className="rounded-md border bg-white px-3 py-2 text-sm">
          {units.map((unit) => <option key={unit}>{unit}</option>)}
        </select>
        <Input name="minimumStock" type="number" step="0.01" placeholder="Min stock" />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input name="isPerishable" type="checkbox" />
            Perishable
          </label>
          <Button type="submit">Add</Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">Material</th>
              <th className="p-3">Category</th>
              <th className="p-3">Current Stock</th>
              <th className="p-3">Minimum</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => {
              const stock = Number(material.currentStock || 0)
              const min = Number(material.minimumStock || 0)
              const status = stock <= 0 ? "Out of Stock" : stock <= min ? "Low Stock" : "In Stock"
              return (
                <tr key={material.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{material.name}<p className="text-xs text-muted-foreground">{material.sku}</p></td>
                  <td className="p-3">{material.category}</td>
                  <td className="p-3 font-mono">{stock.toFixed(2)} {material.unit}</td>
                  <td className="p-3 font-mono">{min.toFixed(2)} {material.unit}</td>
                  <td className="p-3"><StatusBadge tone={stock <= 0 ? "bad" : stock <= min ? "warn" : "good"}>{status}</StatusBadge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
