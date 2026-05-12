"use client";

import { useState } from "react";
import { Coffee, Search, ShoppingBag } from "lucide-react";
import { ProductCustomizationModal } from "./ProductCustomizationModal";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Define simplified types based on Prisma schema
type Product = { 
  id: string, name: string, description: string | null, isPopular: boolean, categoryId: string,
  basePrice: number | null, hotPrice: number | null, icedPrice: number | null,
  hasTemperatureOption: boolean, allowHot: boolean, allowIced: boolean,
  allowOatMilk: boolean, allowExtraShot: boolean,
  imageUrl?: string | null
};
type Category = { id: string, name: string, products: Product[] };
type AddOn = { id: string, name: string, price: number };

export function MenuClient({ categories, addOns }: { categories: Category[], addOns: AddOn[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { items, getCartTotal } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    products: cat.products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.products.length > 0);

  const getPriceDisplay = (p: Product) => {
    if (!p.hasTemperatureOption && p.basePrice !== null) return `RM${p.basePrice.toFixed(2)}`;
    if (p.hasTemperatureOption) {
      if (p.allowIced && p.icedPrice !== null) return `RM${p.icedPrice.toFixed(2)}`;
      if (p.allowHot && p.hotPrice !== null) return `RM${p.hotPrice.toFixed(2)}`;
    }
    return p.basePrice ? `RM${p.basePrice.toFixed(2)}` : "";
  }

  return (
    <div className="flex-1 flex flex-col relative pb-20">
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur-md pt-4 pb-2 border-b">
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search drinks, snacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-full text-sm focus:outline-none border-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        {/* Category Chips */}
        <div className="flex overflow-x-auto px-4 gap-2 pb-2 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                document.getElementById(`category-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={cn(
                "snap-start px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-white text-foreground border hover:bg-secondary"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-8">
        {filteredCategories.map((cat) => (
          <div key={cat.id} id={`category-${cat.id}`} className="scroll-mt-36">
            <h2 className="font-heading font-bold text-2xl uppercase text-primary mb-4">{cat.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl p-4 border border-border hover:border-primary/50 transition-colors text-left flex gap-4 items-center"
                >
                  <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden shrink-0">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Coffee className="w-8 h-8 text-primary/20" />
                    )}
                    {product.isPopular && (
                      <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[8px] font-bold py-0.5 text-center uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-base leading-tight mb-1 text-foreground">{product.name}</h3>
                    {product.description && <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>}
                    <span className="font-mono font-bold text-sm text-primary">{getPriceDisplay(product)}</span>
                  </div>
                  <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-lg leading-none mb-0.5">+</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Coffee className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No items found.</p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductCustomizationModal
          product={selectedProduct}
          addOns={addOns}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {cartItemCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 z-40">
          <Link href="/app/cart">
            <div className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border border-primary">
                    {cartItemCount}
                  </span>
                </div>
                <span className="font-medium">View Cart</span>
              </div>
              <span className="font-mono font-bold">RM{getCartTotal().toFixed(2)}</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
