import { prisma, auth } from "@/lib/auth"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { Gift, Star, Trophy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function RewardsPage() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id }
  })
  
  const rewards = await prisma.reward.findMany({
    where: { isActive: true },
    orderBy: { pointsRequired: 'asc' }
  })

  const points = user?.points || 0
  
  // Determine tier
  let tier = "Newcomer"
  let nextTier = "Regular"
  let nextTierPoints = 200
  let progress = (points / nextTierPoints) * 100

  if (points >= 500) {
    tier = "Breywboss"
    nextTier = "Max Tier"
    progress = 100
  } else if (points >= 200) {
    tier = "Regular"
    nextTier = "Breywboss"
    nextTierPoints = 500
    progress = ((points - 200) / 300) * 100
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title="Breywboy Rewards" />
      
      <div className="p-4 space-y-6 pb-20">
        
        {/* Balance Card */}
        <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white/20 p-3 rounded-full mb-3 inline-flex">
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <p className="text-sm font-medium opacity-90 mb-1">{tier} Member</p>
            <h2 className="text-5xl font-mono font-bold mb-2">{points} <span className="text-xl font-sans font-normal opacity-80">pts</span></h2>
            <p className="text-sm opacity-80 max-w-[200px]">Earn 1 point for every RM1 spent in-store or online.</p>
          </div>
          
          {/* Abstract background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
        </div>

        {/* Progress */}
        {tier !== "Breywboss" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Next Tier</p>
                <p className="font-bold text-primary">{nextTier}</p>
              </div>
              <p className="text-sm font-mono">{points} / {nextTierPoints}</p>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Earn {nextTierPoints - points} more points to reach {nextTier}.
            </p>
          </div>
        )}

        {/* Available Rewards */}
        <section className="space-y-4">
          <h3 className="font-heading font-bold text-xl text-primary">Redeem Rewards</h3>
          
          <div className="space-y-3">
            {rewards.map(reward => {
              const canRedeem = points >= reward.pointsRequired
              return (
                <div key={reward.id} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${canRedeem ? 'bg-white shadow-sm border-accent/30' : 'bg-white/50 border-border opacity-70'}`}>
                  <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-xl ${canRedeem ? 'bg-accent/10 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                      <Gift className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight mb-1">{reward.name}</h4>
                      <p className="text-xs text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
                    <span className={`font-mono font-bold ${canRedeem ? 'text-primary' : 'text-muted-foreground'}`}>
                      {reward.pointsRequired} pts
                    </span>
                    <Button 
                      size="sm" 
                      variant={canRedeem ? "default" : "secondary"}
                      className={canRedeem ? "bg-primary rounded-full px-4 text-xs h-7" : "rounded-full px-4 text-xs h-7 pointer-events-none"}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </div>
    </div>
  )
}
