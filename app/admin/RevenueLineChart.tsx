"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type RevenuePoint = {
  label: string
  revenue: number
  orders: number
}

export function RevenueLineChart({ data }: { data: RevenuePoint[] }) {
  const hasRevenue = data.some((point) => point.revenue > 0 || point.orders > 0)

  return (
    <div className="h-[320px] w-full">
      {hasRevenue ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
              stroke="var(--muted-foreground)"
              tickFormatter={(value) => `RM${value}`}
            />
            <Tooltip
              cursor={{ stroke: "var(--primary)", strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null

                const revenue = payload.find((item) => item.dataKey === "revenue")?.value
                const orders = payload.find((item) => item.dataKey === "orders")?.value

                return (
                  <div className="rounded-xl border bg-white p-3 shadow-md">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="font-mono text-sm font-bold text-primary">RM{Number(revenue || 0).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{Number(orders || 0)} orders</p>
                  </div>
                )
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-1)"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="var(--chart-3)"
              strokeWidth={2}
              dot={false}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-full items-center justify-center rounded-xl border border-dashed bg-secondary/30">
          <p className="text-sm text-muted-foreground">No revenue data yet.</p>
        </div>
      )}
    </div>
  )
}
