"use client"

import { useState, useTransition } from "react"
import {
  createProductAction,
  deleteProductAction,
  toggleProductAvailability,
  updateProductAction,
} from "./actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Coffee, Pencil, Plus, Trash2 } from "lucide-react"

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  description: string | null
  categoryId: string
  category?: Category | null
  imageUrl: string | null
  basePrice: number | null
  hotPrice: number | null
  icedPrice: number | null
  hasTemperatureOption: boolean
  allowHot: boolean
  allowIced: boolean
  allowOatMilk: boolean
  allowExtraShot: boolean
  isAvailable: boolean
  isPopular: boolean
}

export function MenuClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[],
  categories: Category[],
}) {
  const [products, setProducts] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleToggle = async (id: string, current: boolean) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !current } : p))
    try {
      await toggleProductAvailability(id, !current)
    } catch {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: current } : p))
    }
  }

  const handleDelete = (product: Product) => {
    if (!confirm(`Delete ${product.name}?`)) return
    setProducts(prev => prev.filter(p => p.id !== product.id))
    startTransition(async () => {
      await deleteProductAction(product.id)
    })
  }

  const closeForm = () => {
    setEditingProduct(null)
    setIsCreating(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setIsCreating(true); setEditingProduct(null) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu
        </Button>
      </div>

      {(isCreating || editingProduct) && (
        <ProductForm
          key={editingProduct?.id || "new"}
          product={editingProduct}
          categories={categories}
          onDone={closeForm}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <Coffee className="h-5 w-5 text-primary/30" />
                      )}
                    </div>
                    <div>
                      <p>{product.name}</p>
                      {product.isPopular && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">POPULAR</span>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                <TableCell className="font-mono">
                  {product.hasTemperatureOption ? (
                    <div className="text-xs">
                      {product.allowHot && product.hotPrice !== null && `Hot: RM${product.hotPrice.toFixed(2)} `}
                      {product.allowIced && product.icedPrice !== null && `Iced: RM${product.icedPrice.toFixed(2)}`}
                    </div>
                  ) : (
                    `RM${(product.basePrice || 0).toFixed(2)}`
                  )}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.isAvailable ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {product.isAvailable ? 'Available' : 'Sold Out'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleToggle(product.id, product.isAvailable)}>
                      Mark {product.isAvailable ? 'Sold Out' : 'Available'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setEditingProduct(product); setIsCreating(false) }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" disabled={isPending} onClick={() => handleDelete(product)}>
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

function ProductForm({
  product,
  categories,
  onDone,
}: {
  product: Product | null,
  categories: Category[],
  onDone: () => void,
}) {
  const [hasTemperatureOption, setHasTemperatureOption] = useState(product?.hasTemperatureOption ?? true)
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction

  return (
    <form
      action={async (formData) => {
        await action(formData)
        onDone()
      }}
      className="rounded-2xl border bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold text-primary">{product ? "Edit Menu Item" : "Add Menu Item"}</h3>
          <p className="text-sm text-muted-foreground">Add picture URL, price, and customer-facing details.</p>
        </div>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input name="name" defaultValue={product?.name || ""} required />
        </Field>
        <Field label="Category">
          <select name="categoryId" defaultValue={product?.categoryId || categories[0]?.id || ""} className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" required>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Picture URL">
          <Input name="imageUrl" defaultValue={product?.imageUrl || ""} placeholder="/assets/menu/latte.png" />
        </Field>
        <Field label="Base Price">
          <Input name="basePrice" type="number" step="0.01" min="0" defaultValue={product?.basePrice ?? ""} disabled={hasTemperatureOption} />
        </Field>
        <Field label="Hot Price">
          <Input name="hotPrice" type="number" step="0.01" min="0" defaultValue={product?.hotPrice ?? ""} disabled={!hasTemperatureOption} />
        </Field>
        <Field label="Iced Price">
          <Input name="icedPrice" type="number" step="0.01" min="0" defaultValue={product?.icedPrice ?? ""} disabled={!hasTemperatureOption} />
        </Field>
        <Field label="Details" className="md:col-span-2">
          <Textarea name="description" defaultValue={product?.description || ""} className="min-h-20" />
        </Field>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-secondary p-3 sm:grid-cols-2 lg:grid-cols-4">
        <Check name="hasTemperatureOption" label="Temperature prices" checked={hasTemperatureOption} onChange={setHasTemperatureOption} />
        <Check name="allowHot" label="Allow hot" checked={product?.allowHot ?? true} disabled={!hasTemperatureOption} />
        <Check name="allowIced" label="Allow iced" checked={product?.allowIced ?? true} disabled={!hasTemperatureOption} />
        <Check name="allowOatMilk" label="Allow oat milk" checked={product?.allowOatMilk ?? true} />
        <Check name="allowExtraShot" label="Allow extra shot" checked={product?.allowExtraShot ?? true} />
        <Check name="isAvailable" label="Available" checked={product?.isAvailable ?? true} />
        <Check name="isPopular" label="Popular" checked={product?.isPopular ?? false} />
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit">{product ? "Save Menu Item" : "Create Menu Item"}</Button>
      </div>
    </form>
  )
}

function Field({ label, className, children }: { label: string, className?: string, children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

function Check({
  name,
  label,
  checked,
  disabled,
  onChange,
}: {
  name: string,
  label: string,
  checked: boolean,
  disabled?: boolean,
  onChange?: (checked: boolean) => void,
}) {
  const [isChecked, setIsChecked] = useState(checked)

  return (
    <label className={`flex items-center gap-2 text-sm font-medium ${disabled ? "opacity-50" : ""}`}>
      <input
        type="checkbox"
        name={name}
        checked={isChecked}
        disabled={disabled}
        onChange={(event) => {
          setIsChecked(event.target.checked)
          onChange?.(event.target.checked)
        }}
      />
      {label}
    </label>
  )
}
