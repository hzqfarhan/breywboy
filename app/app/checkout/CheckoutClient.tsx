"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, MapPin, CheckCircle2, CreditCard, Coffee, Utensils, Tag, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { createOrderAction, validatePromoAction } from "./actions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CheckoutClient() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const [fulfillmentType, setFulfillmentType] = useState("PICKUP");
  const [pickupTime, setPickupTime] = useState("ASAP");
  const [paymentMethod, setPaymentMethod] = useState("Counter");
  const [promoCode, setPromoCode] = useState("");
  const [promoData, setPromoData] = useState<{ id: string, code: string, discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (items.length === 0) {
    router.push("/app/cart");
    return null;
  }

  const handleCheckout = () => {
    setSubmitError("");
    startTransition(async () => {
      try {
        const result = await createOrderAction(items, paymentMethod, pickupTime, fulfillmentType, promoData || undefined);
        clearCart();
        router.push(`/app/orders/${result.orderId}`);
      } catch (e) {
        console.error(e);
        setSubmitError(e instanceof Error ? e.message : "Failed to submit order. Please try again.");
      }
    });
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setIsValidating(true);
    setPromoError("");
    try {
      const result = await validatePromoAction(promoCode, getCartTotal());
      if (result.success && result.promo) {
        setPromoData(result.promo);
      } else {
        setPromoError(result.message || "Invalid promo code");
        setPromoData(null);
      }
    } catch (e) {
      setPromoError("Failed to validate promo code");
    } finally {
      setIsValidating(false);
    }
  };

  const finalTotal = getCartTotal() - (promoData?.discount || 0);

  return (
    <div className="flex-1 p-4 pb-48 space-y-6">
      
      {/* Order Type */}
      <section className="space-y-3">
        <h3 className="font-heading font-bold text-lg uppercase tracking-wide">Order Type</h3>
        
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
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFulfillmentType("PICKUP")}
              className={cn(
                "py-3 px-2 rounded-xl text-sm font-medium transition-all border flex flex-col items-center justify-center gap-1",
                fulfillmentType === "PICKUP" ? "bg-primary border-primary text-primary-foreground" : "bg-white border-border text-foreground hover:bg-secondary"
              )}
            >
              <Coffee className="h-4 w-4" />
              <span>Takeaway</span>
              <span className="text-[10px] opacity-80 font-normal">Pick up at counter</span>
            </button>
            <button
              onClick={() => {
                setFulfillmentType("DINE_IN");
                setPickupTime("ASAP");
              }}
              className={cn(
                "py-3 px-2 rounded-xl text-sm font-medium transition-all border flex flex-col items-center justify-center gap-1",
                fulfillmentType === "DINE_IN" ? "bg-primary border-primary text-primary-foreground" : "bg-white border-border text-foreground hover:bg-secondary"
              )}
            >
              <Utensils className="h-4 w-4" />
              <span>Dine-in</span>
              <span className="text-[10px] opacity-80 font-normal">Eat at store</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-full">
              <Clock className="w-5 h-5 text-foreground" />
            </div>
            <p className="font-bold text-sm text-foreground">{fulfillmentType === "DINE_IN" ? "Serve Time" : "Pickup Time"}</p>
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
              disabled={fulfillmentType === "DINE_IN"}
              className={cn(
                "py-3 px-2 rounded-xl text-sm font-medium transition-all border flex flex-col items-center justify-center gap-1",
                fulfillmentType === "DINE_IN" && "opacity-40 cursor-not-allowed",
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
            disabled
            className="w-full p-4 flex items-center justify-between border-b opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div className="text-left">
                <span className="font-medium text-sm text-foreground">Online Payment</span>
                <p className="text-[10px] text-muted-foreground">Stripe checkout will be connected later</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Soon</span>
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

      {/* Promo Code */}
      <section className="space-y-3">
        <h3 className="font-heading font-bold text-lg uppercase tracking-wide">Promo Code</h3>
        <div className="bg-white p-4 rounded-2xl border border-border">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter Code"
                className="w-full pl-9 pr-3 py-2 bg-secondary border-none rounded-xl text-sm focus:ring-2 focus:ring-primary uppercase font-bold"
              />
            </div>
            <Button 
              size="sm" 
              className="rounded-xl px-4" 
              onClick={handleApplyPromo}
              disabled={isValidating || !promoCode}
            >
              {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
            </Button>
          </div>
          {promoError && <p className="mt-2 text-xs text-destructive font-medium">{promoError}</p>}
          {promoData && (
            <div className="mt-2 flex items-center justify-between bg-success/10 p-2 rounded-lg border border-success/20">
              <span className="text-xs text-success-foreground font-bold">Applied: {promoData.code}</span>
              <button onClick={() => {setPromoData(null); setPromoCode("");}} className="text-[10px] underline text-muted-foreground">Remove</button>
            </div>
          )}
        </div>
      </section>

      {/* Order Summary */}
      <section className="bg-white p-4 rounded-2xl border border-border space-y-3">
        <h4 className="font-bold text-sm mb-1 uppercase tracking-wide">Payment Summary</h4>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
          <span className="font-mono">RM{getCartTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Order type</span>
          <span className="font-medium">{fulfillmentType === "DINE_IN" ? "Dine-in" : "Takeaway"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-medium">{paymentMethod === "Online" ? "Online - pending Stripe" : "Pay at counter"}</span>
        </div>
        {promoData && (
          <div className="flex justify-between text-sm text-success-foreground font-medium italic">
            <span>Discount ({promoData.code})</span>
            <span className="font-mono">-RM{promoData.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-3 border-t flex justify-between font-bold text-lg text-primary">
          <span>Total</span>
          <span className="font-mono">RM{finalTotal.toFixed(2)}</span>
        </div>
      </section>

      {submitError && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {submitError}
        </div>
      )}

      {/* Sticky Confirm Button */}
      <div className="fixed bottom-28 left-4 right-4 z-40">
        <Button 
          size="lg" 
          className="w-full h-14 rounded-full text-lg flex justify-between px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-black/20 animate-in slide-in-from-bottom-5"
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
