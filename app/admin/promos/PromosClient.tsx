"use client"

import { useState, useTransition } from "react"
import { 
  createPromoAction, 
  updatePromoAction, 
  deletePromoAction, 
  togglePromoActive 
} from "./actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, Tags, Calendar } from "lucide-react"

type Promo = {
  id: string
  code: string
  description: string | null
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderAmount: number
  maxUses: number | null
  currentUses: number
  isActive: boolean
  startsAt: string
  expiresAt: string | null
}

export function PromosClient({ initialPromos }: { initialPromos: Promo[] }) {
  const [promos, setPromos] = useState(initialPromos)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (id: string, current: boolean) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, isActive: !current } : p))
    try {
      await togglePromoActive(id, !current)
    } catch {
      setPromos(prev => prev.map(p => p.id === id ? { ...p, isActive: current } : p))
    }
  }

  const handleDelete = (promo: Promo) => {
    if (!confirm(`Delete promo code "${promo.code}"?`)) return
    setPromos(prev => prev.filter(p => p.id !== promo.id))
    startTransition(async () => {
      await deletePromoAction(promo.id)
    })
  }

  const closeForm = () => {
    setEditingPromo(null)
    setIsCreating(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setIsCreating(true); setEditingPromo(null) }}>
          <Plus className="mr-2 h-4 w-4" />
          Create Promo Code
        </Button>
      </div>

      {(isCreating || editingPromo) && (
        <PromoForm 
          key={editingPromo?.id || "new"}
          promo={editingPromo}
          onDone={closeForm}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.map(promo => {
              const isExpired = promo.expiresAt && new Date(promo.expiresAt) < new Date()
              const isMaxed = promo.maxUses && promo.currentUses >= promo.maxUses
              const status = isExpired ? 'Expired' : isMaxed ? 'Maxed Out' : promo.isActive ? 'Active' : 'Disabled'
              const statusColor = isExpired || isMaxed ? 'bg-destructive/10 text-destructive' : promo.isActive ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'

              return (
                <TableRow key={promo.id}>
                  <TableCell className="font-bold text-primary flex items-center gap-2">
                    <Tags className="w-4 h-4 text-accent" />
                    {promo.code}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}% OFF` : `RM${promo.discountValue.toFixed(2)} OFF`}
                    </span>
                    <p className="text-[10px] text-muted-foreground">Min RM{promo.minOrderAmount.toFixed(2)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{promo.currentUses} / {promo.maxUses || 'Unlimited'}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(promo.startsAt).toLocaleDateString()} - {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'Never'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight ${statusColor}`}>
                      {status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggle(promo.id, promo.isActive)}>
                        {promo.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingPromo(promo); setIsCreating(false) }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleDelete(promo)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function PromoForm({ promo, onDone }: { promo: Promo | null, onDone: () => void }) {
  const action = promo ? updatePromoAction.bind(null, promo.id) : createPromoAction

  return (
    <form 
      action={async (formData) => {
        await action(formData)
        onDone()
      }}
      className="rounded-2xl border bg-white p-6 shadow-sm mb-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold text-primary">{promo ? "Edit Promo Code" : "Create New Promo Code"}</h3>
          <p className="text-sm text-muted-foreground">Configure discounts and usage limits.</p>
        </div>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Promo Code">
          <Input name="code" defaultValue={promo?.code || ""} required placeholder="e.g. WELCOME20" className="uppercase" />
        </Field>
        <Field label="Description">
          <Input name="description" defaultValue={promo?.description || ""} placeholder="e.g. 20% off for new customers" />
        </Field>
        <Field label="Discount Type">
          <select name="discountType" defaultValue={promo?.discountType || "PERCENTAGE"} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm">
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount (RM)</option>
          </select>
        </Field>
        <Field label="Discount Value">
          <Input name="discountValue" type="number" step="0.01" defaultValue={promo?.discountValue || 0} required />
        </Field>
        <Field label="Min Order Amount (RM)">
          <Input name="minOrderAmount" type="number" step="0.01" defaultValue={promo?.minOrderAmount || 0} />
        </Field>
        <Field label="Max Total Uses">
          <Input name="maxUses" type="number" defaultValue={promo?.maxUses || ""} placeholder="Leave empty for unlimited" />
        </Field>
        <Field label="Starts At">
          <Input name="startsAt" type="datetime-local" defaultValue={promo?.startsAt ? new Date(promo.startsAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)} />
        </Field>
        <Field label="Expires At">
          <Input name="expiresAt" type="datetime-local" defaultValue={promo?.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : ""} />
        </Field>
        <div className="flex items-center gap-2 pt-2">
          <input 
            type="checkbox" 
            name="isActive" 
            id="isActive" 
            defaultChecked={promo?.isActive ?? true} 
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium">Active and redeemable</label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit">{promo ? "Update Promo" : "Create Promo"}</Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
