"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrderTracker({ status }: { status: string }) {
  const steps = [
    { id: "NEW", label: "Order Placed" },
    { id: "PREPARING", label: "Preparing" },
    { id: "READY", label: "Ready for Pickup" },
  ];

  const currentIdx = steps.findIndex(s => s.id === status);
  const activeIdx = currentIdx === -1 ? 2 : currentIdx; // If completed, all active

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border relative">
      <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-secondary"></div>
      
      <div className="space-y-8 relative z-10">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          
          return (
            <div key={step.id} className={cn("flex items-center gap-4 transition-all", (!isCompleted && !isCurrent) && "opacity-50")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center bg-white",
                isCompleted ? "text-success" : isCurrent ? "text-primary animate-pulse" : "text-muted-foreground"
              )}>
                {isCompleted ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-6 h-6 fill-current border-2 rounded-full" />}
              </div>
              <div className="flex-1">
                <p className={cn("font-bold text-sm", isCurrent && "text-primary text-base")}>{step.label}</p>
                {isCurrent && <p className="text-xs text-muted-foreground mt-0.5">We're on it!</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
