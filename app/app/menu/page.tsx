export const dynamic = "force-dynamic";
import { getMenuCategories, getAddOns } from "@/lib/supabase/menu"
import { MenuClient } from "./MenuClient"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"

export default async function MenuPage() {
  const [categories, addOns] = await Promise.all([
    getMenuCategories(),
    getAddOns(),
  ])

  return (
    <div className="flex flex-col h-full bg-background">
      <CustomerTopBar title="Menu" />
      <MenuClient categories={categories} addOns={addOns || []} />
    </div>
  )
}
