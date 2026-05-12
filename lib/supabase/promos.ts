import { supabase } from './client'

export type PromoInput = {
  code: string
  description?: string | null
  discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number
  minOrderAmount?: number
  maxUses?: number | null
  isActive: boolean
  startsAt?: string
  expiresAt?: string | null
}

/** Get all promos for admin */
export async function getAllPromos() {
  const { data, error } = await supabase
    .from('Promo')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) console.error('[promos] getAllPromos:', error.message)
  return data || []
}

/** Get a promo by its code (for checkout) */
export async function getPromoByCode(code: string) {
  const { data, error } = await supabase
    .from('Promo')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('isActive', true)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[promos] getPromoByCode:', error.message)
  }
  return data
}

/** Create a new promo */
export async function createPromo(input: PromoInput) {
  const { data, error } = await supabase
    .from('Promo')
    .insert({ ...input, code: input.code.toUpperCase() })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Update an existing promo */
export async function updatePromo(id: string, input: Partial<PromoInput>) {
  const { data, error } = await supabase
    .from('Promo')
    .update({ ...input, code: input.code?.toUpperCase() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Delete a promo */
export async function deletePromo(id: string) {
  const { error } = await supabase
    .from('Promo')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}

/** Increment promo usage count */
export async function incrementPromoUsage(id: string) {
  const { data: promo } = await supabase.from('Promo').select('currentUses').eq('id', id).single()
  if (!promo) return false

  const { error } = await supabase
    .from('Promo')
    .update({ currentUses: (promo.currentUses || 0) + 1 })
    .eq('id', id)

  return !error
}
