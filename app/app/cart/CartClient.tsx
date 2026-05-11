"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Coffee, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function CartClient() {
  const { items, updateQuantity, removeItem, getCartTotal } = useCartStore();
  const [promoCode, setPromoCode] = useState("");

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-secondary p-6 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-heading uppercase text-primary mb-2 tracking-wide">Your cart is empty</h2>
        <p className="text-muted-foreground text-center max-w-xs mb-8">
          Looks like you haven't added any delicious drinks or snacks yet.
        </p>
        <Link href="/app/menu">
          <Button size="lg" className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  const handleApplyPromo = () => {
    if (!promoCode) return;
    toast.success("Promo code applied successfully!");
  };

  return (
    <div className="flex-1 p-4 pb-32 space-y-6">
      
      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => {
          let itemPrice = item.unitPrice;
          item.customizations.addOns.forEach(a => itemPrice += a.price);

          const customsText = [
            item.customizations.temperature,
            ...item.customizations.addOns.map(a => `+${a.name}`)
          ].filter(Boolean).join(' · ');

          return (
            <div key={item.cartItemId} className="bg-white p-4 rounded-2xl border border-border flex gap-4">
              <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                <Coffee className="w-8 h-8 text-primary/20" />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold leading-tight uppercase text-foreground">{item.name}</h3>
                  <button onClick={() => removeItem(item.cartItemId)} className="text-muted-foreground hover:text-foreground p-1 -mr-1 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {customsText && (
                  <p className="text-xs text-muted-foreground leading-snug mb-2">{customsText}</p>
                )}
                {item.customizations.instructions && (
                  <p className="text-xs italic text-muted-foreground/80 mb-2">"{item.customizations.instructions}"</p>
                )}
                
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-mono font-bold text-primary">RM{(itemPrice * item.quantity).toFixed(2)}</span>
                  
                  <div className="flex items-center gap-3 bg-secondary rounded-full p-1 border border-border">
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-foreground disabled:opacity-50 border border-border"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold font-mono w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code */}
      <div className="bg-white p-4 rounded-2xl border border-border">
        <h4 className="font-bold text-sm mb-3 uppercase tracking-wide">Promo Code</h4>
        <div className="flex gap-2">
          <Input 
            placeholder="Enter code (e.g. BREYW10)" 
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="rounded-xl border-border bg-secondary uppercase focus-visible:ring-primary"
          />
          <Button onClick={handleApplyPromo} variant="outline" className="rounded-xl font-bold border-border text-foreground hover:bg-secondary">Apply</Button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 rounded-2xl border border-border space-y-3">
        <h4 className="font-bold text-sm mb-1 uppercase tracking-wide">Order Summary</h4>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-mono">RM{getCartTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (0%)</span>
          <span className="font-mono">RM0.00</span>
        </div>
        <div className="pt-3 border-t flex justify-between font-bold text-lg text-primary">
          <span>Total</span>
          <span className="font-mono">RM{getCartTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Sticky Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-40">
        <Link href="/app/checkout" className="block">
          <Button size="lg" className="w-full h-14 rounded-full text-lg flex justify-between px-6 bg-primary text-primary-foreground hover:bg-primary/90">
            <span>Checkout</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">RM{getCartTotal().toFixed(2)}</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Button>
        </Link>
      </div>

    </div>
  );
}
