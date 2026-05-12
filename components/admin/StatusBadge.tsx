import { cn } from "@/lib/utils"

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
        tone === "good" && "border-neutral-900 bg-neutral-900 text-white",
        tone === "warn" && "border-neutral-400 bg-neutral-100 text-neutral-900",
        tone === "bad" && "border-neutral-900 bg-white text-neutral-900",
        tone === "neutral" && "border-neutral-200 bg-white text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}
