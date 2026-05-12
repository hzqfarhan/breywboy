"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { redeemRewardAction } from "./actions"
import { Loader2 } from "lucide-react"

export function RedemptionButton({ rewardId, canRedeem }: { rewardId: string, canRedeem: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleRedeem = () => {
    if (!confirm("Are you sure you want to redeem this reward?")) return
    
    startTransition(async () => {
      const result = await redeemRewardAction(rewardId)
      if (!result.success) {
        setError(result.message || "Failed to redeem")
        alert(result.message || "Failed to redeem")
      } else {
        alert("Reward redeemed successfully! Please check your history.")
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button 
        size="sm" 
        variant={canRedeem ? "default" : "secondary"}
        className={canRedeem ? "bg-primary rounded-full px-4 text-xs h-7" : "rounded-full px-4 text-xs h-7 pointer-events-none"}
        disabled={!canRedeem || isPending}
        onClick={handleRedeem}
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Redeem"}
      </Button>
      {error && <span className="text-[10px] text-destructive font-medium">{error}</span>}
    </div>
  )
}
