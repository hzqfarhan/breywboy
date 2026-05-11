import Link from "next/link";
import { Coffee } from "lucide-react";

import { auth } from "@/lib/auth";

export async function PublicNavbar() {
  const session = await auth();
  const orderHref = session ? "/app" : "/login";
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/assets/brey-this.png" alt="Breywboy" className="h-10 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <Link href={session ? "/app/menu" : "/menu"} className="text-sm font-medium hover:text-primary hidden sm:block">
            Menu
          </Link>
          <Link
            href={orderHref}
            className="inline-flex items-center justify-center rounded-full px-6 h-8 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
          >
            {session ? "Dashboard" : "Order Now"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
