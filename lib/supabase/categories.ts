import { supabase } from './client'

/** All categories for admin forms */
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('Category')
    .select('*')
    .order('sortOrder', { ascending: true })

  if (error) console.error('[categories] getAllCategories:', error.message)
  return data || []
}

/** Create a new category */
export async function createCategory(input: { name: string, slug?: string, sortOrder?: number, isActive?: boolean }) {
  const { data, error } = await supabase
    .from('Category')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Update an existing category */
export async function updateCategory(id: string, input: { name?: string, slug?: string, sortOrder?: number, isActive?: boolean }) {
  const { data, error } = await supabase
    .from('Category')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

/** Delete a category */
export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('Category')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
