"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  showBack?: boolean;
}

export function CustomerTopBar({ title, showBack = false }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const getTitle = () => {
    if (title) return title;
    if (pathname === "/app") return "Good Morning, Breywboss";
    if (pathname.startsWith("/app/menu")) return "Menu";
    if (pathname.startsWith("/app/cart")) return "Your Cart";
    if (pathname.startsWith("/app/checkout")) return "Checkout";
    if (pathname.startsWith("/app/orders")) return "Orders";
    if (pathname.startsWith("/app/rewards")) return "Rewards";
    if (pathname.startsWith("/app/profile")) return "Profile";
    return "";
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
      <div className="flex items-center h-14 px-4 gap-3">
        {showBack && (
          <Button variant="ghost" size="icon" className="w-8 h-8 -ml-2" onClick={() => router.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <img src="/assets/brey-this.png" alt="Breywboy" className="h-9 w-auto" />
        {getTitle() && pathname !== "/app" && (
          <h1 className="font-heading font-semibold text-lg text-primary tracking-tight truncate">
            {getTitle()}
          </h1>
        )}
      </div>
    </header>
  );
}
