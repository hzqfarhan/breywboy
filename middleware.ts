import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = ["/", "/login", "/menu"].includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  if (isLoggedIn) {
    if (nextUrl.pathname === "/login") {
      const redirectUrl = req.auth?.user?.role === "ADMIN" ? "/admin" : "/app"
      return NextResponse.redirect(new URL(redirectUrl, nextUrl))
    }

    // Role-based protection
    const userRole = req.auth?.user?.role
    const isAdminPath = nextUrl.pathname.startsWith("/admin")
    const isAppPath = nextUrl.pathname.startsWith("/app")

    if (isAdminPath && userRole !== "ADMIN") {
      // If they are a CUSTOMER, send to /app, otherwise send to landing
      const target = userRole === "CUSTOMER" ? "/app" : "/"
      return NextResponse.redirect(new URL(target, nextUrl))
    }
    if (isAppPath && userRole !== "CUSTOMER") {
      // If they are an ADMIN, send to /admin, otherwise send to landing
      const target = userRole === "ADMIN" ? "/admin" : "/"
      return NextResponse.redirect(new URL(target, nextUrl))
    }
    
    return NextResponse.next()
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
