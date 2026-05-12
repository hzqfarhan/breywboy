import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "@/lib/supabase"

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email
        if (!email) return false

        try {
          // Check if user exists in our DB
          const { data: existingUser, error: fetchError } = await supabase
            .from("User")
            .select("*")
            .eq("email", email)
            .single()

          const adminEmail = "haziqfarhan174@gmail.com"
          const role = email === adminEmail ? "ADMIN" : "CUSTOMER"

          if (!existingUser) {
            // Create new user in Supabase
            const { error: insertError } = await supabase.from("User").insert({
              id: user.id,
              email: email,
              name: user.name,
              avatarUrl: user.image,
              role: role,
              points: 0
            })
            if (insertError) {
              console.error("[auth] Error creating OAuth user:", insertError.message)
              return true // Still allow sign in even if DB record fails (fallback to session)
            }
          } else {
            // Update existing user with Google info if needed (name/avatar)
            const { error: updateError } = await supabase
              .from("User")
              .update({ 
                name: existingUser.name || user.name,
                avatarUrl: existingUser.avatarUrl || user.image,
                role: existingUser.role === 'ADMIN' || role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER'
              })
              .eq("email", email)
            
            if (updateError) console.error("[auth] Error updating OAuth user:", updateError.message)
          }
          
          // Attach the role to the user object so it gets picked up by the JWT callback
          if (existingUser) {
            (user as any).role = existingUser.role
            (user as any).avatarUrl = existingUser.avatarUrl
          } else {
            (user as any).role = role
            (user as any).avatarUrl = user.image
          }
          
          return true
        } catch (error) {
          console.error("[auth] OAuth signIn error:", error)
          return true
        }
      }
      return true
    }
  }
})

export const { handlers, auth, signIn, signOut } = authResult
export const { GET, POST } = handlers
