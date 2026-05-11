import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { CartClient } from "./CartClient"

export default function CartPage() {
  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title="Your Cart" showBack />
      <CartClient />
    </div>
  )
}
