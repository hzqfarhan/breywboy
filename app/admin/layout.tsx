import { AdminOrderSoundNotifier } from "@/components/admin/AdminOrderSoundNotifier"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { AdminTopBar } from "@/components/layout/AdminTopBar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminOrderSoundNotifier />
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
