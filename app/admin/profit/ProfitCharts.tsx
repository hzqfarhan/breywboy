"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function SimpleBarChart({
  data,
  xKey,
  bars,
}: {
  data: Record<string, string | number>[]
  xKey: string
  bars: { key: string; name: string; color?: string }[]
}) {
  if (!data.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed bg-neutral-50 text-sm text-muted-foreground">
        No chart data yet.
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          {bars.map((bar, index) => (
            <Bar key={bar.key} dataKey={bar.key} name={bar.name} fill={bar.color || (index === 0 ? "#111111" : "#777777")} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
