"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Menu } from "lucide-react"
import { useUIStore } from "@/lib/store"

export function AdminTopBar() {
  const pathname = usePathname()
  const { toggleAdminSidebar } = useUIStore()

  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard"
    if (pathname.startsWith("/admin/orders")) return "Orders"
    if (pathname.startsWith("/admin/menu")) return "Menu"
    if (pathname.startsWith("/admin/categories")) return "Categories"
    if (pathname.startsWith("/admin/promos")) return "Promos"
    if (pathname.startsWith("/admin/rewards")) return "Rewards"
    if (pathname.startsWith("/admin/customers")) return "Customers"
    if (pathname.startsWith("/admin/settings")) return "Settings"
    return "Admin"
  }

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10 relative">
      <div className="flex items-center gap-4">
        <button onClick={toggleAdminSidebar} className="md:hidden text-muted-foreground p-1 hover:bg-secondary rounded-md">
          <Menu className="w-6 h-6" />
        </button>
        <img src="/assets/brey-this.png" alt="Breywboy" className="h-9 w-auto md:hidden" />
        <h1 className="font-heading font-bold text-xl text-primary">{getTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-9 pr-4 py-2 bg-secondary/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="relative text-muted-foreground hover:text-primary">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
