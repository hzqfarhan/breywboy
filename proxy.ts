import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role?.toString().toUpperCase()

  const isPublicRoute = ["/", "/login", "/menu"].includes(nextUrl.pathname)
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isAdmin = userRole === "ADMIN"
  const isCustomer = userRole === "CUSTOMER"

  if (isApiAuthRoute) return NextResponse.next()

  if (isLoggedIn) {
    if (nextUrl.pathname === "/login") {
      const dest = isAdmin ? "/admin" : isCustomer ? "/app" : "/"
      return NextResponse.redirect(new URL(dest, nextUrl))
    }

    if (nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL(isCustomer ? "/app" : "/", nextUrl))
    }

    if (nextUrl.pathname.startsWith("/app") && !isCustomer) {
      return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/", nextUrl))
    }

    return NextResponse.next()
  }

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
