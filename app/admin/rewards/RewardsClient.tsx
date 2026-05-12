"use client"

import { useState, useTransition } from "react"
import { 
  createRewardAction, 
  updateRewardAction, 
  deleteRewardAction, 
  toggleRewardActive 
} from "./actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Pencil, Trash2, Gift, Star } from "lucide-react"

type Reward = {
  id: string
  name: string
  description: string | null
  pointsRequired: number
  isActive: boolean
}

export function RewardsClient({ initialRewards }: { initialRewards: Reward[] }) {
  const [rewards, setRewards] = useState(initialRewards)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (id: string, current: boolean) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, isActive: !current } : r))
    try {
      await toggleRewardActive(id, !current)
    } catch {
      setRewards(prev => prev.map(r => r.id === id ? { ...r, isActive: current } : r))
    }
  }

  const handleDelete = (reward: Reward) => {
    if (!confirm(`Delete reward "${reward.name}"?`)) return
    setRewards(prev => prev.filter(r => r.id !== reward.id))
    startTransition(async () => {
      await deleteRewardAction(reward.id)
    })
  }

  const closeForm = () => {
    setEditingReward(null)
    setIsCreating(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setIsCreating(true); setEditingReward(null) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Reward
        </Button>
      </div>

      {(isCreating || editingReward) && (
        <RewardForm 
          key={editingReward?.id || "new"}
          reward={editingReward}
          onDone={closeForm}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reward</TableHead>
              <TableHead>Points Required</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map(reward => (
              <TableRow key={reward.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg text-accent">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{reward.name}</p>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 font-mono font-bold text-primary">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    {reward.pointsRequired} pts
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${reward.isActive ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {reward.isActive ? 'Active' : 'Disabled'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggle(reward.id, reward.isActive)}>
                      {reward.isActive ? 'Disable' : 'Enable'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setEditingReward(reward); setIsCreating(false) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleDelete(reward)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function RewardForm({ reward, onDone }: { reward: Reward | null, onDone: () => void }) {
  const action = reward ? updateRewardAction.bind(null, reward.id) : createRewardAction

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
          <h3 className="font-heading text-xl font-bold text-primary">{reward ? "Edit Reward" : "Add New Reward"}</h3>
          <p className="text-sm text-muted-foreground">Define what customers can redeem with their points.</p>
        </div>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Reward Name">
          <Input name="name" defaultValue={reward?.name || ""} required placeholder="e.g. Free Hot Latte" />
        </Field>
        <Field label="Points Required">
          <Input name="pointsRequired" type="number" defaultValue={reward?.pointsRequired ?? 100} required />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea name="description" defaultValue={reward?.description || ""} placeholder="e.g. Redeem one free hot latte of your choice." className="min-h-20" />
        </Field>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="isActive" 
            id="isActive" 
            defaultChecked={reward?.isActive ?? true} 
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium">Available for redemption</label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit">{reward ? "Save Changes" : "Create Reward"}</Button>
      </div>
    </form>
  )
}

function Field({ label, className, children }: { label: string, className?: string, children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
