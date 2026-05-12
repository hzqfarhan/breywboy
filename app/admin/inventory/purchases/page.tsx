export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getRawMaterials, getSuppliers } from "@/lib/supabase/inventory"
import { createPurchaseAction } from "../actions"

const units = ["g", "kg", "ml", "L", "pcs", "pack", "bottle", "carton"]

export default async function PurchasesPage() {
  const [materials, suppliers] = await Promise.all([getRawMaterials(), getSuppliers()])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Purchases</h2>
        <p className="text-sm text-muted-foreground">Add stock purchases and create FIFO batches automatically.</p>
      </div>

      <form action={createPurchaseAction} className="grid grid-cols-1 gap-4 rounded-lg border bg-white p-5 md:grid-cols-3">
        <select name="supplierId" required className="rounded-md border bg-white px-3 py-2 text-sm">
          <option value="">Select supplier</option>
          {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
        </select>
        <Input name="invoiceNumber" placeholder="Invoice number" />
        <Input name="purchaseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
        <select name="rawMaterialId" required className="rounded-md border bg-white px-3 py-2 text-sm">
          <option value="">Select material</option>
          {materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}
        </select>
        <Input name="quantity" required type="number" step="0.01" placeholder="Quantity purchased" />
        <select name="unit" className="rounded-md border bg-white px-3 py-2 text-sm">
          {units.map((unit) => <option key={unit}>{unit}</option>)}
        </select>
        <Input name="totalCost" required type="number" step="0.01" placeholder="Total cost (RM)" />
        <Input name="expiryDate" type="date" />
        <Input name="notes" placeholder="Notes" />
        <div className="md:col-span-3">
          <Button type="submit">Create Purchase Batch</Button>
        </div>
      </form>
    </div>
  )
}
