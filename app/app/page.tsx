export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth"
import { getUserById } from "@/lib/supabase/users"
import { getActiveOrder } from "@/lib/supabase/orders"
import { getPopularProducts } from "@/lib/supabase/menu"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { BannerCarousel } from "@/components/dashboard/BannerCarousel"
import { Coffee, Gift, ChevronRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function CustomerDashboard() {
  const session = await auth()
  const userId = session?.user?.id || ''

  const [user, activeOrder, popularItems] = await Promise.all([
    getUserById(userId),
    getActiveOrder(userId),
    getPopularProducts(4),
  ])

  return (
    <div className="flex flex-col h-full bg-background">
      <CustomerTopBar />
      
      <div className="p-4 space-y-6">
        <div className="mb-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Welcome back,</p>
          <h2 className="text-3xl font-heading font-bold text-primary">
            {user?.name?.split(' ')[0] || 'Yunn'}!
          </h2>
        </div>

        <BannerCarousel />
        
        {/* Active Order Card */}
        {activeOrder && (
          <Link href={`/app/orders/${activeOrder.id}`}>
            <div className="bg-primary text-primary-foreground p-5 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium opacity-80">Order #{activeOrder.orderNumber}</span>
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{activeOrder.status}</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-1">Your order is {activeOrder.status.toLowerCase()}</h3>
                <p className="text-sm opacity-80 mb-4">View status tracker</p>
                <div className="flex items-center text-sm font-medium">
                  Track Order <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
              <img src="/assets/brey-this.png" alt="" className="absolute -bottom-6 -right-6 w-32 h-auto opacity-10" />
            </div>
          </Link>
        )}

        {/* Rewards Card */}
        <Link href="/app/rewards" className="block">
          <div className="bg-white p-5 rounded-3xl shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Rewards Balance</p>
                <p className="text-2xl font-bold font-mono text-primary">{user?.points || 0} pts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Link>

        {/* Popular Today */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-primary">Popular Today</h2>
            <Link href="/app/menu" className="text-sm font-medium text-accent hover:underline">
              See All
            </Link>
          </div>
          
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-4 snap-x">
            {(popularItems || []).map((item: any) => (
              <Link key={item.id} href="/app/menu" className="min-w-[160px] snap-start bg-white rounded-2xl shadow-sm border p-3 flex flex-col">
                <div className="w-full aspect-square bg-secondary rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Coffee className="w-12 h-12 text-primary/20" />
                  )}
                </div>
                <h3 className="font-bold text-sm leading-tight mb-1 line-clamp-2 flex-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-mono font-bold text-primary text-xs">
                    {item.hasTemperatureOption ? (
                      `RM${(item.icedPrice || item.hotPrice || 0).toFixed(2)}`
                    ) : (
                      `RM${(item.basePrice || 0).toFixed(2)}`
                    )}
                  </span>
                  <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 ml-1">
                    <span className="text-lg leading-none mb-0.5">+</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
