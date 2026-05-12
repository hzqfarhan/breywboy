"use client"

import { useState } from "react"
import { User as UserIcon, Mail, Phone, Settings, Heart, ChevronRight } from "lucide-react"
import { updateProfileDetails } from "@/app/app/profile/actions"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export function ProfileEditor({ user }: { user: any }) {
  const [editingField, setEditingField] = useState<'name' | 'phone' | 'favouriteDrink' | null>(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    favouriteDrink: user?.favouriteDrink || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = async () => {
    setIsSubmitting(true)
    const result = await updateProfileDetails(formData)
    setIsSubmitting(false)
    
    if (result.success) {
      toast.success("Profile updated!")
      setEditingField(null)
    } else {
      toast.error(result.error || "Failed to update profile")
    }
  }

  const handleRowClick = (field: 'name' | 'phone' | 'favouriteDrink' | 'email') => {
    if (field === 'email') {
      toast.info("Email address cannot be changed currently.")
      return
    }
    setEditingField(field)
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      favouriteDrink: user?.favouriteDrink || ''
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <ProfileRow icon={<UserIcon />} label="Personal Details" value={user?.name || ''} onClick={() => handleRowClick('name')} hasArrow />
        <ProfileRow icon={<Mail />} label="Email Address" value="yunn@seladevs.my" onClick={() => handleRowClick('email')} />
        <ProfileRow icon={<Phone />} label="Phone Number" value={user?.phone || 'Not provided'} onClick={() => handleRowClick('phone')} hasArrow />
        <ProfileRow icon={<Heart className="text-destructive" />} label="Favourite Drink" value={user?.favouriteDrink || 'Not set'} onClick={() => handleRowClick('favouriteDrink')} hasArrow />
        <ProfileRow icon={<Settings />} label="Settings" hasArrow onClick={() => toast.info("Settings coming soon")} />
      </div>

      <Drawer open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DrawerContent className="bg-background">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>
                Edit {editingField === 'name' ? 'Personal Details' : editingField === 'phone' ? 'Phone Number' : 'Favourite Drink'}
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              {editingField === 'name' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="E.g. Haziq Farhan"
                    className="h-12 bg-secondary"
                  />
                </div>
              )}
              {editingField === 'phone' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="E.g. +60123456789"
                    className="h-12 bg-secondary"
                  />
                </div>
              )}
              {editingField === 'favouriteDrink' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Favourite Drink</label>
                  <Input 
                    value={formData.favouriteDrink} 
                    onChange={e => setFormData({ ...formData, favouriteDrink: e.target.value })} 
                    placeholder="E.g. Iced Spanish Latte"
                    className="h-12 bg-secondary"
                  />
                </div>
              )}
            </div>
            <DrawerFooter className="pt-2">
              <Button onClick={handleSave} disabled={isSubmitting} className="w-full h-12 rounded-xl text-md">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

function ProfileRow({ icon, label, value, hasArrow = false, onClick }: { icon: React.ReactNode, label: string, value?: string, hasArrow?: boolean, onClick?: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-secondary/20 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground w-5 h-5 [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-muted-foreground max-w-[150px] truncate">{value}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  )
}
