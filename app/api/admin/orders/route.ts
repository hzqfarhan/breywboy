import { auth } from "@/lib/auth"
import { getAdminOrderBoardOrders } from "@/lib/supabase/orders"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  const role = session?.user?.role?.toString().toUpperCase()

  if (role !== "ADMIN") {
    return Response.json({ message: "Forbidden" }, { status: 403 })
  }

  const orders = await getAdminOrderBoardOrders()

  return Response.json({ orders })
}
