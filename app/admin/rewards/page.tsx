export const dynamic = "force-dynamic";
import { getAllRewards } from "@/lib/supabase/rewards"
import { RewardsClient } from "./RewardsClient"

export default async function RewardsPage() {
  const rewards = await getAllRewards()

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary">Reward Management</h2>
          <p className="text-muted-foreground text-sm">Manage customer loyalty rewards</p>
        </div>
      </div>
      
      <RewardsClient initialRewards={rewards} />
    </div>
  )
}
