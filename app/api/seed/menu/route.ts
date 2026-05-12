import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const products = [
    // Coffee
    {
      name: "Signature Americano",
      description: "Smooth and bold double shot of espresso with hot water.",
      categoryId: "cat-coffee",
      basePrice: 8.0,
      hotPrice: 8.0,
      icedPrice: 9.0,
      isPopular: true,
    },
    {
      name: "Breywboy Latte",
      description: "Velvety steamed milk over rich espresso.",
      categoryId: "cat-coffee",
      basePrice: 11.0,
      hotPrice: 11.0,
      icedPrice: 12.0,
      isPopular: true,
    },
    {
      name: "Spanish Latte",
      description: "Sweetened condensed milk mixed with our signature espresso.",
      categoryId: "cat-coffee",
      basePrice: 12.0,
      hotPrice: 12.0,
      icedPrice: 13.0,
    },
    // Matcha
    {
      name: "Uji Matcha Latte",
      description: "Premium Japanese green tea with creamy milk.",
      categoryId: "cat-matcha",
      basePrice: 13.0,
      hotPrice: 13.0,
      icedPrice: 14.0,
      isPopular: true,
    },
    {
      name: "Strawberry Matcha",
      description: "Fresh strawberry purée layered with premium matcha.",
      categoryId: "cat-matcha",
      basePrice: 15.0,
      icedPrice: 15.0,
      allowHot: false,
    },
    // Non-Coffee
    {
      name: "Dark Chocolate",
      description: "Rich, decadent cocoa for chocolate lovers.",
      categoryId: "cat-non-coffee",
      basePrice: 11.0,
      hotPrice: 11.0,
      icedPrice: 12.0,
    },
    // Refreshers
    {
      name: "Mango Passion Refresher",
      description: "Zesty mango and passion fruit sparkler.",
      categoryId: "cat-refreshers",
      basePrice: 10.0,
      icedPrice: 10.0,
      allowHot: false,
    }
  ]

  const { data, error } = await supabase.from("Product").upsert(
    products.map(p => ({
      ...p,
      isAvailable: true,
      hasTemperatureOption: p.hotPrice != null && p.icedPrice != null
    })),
    { onConflict: 'name' }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Menu seed complete", count: products.length })
}
