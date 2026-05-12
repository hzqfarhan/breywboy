"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Coffee, Gift, Receipt, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/app", icon: Home },
  { name: "Menu", href: "/app/menu", icon: Coffee },
  { name: "Rewards", href: "/app/rewards", icon: Gift },
  { name: "Orders", href: "/app/orders", icon: Receipt },
  { name: "Profile", href: "/app/profile", icon: User },
];

export function CustomerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-white/5 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 relative group",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "absolute -top-1 w-8 h-1 rounded-full transition-all duration-300",
                isActive ? "bg-primary opacity-100" : "bg-transparent opacity-0 group-hover:opacity-30 group-hover:bg-muted-foreground"
              )} />
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200",
                isActive ? "scale-110" : "group-hover:scale-110"
              )} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive ? "opacity-100 translate-y-0" : "opacity-80 group-hover:opacity-100"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
