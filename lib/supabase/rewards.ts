import { supabase } from './client'

// ─── Rewards Queries ──────────────────────────────────────────────────────

/** All active rewards, ordered by points required */
export async function getActiveRewards() {
  const { data, error } = await supabase
    .from('Reward')
    .select('*')
    .eq('isActive', true)
    .order('pointsRequired', { ascending: true })

  if (error) console.error('[rewards] getActiveRewards:', error.message)
  return data || []
}
