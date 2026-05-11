export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase"
import { MenuClient } from "./MenuClient"

export default async function AdminMenuPage() {
  const { data: rawProducts } = await supabase
    .from('Product')
    .select('*, category:Category(*)')
    .order('categoryId', { ascending: true })
    .order('name', { ascending: true })

  const products = rawProducts || []

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Menu Management</h2>
          <p className="text-muted-foreground text-sm">Manage your products and availability</p>
        </div>
      </div>
      
      <MenuClient initialProducts={products} />
    </div>
  )
}
