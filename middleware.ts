import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as any)?.role

  const isPublicRoute = ["/", "/login", "/menu"].includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")

  if (isApiAuthRoute) return NextResponse.next()

  if (isLoggedIn) {
    if (nextUrl.pathname === "/login") {
      const dest = userRole === "ADMIN" ? "/admin" : "/app"
      return NextResponse.redirect(new URL(dest, nextUrl))
    }

    // Role-based access control
    const isAdmin = userRole?.toString().toUpperCase() === "ADMIN"
    const isCustomer = userRole?.toString().toUpperCase() === "CUSTOMER"

    if (nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/app", nextUrl))
    }
    if (nextUrl.pathname.startsWith("/app") && !isCustomer) {
      return NextResponse.redirect(new URL("/admin", nextUrl))
    }

    return NextResponse.next()
  }

  // Not logged in
  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
