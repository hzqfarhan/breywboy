export const dynamic = "force-dynamic";
import { supabase } from "@/lib/supabase"
import { MenuClient } from "./MenuClient"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"

export default async function MenuPage() {
  const { data: rawCategories } = await supabase
    .from('Category')
    .select(`
      *,
      products:Product(*)
    `)
    .order('sortOrder', { ascending: true })

  const categories = (rawCategories || []).map(cat => ({
    ...cat,
    products: (cat.products || []).filter((p: any) => p.isAvailable)
  }))

  const { data: addOns } = await supabase
    .from('AddOn')
    .select('*')
    .eq('isAvailable', true)

  return (
    <div className="flex flex-col h-full bg-background">
      <CustomerTopBar title="Menu" />
      <MenuClient categories={categories} addOns={addOns || []} />
    </div>
  )
}
