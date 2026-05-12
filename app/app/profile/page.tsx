export const dynamic = "force-dynamic";
import { getUserById } from "@/lib/supabase/users"
import { auth, signOut } from "@/lib/auth"
import { CustomerTopBar } from "@/components/layout/CustomerTopBar"
import { ProfileEditor } from "@/components/profile/ProfileEditor"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  const user = await getUserById(session?.user?.id || '')

  const orderCount = user?.Order?.length || 0

  return (
    <div className="flex flex-col h-full bg-background min-h-screen">
      <CustomerTopBar title="Profile" />
      
      <div className="p-4 space-y-6 pb-20">
        
        {/* User Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 text-primary">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-heading font-bold mb-1">{user?.name}</h2>
          <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
          
          <div className="flex w-full gap-4 pt-4 border-t">
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Orders</p>
              <p className="font-bold font-mono text-lg">{orderCount}</p>
            </div>
            <div className="w-px bg-border"></div>
            <div className="flex-1 text-center">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Points</p>
              <p className="font-bold font-mono text-lg text-primary">{user?.points}</p>
            </div>
          </div>
        </div>

        <ProfileEditor user={user} />

        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button type="submit" variant="destructive" className="w-full h-14 rounded-xl text-lg font-bold shadow-sm mt-4 bg-destructive/10 text-destructive hover:bg-destructive/20 border-none">
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </form>

      </div>
    </div>
  )
}
