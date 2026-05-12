import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import CredentialsProvider from "next-auth/providers/credentials"

// Hardcoded demo accounts — always work, no DB required
const DEMO_USERS = [
  {
    id: "demo-customer-001",
    email: "customer@breywboy.demo",
    password: "customer123",
    name: "Demo Customer",
    role: "CUSTOMER",
  },
  {
    id: "demo-admin-001",
    email: "admin@breywboy.demo",
    password: "admin123",
    name: "Demo Admin",
    role: "ADMIN",
  },
]

const authResult = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email) return null

        const email = credentials.email as string
        const password = credentials.password as string

        // 1. Check hardcoded demo accounts first (always works)
        const isDemoEmail = email.endsWith("@breywboy.demo")
        const demoUser = DEMO_USERS.find((u) => u.email === email)

        if (isDemoEmail && demoUser) {
          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.name,
            role: demoUser.role,
          }
        }

        // 2. Real user check (requires password)
        if (!password) return null

        // 2. Fall through to Supabase for real users
        try {
          const { supabase } = await import("@/lib/supabase")
          const { data: user, error } = await supabase
            .from("User")
            .select("*")
            .eq("email", email)
            .single()

          if (error || !user || !user.passwordHash) return null
          if (user.passwordHash !== password) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch {
          // Supabase unavailable or misconfigured
          return null
        }
      },
    }),
  ],
})

export const { handlers, auth, signIn, signOut } = authResult
export const { GET, POST } = handlers
