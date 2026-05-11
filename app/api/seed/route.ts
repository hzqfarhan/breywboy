import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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
    // Check if user already exists
    const { data: existing } = await supabase
      .from("User")
      .select("id")
      .eq("email", user.email)
      .single()

    if (existing) {
      results[user.email] = "already exists"
      continue
    }

    const { error } = await supabase.from("User").insert(user)

    if (error) {
      results[user.email] = `error: ${error.message}`
    } else {
      results[user.email] = "created"
    }
  }

  return NextResponse.json({
    message: "Seed complete",
    results,
  })
}
