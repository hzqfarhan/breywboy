"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Coffee, Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Product = { 
  id: string, name: string, description: string | null, isPopular: boolean, categoryId: string,
  basePrice: number | null, hotPrice: number | null, icedPrice: number | null,
  hasTemperatureOption: boolean, allowHot: boolean, allowIced: boolean,
  allowOatMilk: boolean, allowExtraShot: boolean 
};
type AddOn = { id: string, name: string, price: number };

interface Props {
  product: Product;
  addOns: AddOn[];
  onClose: () => void;
}

export function ProductCustomizationModal({ product, addOns, onClose }: Props) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<'Hot' | 'Iced' | undefined>(
    product.hasTemperatureOption ? (product.allowIced ? 'Iced' : 'Hot') : undefined
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [instructions, setInstructions] = useState("");

  const calculateTotal = () => {
    let unitPrice = product.basePrice || 0;
    
    if (product.hasTemperatureOption) {
      if (temperature === 'Hot' && product.hotPrice !== null) unitPrice = product.hotPrice;
      if (temperature === 'Iced' && product.icedPrice !== null) unitPrice = product.icedPrice;
    }

    let addOnsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return (unitPrice + addOnsPrice) * quantity;
  };

  const getUnitPrice = () => {
    let unitPrice = product.basePrice || 0;
    if (product.hasTemperatureOption) {
      if (temperature === 'Hot' && product.hotPrice !== null) unitPrice = product.hotPrice;
      if (temperature === 'Iced' && product.icedPrice !== null) unitPrice = product.icedPrice;
    }
    let addOnsPrice = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    return unitPrice + addOnsPrice;
  }

  const handleAddOnToggle = (addon: AddOn) => {
    const exists = selectedAddOns.find(a => a.id === addon.id);
    if (exists) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleAddToCart = () => {
    addItem({
      cartItemId: Math.random().toString(36).substring(7),
      productId: product.id,
      name: product.name,
      unitPrice: getUnitPrice(),
      quantity,
      customizations: { 
        temperature,
        addOns: selectedAddOns,
        instructions 
      }
    });
    onClose();
  };

  return (
    <Drawer open={true} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[90vh] bg-background">
        <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
          <DrawerHeader className="relative border-b pb-4 shrink-0">
            <button onClick={onClose} className="absolute right-4 top-4 bg-secondary p-1.5 rounded-full text-muted-foreground z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-video bg-secondary rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
               <Coffee className="w-16 h-16 text-primary/20" />
            </div>
            <DrawerTitle className="text-2xl font-heading text-primary uppercase tracking-wide text-left">{product.name}</DrawerTitle>
            {product.description && (
              <p className="text-sm text-muted-foreground text-left mt-1">{product.description}</p>
            )}
            <p className="text-lg font-mono font-bold text-primary text-left mt-2">RM{(getUnitPrice()).toFixed(2)}</p>
          </DrawerHeader>

          <div className="p-4 overflow-y-auto space-y-8 flex-1">
            
            {/* Temperature */}
            {product.hasTemperatureOption && (
              <Section title="Temperature">
                <div className="grid grid-cols-2 gap-3">
                  <OptionBtn 
                    active={temperature === 'Hot'} 
                    onClick={() => setTemperature('Hot')} 
                    label="Hot" 
                    disabled={!product.allowHot}
                  />
                  <OptionBtn 
                    active={temperature === 'Iced'} 
                    onClick={() => setTemperature('Iced')} 
                    label="Iced" 
                    disabled={!product.allowIced}
                  />
                </div>
              </Section>
            )}

            {/* Add-ons */}
            {(product.allowOatMilk || product.allowExtraShot) && (
              <Section title="Add-ons">
                <div className="grid grid-cols-1 gap-3">
                  {addOns.filter(a => (product.allowOatMilk && a.name === 'Oat Milk') || (product.allowExtraShot && a.name === 'Extra Shot')).map(addon => {
                    const isActive = !!selectedAddOns.find(a => a.id === addon.id);
                    return (
                      <div key={addon.id} className="flex items-center justify-between bg-white border border-border rounded-xl p-3">
                        <div>
                          <p className="font-medium text-sm text-foreground">{addon.name}</p>
                          <p className="text-xs text-muted-foreground">+RM{addon.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant={isActive ? "default" : "outline"}
                          className={isActive ? "bg-primary text-primary-foreground rounded-full px-4" : "rounded-full px-4 border-border text-foreground hover:bg-secondary"}
                          onClick={() => handleAddOnToggle(addon)}
                        >
                          {isActive ? "Added" : "Add"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </Section>
            )}

            {/* Special Instructions */}
            <Section title="Special Instructions">
              <Textarea 
                placeholder="Any special requests?"
                className="resize-none bg-white rounded-xl border-border focus:ring-primary focus:border-primary"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </Section>
          </div>

          <DrawerFooter className="border-t bg-background shrink-0 pb-safe">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="font-medium text-muted-foreground">Quantity</span>
              <div className="flex items-center gap-4 bg-white border border-border rounded-full p-1 shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground disabled:opacity-50 hover:bg-border transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold font-mono w-4 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button size="lg" className="w-full h-14 rounded-full text-lg flex justify-between px-6 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleAddToCart}>
              <span>Add to Cart</span>
              <span className="font-mono font-bold">RM{calculateTotal().toFixed(2)}</span>
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-bold text-sm mb-3 text-foreground uppercase tracking-wide">{title}</h4>
      {children}
    </div>
  )
}

function OptionBtn({ active, onClick, label, disabled=false }: { active: boolean, onClick: () => void, label: string, disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "py-3 px-2 rounded-xl text-sm font-medium transition-all border",
        disabled ? "bg-secondary/50 border-transparent text-muted-foreground opacity-50 cursor-not-allowed" :
        active 
          ? "bg-primary border-primary text-primary-foreground" 
          : "bg-white border-border text-foreground hover:bg-secondary"
      )}
    >
      {label}
    </button>
  )
}
