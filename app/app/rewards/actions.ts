"use server"

import { auth } from "@/lib/auth"
import { redeemReward } from "@/lib/supabase/rewards"
import { revalidatePath } from "next/cache"

export async function redeemRewardAction(rewardId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  try {
    await redeemReward(session.user.id, rewardId)
    revalidatePath("/app/rewards")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
