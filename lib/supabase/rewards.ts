import { supabase } from './client'

// ─── Rewards Queries ──────────────────────────────────────────────────────

/** All rewards, ordered by points required */
export async function getAllRewards() {
  const { data, error } = await supabase
    .from('Reward')
    .select('*')
    .order('pointsRequired', { ascending: true })

  if (error) console.error('[rewards] getAllRewards:', error.message)
  return data || []
}

/** All active rewards */
export async function getActiveRewards() {
  const { data, error } = await supabase
    .from('Reward')
    .select('*')
    .eq('isActive', true)
    .order('pointsRequired', { ascending: true })

  if (error) console.error('[rewards] getActiveRewards:', error.message)
  return data || []
}

/** Create a reward */
export async function createReward(input: { name: string, description?: string, pointsRequired: number, isActive?: boolean }) {
  const { data, error } = await supabase
    .from('Reward')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Update a reward */
export async function updateReward(id: string, input: { name?: string, description?: string, pointsRequired?: number, isActive?: boolean }) {
  const { data, error } = await supabase
    .from('Reward')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Delete a reward */
export async function deleteReward(id: string) {
  const { error } = await supabase
    .from('Reward')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

/** Redeem a reward for a user */
export async function redeemReward(userId: string, rewardId: string) {
  // 1. Get reward and user info
  const [{ data: reward }, { data: user }] = await Promise.all([
    supabase.from('Reward').select('*').eq('id', rewardId).single(),
    supabase.from('User').select('points').eq('id', userId).single()
  ])

  if (!reward || !user) throw new Error('Reward or User not found')
  if (user.points < reward.pointsRequired) throw new Error('Insufficient points')

  // 2. Start redemption (transaction-like sequence)
  // Deduct points
  const { error: userError } = await supabase
    .from('User')
    .update({ points: user.points - reward.pointsRequired })
    .eq('id', userId)

  if (userError) throw new Error('Failed to deduct points')

  // Create redemption record
  const { data: redemption, error: redeemError } = await supabase
    .from('RewardRedemption')
    .insert({
      userId,
      rewardId,
      rewardNameSnapshot: reward.name,
      pointsSpent: reward.pointsRequired,
      status: 'PENDING'
    })
    .select()
    .single()

  if (redeemError) throw new Error('Failed to create redemption record')

  return redemption
}

/** Get user redemption history */
export async function getUserRedemptions(userId: string) {
  const { data, error } = await supabase
    .from('RewardRedemption')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })

  if (error) console.error('[rewards] getUserRedemptions:', error.message)
  return data || []
}
