export const dynamic = "force-dynamic";
import { getAllPromos } from "@/lib/supabase/promos"
import { PromosClient } from "./PromosClient"

export default async function PromosPage() {
  const promos = await getAllPromos()

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Promo Management</h2>
          <p className="text-muted-foreground text-sm">Create and manage discount codes</p>
        </div>
      </div>
      
      <PromosClient initialPromos={promos} />
    </div>
  )
}
