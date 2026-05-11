import { supabase } from './client'

// ─── Menu & Product Queries ────────────────────────────────────────────────

/** All categories with their available products, ordered by sortOrder */
export async function getMenuCategories() {
  const { data, error } = await supabase
    .from('Category')
    .select(`*, products:Product(*)`)
    .order('sortOrder', { ascending: true })

  if (error) console.error('[menu] getMenuCategories:', error.message)

  return (data || []).map((cat) => ({
    ...cat,
    products: (cat.products || []).filter((p: any) => p.isAvailable),
  }))
}

/** All available add-ons */
export async function getAddOns() {
  const { data, error } = await supabase
    .from('AddOn')
    .select('*')
    .eq('isAvailable', true)

  if (error) console.error('[menu] getAddOns:', error.message)
  return data || []
}

/** Popular products for the customer dashboard */
export async function getPopularProducts(limit = 4) {
  const { data, error } = await supabase
    .from('Product')
    .select('*, category:Category(*)')
    .eq('isPopular', true)
    .eq('isAvailable', true)
    .limit(limit)

  if (error) console.error('[menu] getPopularProducts:', error.message)
  return data || []
}

/** All products for admin management */
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('Product')
    .select('*, category:Category(*)')
    .order('categoryId', { ascending: true })
    .order('name', { ascending: true })

  if (error) console.error('[menu] getAllProducts:', error.message)
  return data || []
}

/** Single product by id */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('Product')
    .select('*')
    .eq('id', id)
    .single()

  if (error) console.error('[menu] getProductById:', error.message)
  return data
}

/** Toggle product availability */
export async function setProductAvailability(id: string, isAvailable: boolean) {
  const { error } = await supabase
    .from('Product')
    .update({ isAvailable })
    .eq('id', id)

  if (error) console.error('[menu] setProductAvailability:', error.message)
  return !error
}
