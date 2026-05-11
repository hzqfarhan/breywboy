import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { CheckoutClient } from "./CheckoutClient"

export default function CheckoutPage() {
  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title="Checkout" showBack />
      <CheckoutClient />
    </div>
  )
}
