export const dynamic = "force-dynamic";

import { getAllCustomers } from "@/lib/supabase/users"
import { CustomerDirectory } from "./CustomerDirectory"

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Customers</h2>
        <p className="text-muted-foreground text-sm">View registered customers and open full details when needed.</p>
      </div>

      <CustomerDirectory customers={customers} />
    </div>
  )
}
