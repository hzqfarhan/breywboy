"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, Coffee, ListTree, Tags, Gift, Users, Settings, X, Eye, MonitorCog, Boxes, ClipboardList, PackageSearch, Receipt, FlaskConical, SlidersHorizontal, ChartNoAxesColumnIncreasing, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/lib/store"

const routes = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pos", label: "POS", icon: MonitorCog },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: Coffee },
  { href: "/admin/storefront", label: "Storefront View", icon: Eye },
  { href: "/admin/categories", label: "Categories", icon: ListTree },
  { href: "/admin/promos", label: "Promos", icon: Tags },
  { href: "/admin/rewards", label: "Rewards", icon: Gift },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

const routeGroups = [
  {
    title: "Inventory",
    routes: [
      { href: "/admin/inventory", label: "Overview", icon: Boxes },
      { href: "/admin/inventory/materials", label: "Raw Materials", icon: PackageSearch },
      { href: "/admin/inventory/batches", label: "Stock Batches", icon: ClipboardList },
      { href: "/admin/inventory/purchases", label: "Purchases", icon: Receipt },
      { href: "/admin/inventory/recipes", label: "Recipes", icon: FlaskConical },
      { href: "/admin/inventory/adjustments", label: "Stock Adjustments", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Profit",
    routes: [
      { href: "/admin/profit/products", label: "Product Margins", icon: ChartNoAxesColumnIncreasing },
      { href: "/admin/profit/orders", label: "Order Profit", icon: Receipt },
      { href: "/admin/profit/reports", label: "Reports", icon: FileText },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { isAdminSidebarOpen, setAdminSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile Overlay */}
      {isAdminSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setAdminSidebarOpen(false)}
        />
      )}
      
      <aside className={cn(
        "w-64 bg-sidebar border-r flex flex-col h-full z-50 fixed md:relative transition-transform duration-300 ease-in-out",
        isAdminSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b shrink-0">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setAdminSidebarOpen(false)}>
            <img src="/assets/brey-this.png" alt="Breywboy" className="h-9 w-auto" />
            <span className="font-heading font-bold text-xl tracking-tight text-sidebar-primary">Admin</span>
          </Link>
          <button className="md:hidden text-muted-foreground p-1 hover:bg-secondary rounded-md" onClick={() => setAdminSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
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
          {routeGroups.map((group) => (
            <div key={group.title} className="pt-4">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{group.title}</p>
              <div className="space-y-1">
                {group.routes.map((route) => {
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
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
    </>
  )
}
