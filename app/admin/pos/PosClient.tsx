"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { createWalkInOrderAction } from "./actions"
import type { CartItem } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  Banknote,
  CheckCircle2,
  Coffee,
  CreditCard,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"

type Product = {
  id: string
  name: string
  description: string | null
  categoryId: string
  basePrice: number | null
  hotPrice: number | null
  icedPrice: number | null
  hasTemperatureOption: boolean
  allowHot: boolean
  allowIced: boolean
  allowOatMilk: boolean
  allowExtraShot: boolean
  imageUrl?: string | null
}

type Category = {
  id: string
  name: string
  products: Product[]
}

type AddOn = {
  id: string
  name: string
  price: number
}

type CreatedOrder = {
  id: string
  orderNumber: string
}

export function PosClient({ categories, addOns }: { categories: Category[], addOns: AddOn[] }) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("Cash")
  const [customerName, setCustomerName] = useState("")
  const [notes, setNotes] = useState("")
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  const filteredCategories = useMemo(() => {
    return categories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        ),
      }))
      .filter((category) => category.products.length > 0)
  }, [categories, query])

  const cartTotal = cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const addToCart = (item: CartItem) => {
    setCartItems((current) => [...current, item])
    setSelectedProduct(null)
    setCreatedOrder(null)
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return
    setCartItems((current) =>
      current.map((item) => item.cartItemId === cartItemId ? { ...item, quantity } : item)
    )
  }

  const removeItem = (cartItemId: string) => {
    setCartItems((current) => current.filter((item) => item.cartItemId !== cartItemId))
  }

  const submitOrder = () => {
    setError("")
    setCreatedOrder(null)

    startTransition(async () => {
      try {
        const order = await createWalkInOrderAction(cartItems, paymentMethod, customerName, notes)
        setCreatedOrder(order)
        setCartItems([])
        setCustomerName("")
        setNotes("")
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Unable to create walk-in order")
      }
    })
  }

  return (
    <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="min-w-0 space-y-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu..."
              className="h-10 rounded-full pl-10"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap",
                  activeCategory === category.id ? "bg-primary text-primary-foreground" : "bg-white hover:bg-secondary"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <section key={category.id} className={cn(activeCategory !== category.id && !query ? "hidden" : "")}>
              <h3 className="mb-3 font-heading text-xl font-bold uppercase text-primary">{category.name}</h3>
              <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {category.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="flex items-center gap-3 rounded-2xl border bg-white p-3 text-left shadow-sm transition hover:border-primary/50"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <Coffee className="h-7 w-7 text-primary/25" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-tight">{product.name}</p>
                      <p className="mt-1 font-mono text-sm font-bold text-primary">{getPriceDisplay(product)}</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Plus className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <aside className="rounded-2xl border bg-white shadow-sm xl:sticky xl:top-20 xl:max-h-[calc(100vh-7rem)] xl:overflow-hidden">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-xl font-bold text-primary">Walk-in Cart</h3>
              <p className="text-sm text-muted-foreground">{itemCount} items</p>
            </div>
            {cartItems.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setCartItems([])}>
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[38vh] space-y-3 overflow-y-auto p-4 xl:max-h-[34vh]">
          {cartItems.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed bg-secondary/30 text-sm text-muted-foreground">
              No items selected.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartItemId} className="rounded-xl border p-3">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatCustomizations(item)}</p>
                  </div>
                  <button onClick={() => removeItem(item.cartItemId)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border p-1">
                    <button className="rounded-full bg-secondary p-1" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-sm">{item.quantity}</span>
                    <button className="rounded-full bg-primary p-1 text-primary-foreground" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="font-mono font-bold">RM{(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4 border-t p-4">
          <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Customer name (optional)" />
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Order notes (optional)" className="min-h-20 resize-none" />

          <div className="grid grid-cols-2 gap-2">
            <PaymentButton active={paymentMethod === "Cash"} onClick={() => setPaymentMethod("Cash")} icon={<Banknote className="h-4 w-4" />} label="Cash" />
            <PaymentButton active={paymentMethod === "Card"} onClick={() => setPaymentMethod("Card")} icon={<CreditCard className="h-4 w-4" />} label="Card" />
          </div>

          <div className="flex items-center justify-between border-t pt-4 text-lg font-bold text-primary">
            <span>Total</span>
            <span className="font-mono">RM{cartTotal.toFixed(2)}</span>
          </div>

          {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {createdOrder && (
            <div className="rounded-xl bg-success/10 p-3 text-sm">
              <p className="flex items-center gap-2 font-bold text-success-foreground">
                <CheckCircle2 className="h-4 w-4" />
                Order {createdOrder.orderNumber} recorded.
              </p>
              <Link href="/admin/orders" className="mt-1 inline-block text-xs font-medium underline">
                View in orders
              </Link>
            </div>
          )}

          <Button size="lg" className="h-12 w-full rounded-full" disabled={cartItems.length === 0 || isPending} onClick={submitOrder}>
            {isPending ? "Recording..." : "Record Walk-in Order"}
          </Button>
        </div>
      </aside>

      {selectedProduct && (
        <PosProductModal
          product={selectedProduct}
          addOns={addOns}
          onClose={() => setSelectedProduct(null)}
          onAdd={addToCart}
        />
      )}
    </div>
  )
}

function PosProductModal({
  product,
  addOns,
  onClose,
  onAdd,
}: {
  product: Product
  addOns: AddOn[]
  onClose: () => void
  onAdd: (item: CartItem) => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [temperature, setTemperature] = useState<"Hot" | "Iced" | undefined>(
    product.hasTemperatureOption ? (product.allowIced ? "Iced" : "Hot") : undefined
  )
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [instructions, setInstructions] = useState("")

  const isCoffee = product.categoryId === "cat-coffee"
  const isDrink = ["cat-coffee", "cat-non-coffee", "cat-matcha"].includes(product.categoryId)
  const availableAddOns = addOns.filter((addOn) => {
    if (addOn.name === "Oat Milk" && isDrink) return true
    if (addOn.name === "Extra Shot" && isCoffee) return true
    return false
  })

  const unitPrice = getUnitPrice(product, temperature, selectedAddOns)

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns((current) =>
      current.some((item) => item.id === addOn.id)
        ? current.filter((item) => item.id !== addOn.id)
        : [...current, addOn]
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/30 p-4 sm:items-center sm:justify-center">
      <div className="max-h-[92vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b p-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-primary">{product.name}</h3>
            <p className="font-mono text-sm font-bold text-primary">RM{unitPrice.toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-secondary p-2">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[58vh] space-y-5 overflow-y-auto p-4">
          {product.hasTemperatureOption && (
            <Section title="Temperature">
              <div className="grid grid-cols-2 gap-2">
                <OptionButton active={temperature === "Hot"} disabled={!product.allowHot} onClick={() => setTemperature("Hot")} label="Hot" />
                <OptionButton active={temperature === "Iced"} disabled={!product.allowIced} onClick={() => setTemperature("Iced")} label="Iced" />
              </div>
            </Section>
          )}

          {availableAddOns.length > 0 && (
            <Section title="Add-ons">
              <div className="space-y-2">
                {availableAddOns.map((addOn) => {
                  const active = selectedAddOns.some((item) => item.id === addOn.id)
                  return (
                    <button
                      key={addOn.id}
                      onClick={() => toggleAddOn(addOn)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-3 text-left",
                        active ? "border-primary bg-secondary" : "bg-white"
                      )}
                    >
                      <span className="font-medium text-sm">{addOn.name}</span>
                      <span className="font-mono text-sm">+RM{addOn.price.toFixed(2)}</span>
                    </button>
                  )
                })}
              </div>
            </Section>
          )}

          <Section title="Special Instructions">
            <Textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} className="resize-none" />
          </Section>
        </div>

        <div className="border-t p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Quantity</span>
            <div className="flex items-center gap-3 rounded-full border p-1">
              <button className="rounded-full bg-secondary p-2" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-mono font-bold">{quantity}</span>
              <button className="rounded-full bg-primary p-2 text-primary-foreground" onClick={() => setQuantity((value) => value + 1)}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <Button
            size="lg"
            className="h-12 w-full rounded-full"
            onClick={() => onAdd({
              cartItemId: crypto.randomUUID(),
              productId: product.id,
              name: product.name,
              unitPrice,
              quantity,
              imageUrl: product.imageUrl,
              customizations: {
                temperature,
                addOns: selectedAddOns,
                instructions,
              },
            })}
          >
            Add RM{(unitPrice * quantity).toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  )
}

function PaymentButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-bold",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-white hover:bg-secondary"
      )}
    >
      {icon}
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</h4>
      {children}
    </section>
  )
}

function OptionButton({ active, disabled, onClick, label }: { active: boolean, disabled?: boolean, onClick: () => void, label: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-xl border p-3 text-sm font-bold",
        disabled ? "opacity-40" : active ? "border-primary bg-primary text-primary-foreground" : "bg-white hover:bg-secondary"
      )}
    >
      {label}
    </button>
  )
}

function getUnitPrice(product: Product, temperature: "Hot" | "Iced" | undefined, addOns: AddOn[]) {
  let unitPrice = product.basePrice || 0

  if (product.hasTemperatureOption) {
    if (temperature === "Hot" && product.hotPrice !== null) unitPrice = product.hotPrice
    if (temperature === "Iced" && product.icedPrice !== null) unitPrice = product.icedPrice
  }

  return unitPrice + addOns.reduce((sum, addOn) => sum + addOn.price, 0)
}

function getPriceDisplay(product: Product) {
  if (!product.hasTemperatureOption && product.basePrice !== null) return `RM${product.basePrice.toFixed(2)}`
  if (product.allowIced && product.icedPrice !== null) return `RM${product.icedPrice.toFixed(2)}`
  if (product.allowHot && product.hotPrice !== null) return `RM${product.hotPrice.toFixed(2)}`
  return "RM0.00"
}

function formatCustomizations(item: CartItem) {
  const parts = [
    item.customizations.temperature,
    item.customizations.addOns.map((addOn) => addOn.name).join(", "),
    item.customizations.instructions ? `Note: ${item.customizations.instructions}` : "",
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(" • ") : "Standard"
}
