import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const PUBLIC_ROUTES = ["/", "/login", "/menu"]
const API_AUTH_PREFIX = "/api/auth"
const API_PUBLIC_PREFIX = "/api/seed"

// NextAuth v5 (auth.js) cookie names
const SESSION_COOKIE_PROD = "__Secure-authjs.session-token"
const SESSION_COOKIE_DEV = "authjs.session-token"

async function getSession(req: NextRequest): Promise<{ role?: string } | null> {
  const isProd = process.env.NODE_ENV === "production"
  const cookieName = isProd ? SESSION_COOKIE_PROD : SESSION_COOKIE_DEV

  // Try production cookie first, then dev cookie (handles mixed environments)
  const token =
    req.cookies.get(SESSION_COOKIE_PROD)?.value ??
    req.cookies.get(SESSION_COOKIE_DEV)?.value

  if (!token) return null

  // Must match the secret used in auth.config.ts
  const secret =
    process.env.AUTH_SECRET || "breywboy-demo-secret-change-in-production"

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload as { role?: string }
  } catch {
    // Token is invalid/expired/stale — treat as logged out
    return null
  }
}

function clearSessionCookies(response: NextResponse) {
  // Clear both possible cookie names to handle stale cookies from any environment
  response.cookies.delete(SESSION_COOKIE_PROD)
  response.cookies.delete(SESSION_COOKIE_DEV)
  return response
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Always allow NextAuth API routes and public API routes through
  if (pathname.startsWith(API_AUTH_PREFIX) || pathname.startsWith(API_PUBLIC_PREFIX)) {
    return NextResponse.next()
  }

  // Check if a stale/unverifiable cookie exists (to clear it)
  const hasCookie =
    req.cookies.has(SESSION_COOKIE_PROD) || req.cookies.has(SESSION_COOKIE_DEV)

  const session = await getSession(req)
  const isLoggedIn = !!session
  const userRole = session?.role as string | undefined
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  // If cookie exists but couldn't be verified, clear it and redirect to login
  // This handles the stale-cookie redirect loop
  if (hasCookie && !isLoggedIn && !isPublicRoute) {
    const response = NextResponse.redirect(new URL("/login", req.url))
    clearSessionCookies(response)
    return response
  }

  if (hasCookie && !isLoggedIn && isPublicRoute) {
    // Cookie is stale but they're on a public page — clear cookie, let them through
    const response = NextResponse.next()
    clearSessionCookies(response)
    return response
  }

  if (isLoggedIn) {
    // Logged-in users should not see /login
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

  // Not logged in — redirect protected routes to login
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
