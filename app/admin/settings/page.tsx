import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminSettingsPage() { 
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold font-heading mb-4">Inventory Settings</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            ["Enable inventory tracking", "On"],
            ["Enable FIFO costing", "On"],
            ["Allow negative stock", "Off"],
            ["Low stock alerts", "On"],
            ["Expiry alert days", "7"],
            ["Default waste percentage", "0%"],
            ["Auto deduct stock when", "Order accepted"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm font-medium">{label}</span>
              <span className="font-mono text-sm font-bold">{value}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Edit these defaults in Supabase table InventorySetting for now.</p>
      </div>

      <div className="p-6 bg-white rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold font-heading mb-4 text-destructive">Danger Zone</h2>
        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button type="submit" variant="destructive" className="w-full md:w-auto h-12 rounded-xl font-bold shadow-sm bg-destructive/10 text-destructive hover:bg-destructive/20 border-none">
            <LogOut className="w-5 h-5 mr-2" />
            Log Out of Admin
          </Button>
        </form>
      </div>
    </div>
  ) 
}
