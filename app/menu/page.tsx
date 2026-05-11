import { PublicNavbar } from "@/components/layout/PublicNavbar"
import { prisma } from "@/lib/auth"
import { Coffee } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function PublicMenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      products: { where: { isAvailable: true } }
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6 uppercase tracking-tight">Our Menu</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            From signature roasts to fresh bakes, explore our full selection of crafted goodness.
          </p>
          <Link href="/login">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl transition-all hover:-translate-y-1">
              Order Now
            </Button>
          </Link>
        </div>

        <div className="space-y-16 max-w-4xl mx-auto">
          {categories.filter(c => c.products.length > 0).map(cat => (
            <section key={cat.id}>
              <h2 className="text-3xl font-heading font-bold text-primary border-b border-border pb-4 mb-8 uppercase tracking-wide">{cat.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cat.products.map(product => (
                  <div key={product.id} className="bg-white p-5 rounded-2xl border border-border flex gap-5 hover:border-primary/50 transition-colors">
                    <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                      <Coffee className="w-10 h-10 text-primary/20" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg uppercase leading-tight">{product.name}</h3>
                      </div>
                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-mono font-bold text-sm text-primary">
                          {product.hasTemperatureOption ? (
                            `RM${(product.icedPrice || product.hotPrice || 0).toFixed(2)}`
                          ) : (
                            `RM${(product.basePrice || 0).toFixed(2)}`
                          )}
                        </span>
                        {product.isPopular && (
                          <span className="text-[9px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="bg-background py-12 border-t mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Breywboy. All rights reserved.</p>
      </footer>
    </div>
  )
}
