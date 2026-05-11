import { CustomerBottomNav } from "@/components/layout/CustomerBottomNav"

export default function CustomerAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-16">
        {children}
      </main>
      <CustomerBottomNav />
    </div>
  )
}
