export const dynamic = "force-dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllProducts } from "@/lib/supabase/menu"
import { getRawMaterials, getRecipes } from "@/lib/supabase/inventory"
import { saveRecipeAction } from "../actions"

const units = ["g", "kg", "ml", "L", "pcs", "pack", "bottle", "carton"]

type RecipeDisplayItem = {
  id: string
  quantity: number
  unit: string
  rawMaterial?: { name?: string | null } | null
}

export default async function RecipesPage() {
  const [products, materials, recipes] = await Promise.all([getAllProducts(), getRawMaterials(), getRecipes()])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Recipes</h2>
        <p className="text-sm text-muted-foreground">Assign raw materials to products for FIFO costing.</p>
      </div>

      <form action={saveRecipeAction} className="space-y-4 rounded-lg border bg-white p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select name="productId" required className="rounded-md border bg-white px-3 py-2 text-sm">
            <option value="">Select product</option>
            {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
          </select>
          <Input name="name" placeholder="Recipe name" required />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="contents">
              <select name="rawMaterialId" className="rounded-md border bg-white px-3 py-2 text-sm">
                <option value="">Material</option>
                {materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}
              </select>
              <Input name="quantity" type="number" step="0.01" placeholder="Qty" />
              <select name="unit" className="rounded-md border bg-white px-3 py-2 text-sm">
                {units.map((unit) => <option key={unit}>{unit}</option>)}
              </select>
              <Input name="wastePercent" type="number" step="0.01" placeholder="Waste %" defaultValue="0" />
              <div className="hidden md:block" />
            </div>
          ))}
        </div>
        <Button type="submit">Save Recipe</Button>
      </form>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="rounded-lg border bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold">{recipe.product?.name}</h3>
                <p className="text-xs text-muted-foreground">{recipe.name} v{recipe.version}</p>
              </div>
              <span className="rounded-full border px-2 py-1 text-[10px] font-bold uppercase">{recipe.isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className="space-y-2">
              {((recipe.items || []) as RecipeDisplayItem[]).map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-2 text-sm last:border-0">
                  <span>{item.rawMaterial?.name}</span>
                  <span className="font-mono">{Number(item.quantity).toFixed(2)} {item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
