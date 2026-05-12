import { auth } from "@/lib/auth"
import { getAllOrders } from "@/lib/supabase/orders"

export const dynamic = "force-dynamic"

const BOARD_STATUSES = new Set(["NEW", "PREPARING", "READY"])

export async function GET() {
  const session = await auth()
  const role = session?.user?.role?.toString().toUpperCase()

  if (role !== "ADMIN") {
    return Response.json({ message: "Forbidden" }, { status: 403 })
  }

  const orders = await getAllOrders()
  const boardOrders = orders.filter((order) => BOARD_STATUSES.has(order.status))

  return Response.json({ orders: boardOrders })
}
