export const dynamic = "force-dynamic";

import { getAddOns, getMenuCategories } from "@/lib/supabase/menu"
import { PosClient } from "./PosClient"

export default async function AdminPosPage() {
  const [categories, addOns] = await Promise.all([
    getMenuCategories(),
    getAddOns(),
  ])

  return (
    <div className="h-full min-h-0 space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">POS</h2>
        <p className="text-muted-foreground text-sm">Create walk-in counter orders and send them to the kitchen queue.</p>
      </div>

      <PosClient categories={categories} addOns={addOns} />
    </div>
  )
}
