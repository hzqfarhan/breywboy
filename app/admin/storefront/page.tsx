export const dynamic = "force-dynamic";

import { getMenuCategories } from "@/lib/supabase/menu"
import { Coffee } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  basePrice: number | null
  hotPrice: number | null
  icedPrice: number | null
  hasTemperatureOption: boolean
  allowHot: boolean
  allowIced: boolean
  isPopular: boolean
}

type Category = {
  id: string
  name: string
  products: Product[]
}

export default async function AdminStorefrontPage() {
  const categories = await getMenuCategories() as Category[]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-primary">Storefront View</h2>
        <p className="text-muted-foreground text-sm">Preview the menu exactly as customers browse it, without cart actions.</p>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b bg-background px-4 py-3">
          <p className="font-heading text-lg font-bold text-primary">Menu</p>
        </div>
        <div className="p-4 space-y-8">
          {categories.map((category) => (
            <section key={category.id}>
              <h3 className="mb-4 font-heading text-2xl font-bold uppercase text-primary">{category.name}</h3>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {category.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <Coffee className="h-8 w-8 text-primary/20" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold leading-tight text-foreground">{product.name}</h4>
                        {product.isPopular && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary-foreground">Popular</span>
                        )}
                      </div>
                      {product.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
                      )}
                      <p className="mt-2 font-mono text-sm font-bold text-primary">{getPriceDisplay(product)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function getPriceDisplay(product: Product) {
  if (!product.hasTemperatureOption && product.basePrice !== null) return `RM${product.basePrice.toFixed(2)}`
  if (product.allowIced && product.icedPrice !== null) return `RM${product.icedPrice.toFixed(2)}`
  if (product.allowHot && product.hotPrice !== null) return `RM${product.hotPrice.toFixed(2)}`
  return product.basePrice ? `RM${product.basePrice.toFixed(2)}` : "RM0.00"
}
