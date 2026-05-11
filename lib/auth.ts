import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { supabase } from "@/lib/supabase"
import CredentialsProvider from "next-auth/providers/credentials"

const authResult = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data: user, error } = await supabase
          .from('User')
          .select('*')
          .eq('email', credentials.email as string)
          .single()

        if (error || !user || !user.passwordHash) return null

        // In a real app, use bcrypt.compare
        if (user.passwordHash !== credentials.password) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ]
})

export const { handlers, auth, signIn, signOut } = authResult
export const { GET, POST } = handlers
