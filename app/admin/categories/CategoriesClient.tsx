"use client"

import { useState, useTransition } from "react"
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction, 
  toggleCategoryActive 
} from "./actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Pencil, Trash2, ListTree } from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string | null
  sortOrder: number
  isActive: boolean
}

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (id: string, current: boolean) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: !current } : c))
    try {
      await toggleCategoryActive(id, !current)
    } catch {
      setCategories(prev => prev.map(c => c.id === id ? { ...c, isActive: current } : c))
    }
  }

  const handleDelete = (category: Category) => {
    if (!confirm(`Delete category "${category.name}"? This will delete all products in this category!`)) return
    setCategories(prev => prev.filter(c => c.id !== category.id))
    startTransition(async () => {
      await deleteCategoryAction(category.id)
    })
  }

  const closeForm = () => {
    setEditingCategory(null)
    setIsCreating(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setIsCreating(true); setEditingCategory(null) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {(isCreating || editingCategory) && (
        <CategoryForm 
          key={editingCategory?.id || "new"}
          category={editingCategory}
          onDone={closeForm}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="font-bold text-primary flex items-center gap-2">
                  <ListTree className="w-4 h-4 text-muted-foreground" />
                  {category.name}
                </TableCell>
                <TableCell className="font-mono text-xs">{category.slug || "-"}</TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${category.isActive ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {category.isActive ? 'Active' : 'Hidden'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggle(category.id, category.isActive)}>
                      {category.isActive ? 'Hide' : 'Show'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setEditingCategory(category); setIsCreating(false) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleDelete(category)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function CategoryForm({ category, onDone }: { category: Category | null, onDone: () => void }) {
  const action = category ? updateCategoryAction.bind(null, category.id) : createCategoryAction

  return (
    <form 
      action={async (formData) => {
        await action(formData)
        onDone()
      }}
      className="rounded-2xl border bg-white p-6 shadow-sm mb-6"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold text-primary">{category ? "Edit Category" : "Add New Category"}</h3>
          <p className="text-sm text-muted-foreground">Manage how your menu is organized.</p>
        </div>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Category Name">
          <Input name="name" defaultValue={category?.name || ""} required placeholder="e.g. Coffee" />
        </Field>
        <Field label="Slug">
          <Input name="slug" defaultValue={category?.slug || ""} placeholder="e.g. coffee" />
        </Field>
        <Field label="Sort Order">
          <Input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} />
        </Field>
        <div className="flex items-center gap-2 pt-6">
          <input 
            type="checkbox" 
            name="isActive" 
            id="isActive" 
            defaultChecked={category?.isActive ?? true} 
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-medium">Visible to customers</label>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit">{category ? "Save Changes" : "Create Category"}</Button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
