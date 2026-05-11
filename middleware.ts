import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

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
    if (nextUrl.pathname.startsWith("/admin") && req.auth?.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/app", nextUrl))
    }
    if (nextUrl.pathname.startsWith("/app") && req.auth?.user?.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/admin", nextUrl))
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
