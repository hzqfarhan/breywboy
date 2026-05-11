import { NextResponse } from "next/server"
import { upsertUser } from "@/lib/supabase/users"

// GET /api/seed — creates demo users in Supabase if they don't exist
// Visit this URL once after deploying to Vercel to set up demo accounts
export async function GET() {
  const demoUsers = [
    {
      id: "demo-customer-001",
      name: "Demo Customer",
      email: "customer@breywboy.demo",
      passwordHash: "customer123",
      role: "CUSTOMER",
      points: 150,
    },
    {
      id: "demo-admin-001",
      name: "Demo Admin",
      email: "admin@breywboy.demo",
      passwordHash: "admin123",
      role: "ADMIN",
      points: 0,
    },
  ]

  const results: Record<string, string> = {}

  for (const user of demoUsers) {
    const result = await upsertUser(user)
    results[user.email] = result.status
  }

  return NextResponse.json({ message: "Seed complete", results })
}
