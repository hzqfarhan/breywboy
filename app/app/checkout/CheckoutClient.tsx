"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, MapPin, CheckCircle2, CreditCard, Coffee } from "lucide-react";
import { useState, useTransition } from "react";
import { createOrder } from "./actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CheckoutClient() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [pickupTime, setPickupTime] = useState("ASAP");
  const [paymentMethod, setPaymentMethod] = useState("Counter");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (items.length === 0) {
    router.push("/app/cart");
    return null;
  }

  const handleCheckout = () => {
    startTransition(async () => {
      try {
        await createOrder(items, paymentMethod, pickupTime);
        clearCart();
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <div className="flex-1 p-4 pb-32 space-y-6">
      
      {/* Pickup Details */}
      <section className="space-y-3">
        <h3 className="font-heading font-bold text-lg uppercase tracking-wide">Pickup Details</h3>
        
        <div className="bg-white p-4 rounded-2xl border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-full">
              <MapPin className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm text-foreground">Breywboy Parit Raja</p>
              <p className="text-xs text-muted-foreground">Johor, Malaysia</p>
            </div>
          </div>
          <span className="text-xs bg-secondary px-2 py-1 rounded-md font-medium text-foreground">Store</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-full">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <p className="font-bold text-sm text-foreground">Pickup Time</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPickupTime("ASAP")}
              className={cn(
                "py-3 px-2 rounded-xl text-sm font-medium transition-all border flex flex-col items-center justify-center gap-1",
                pickupTime === "ASAP" ? "bg-primary border-primary text-primary-foreground" : "bg-white border-border text-foreground hover:bg-secondary"
              )}
            >
              <span>ASAP</span>
              <span className="text-[10px] opacity-80 font-normal">10-15 mins</span>
            </button>
            <button
              onClick={() => setPickupTime("Schedule")}
              className={cn(
                "py-3 px-2 rounded-xl text-sm font-medium transition-all border flex flex-col items-center justify-center gap-1",
                pickupTime === "Schedule" ? "bg-primary border-primary text-primary-foreground" : "bg-white border-border text-foreground hover:bg-secondary"
              )}
            >
              <span>Schedule</span>
              <span className="text-[10px] opacity-80 font-normal">Choose time</span>
            </button>
          </div>
        </div>
      </section>

      {/* Payment Details */}
      <section className="space-y-3">
        <h3 className="font-heading font-bold text-lg uppercase tracking-wide">Payment Method</h3>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <button 
            onClick={() => setPaymentMethod("Online")}
            className="w-full p-4 flex items-center justify-between border-b hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm text-foreground">Online Payment / QR</span>
            </div>
            {paymentMethod === "Online" && <CheckCircle2 className="w-5 h-5 text-foreground" />}
          </button>
          <button 
            onClick={() => setPaymentMethod("Counter")}
            className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-3">
              <Coffee className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm text-foreground">Pay at Counter</span>
            </div>
            {paymentMethod === "Counter" && <CheckCircle2 className="w-5 h-5 text-foreground" />}
          </button>
        </div>
      </section>

      {/* Order Summary */}
      <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
        <h4 className="font-bold text-sm mb-1 uppercase tracking-wide">Payment Summary</h4>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
          <span className="font-mono">RM{getCartTotal().toFixed(2)}</span>
        </div>
        <div className="pt-3 border-t flex justify-between font-bold text-lg text-primary">
          <span>Total</span>
          <span className="font-mono">RM{getCartTotal().toFixed(2)}</span>
        </div>
      </section>

      {/* Sticky Confirm Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-40">
        <Button 
          size="lg" 
          className="w-full h-14 rounded-full text-lg flex justify-between px-6 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isPending}
          onClick={handleCheckout}
        >
          <span>{isPending ? "Processing..." : "Confirm Order"}</span>
          {!isPending && <ArrowRight className="w-5 h-5" />}
        </Button>
      </div>

    </div>
  );
}
