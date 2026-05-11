import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_ROUTES = ["/", "/login", "/menu"]
const API_AUTH_PREFIX = "/api/auth"

async function getSessionFromCookie(req: NextRequest) {
  // NextAuth v5 JWT cookie name
  const cookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"

  const token = req.cookies.get(cookieName)?.value

  if (!token) return null

  const secret = process.env.AUTH_SECRET
  if (!secret) return null

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    )
    return payload as { role?: string; [key: string]: unknown }
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow NextAuth API routes through
  if (pathname.startsWith(API_AUTH_PREFIX)) {
    return NextResponse.next()
  }

  const session = await getSessionFromCookie(req)
  const isLoggedIn = !!session
  const userRole = session?.role as string | undefined

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  if (isLoggedIn) {
    // Logged-in users should not see /login — redirect them to their dashboard
    if (pathname === "/login") {
      const dest = userRole === "ADMIN" ? "/admin" : "/app"
      return NextResponse.redirect(new URL(dest, req.url))
    }

    // Role-based access control
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(
        new URL(userRole === "CUSTOMER" ? "/app" : "/", req.url)
      )
    }
    if (pathname.startsWith("/app") && userRole !== "CUSTOMER") {
      return NextResponse.redirect(
        new URL(userRole === "ADMIN" ? "/admin" : "/", req.url)
      )
    }

    return NextResponse.next()
  }

  // Not logged in — block protected routes
  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}
