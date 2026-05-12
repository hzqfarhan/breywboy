import { cn } from "@/lib/utils"

export function MetricCard({
  title,
  value,
  note,
  className,
}: {
  title: string
  value: string | number
  note?: string
  className?: string
}) {
  return (
    <div className={cn("rounded-lg border bg-white p-5", className)}>
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      <p className="mt-2 font-mono text-2xl font-bold text-primary">{value}</p>
      {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
    </div>
  )
}
