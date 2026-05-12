export const dynamic = "force-dynamic";
import { getAllCategories } from "@/lib/supabase/categories"
import { CategoriesClient } from "./CategoriesClient"

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Category Management</h2>
          <p className="text-muted-foreground text-sm">Organize your products into groups</p>
        </div>
      </div>
      
      <CategoriesClient initialCategories={categories} />
    </div>
  )
}
