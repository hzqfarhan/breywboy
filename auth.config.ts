import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  // AUTH_SECRET from Vercel env vars, with a fallback for demo deployments.
  // Set AUTH_SECRET in Vercel → Settings → Environment Variables for production security.
  secret: process.env.AUTH_SECRET || "breywboy-demo-secret-change-in-production",
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize() {
        // Overridden in lib/auth.ts
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = (user as any).image || (user as any).avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;

