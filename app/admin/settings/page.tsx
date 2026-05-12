import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminSettingsPage() { 
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold font-heading mb-2">Module Coming Soon</h2>
        <p className="text-muted-foreground">This admin module is under construction.</p>
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
