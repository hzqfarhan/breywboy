"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Coffee, ListTree, Tags, Gift, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const routes = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: Coffee },
  { href: "/admin/categories", label: "Categories", icon: ListTree },
  { href: "/admin/promos", label: "Promos", icon: Tags },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-sidebar border-r hidden md:flex flex-col h-full z-10 relative">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/assets/brey-this.png" alt="Breywboy" className="h-9 w-auto" />
          <span className="font-heading font-bold text-xl tracking-tight text-sidebar-primary">Admin</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href || (route.href !== "/admin" && pathname.startsWith(route.href))
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <route.icon className="w-5 h-5" />
                {route.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
