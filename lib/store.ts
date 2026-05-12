import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartCustomizations {
  temperature?: 'Hot' | 'Iced'
  addOns: { id: string, name: string, price: number }[]
  instructions?: string
}

export interface CartItem {
  cartItemId: string
  productId: string
  name: string
  unitPrice: number
  quantity: number
  customizations: CartCustomizations
  imageUrl?: string | null
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        // Simple add without deep equality check for customizations
        // For MVP, we treat every added customized item as a unique cart row
        set((state) => ({ items: [...state.items, item] }))
      },
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId)
        }))
      },
      updateQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId ? { ...i, quantity } : i
          )
        }))
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
      }
    }),
    {
      name: 'breywboy-cart',
    }
  )
)

interface UIState {
  isAdminSidebarOpen: boolean
  toggleAdminSidebar: () => void
  setAdminSidebarOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isAdminSidebarOpen: false,
  toggleAdminSidebar: () => set((state) => ({ isAdminSidebarOpen: !state.isAdminSidebarOpen })),
  setAdminSidebarOpen: (isOpen) => set({ isAdminSidebarOpen: isOpen }),
}))

