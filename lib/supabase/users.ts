import { supabase } from './client'

// ─── User Queries ─────────────────────────────────────────────────────────

/** Get user by id */
export async function getUserById(id: string) {
  if (!id) return null
  const { data, error } = await supabase
    .from('User')
    .select('*, Order(*)')
    .eq('id', id)
    .single()

  if (error) console.error('[users] getUserById:', error.message)
  return data
}

/** Get user by email */
export async function getUserByEmail(email: string) {
  if (!email) return null
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[users] getUserByEmail:', error.message)
  }
  return data
}

/** Get all customers (role = CUSTOMER) */
export async function getAllCustomers() {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('role', 'CUSTOMER')
    .order('name', { ascending: true })

  if (error) console.error('[users] getAllCustomers:', error.message)
  return data || []
}

/** Add reward points to a user */
export async function addUserPoints(id: string, pointsToAdd: number) {
  const user = await getUserById(id)
  if (!user) return false

  const { error } = await supabase
    .from('User')
    .update({ points: (user.points || 0) + pointsToAdd })
    .eq('id', id)

  if (error) console.error('[users] addUserPoints:', error.message)
  return !error
}

/** Upsert user (used for seeding demo accounts) */
export async function upsertUser(user: {
  id: string
  name: string
  email: string
  passwordHash: string
  role: string
  points?: number
}) {
  const existing = await getUserByEmail(user.email)
  if (existing) return { status: 'exists' as const, user: existing }

  const { data, error } = await supabase.from('User').insert(user).select().single()
  if (error) {
    console.error('[users] upsertUser:', error.message)
    return { status: 'error' as const, error: error.message }
  }
  return { status: 'created' as const, user: data }
}

/** Update user details */
export async function updateUser(id: string, updates: any) {
  if (!id) return false
  const { data, error } = await supabase
    .from('User')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[users] updateUser:', error.message)
    return { success: false, error: error.message }
  }
  return { success: true, data }
}
