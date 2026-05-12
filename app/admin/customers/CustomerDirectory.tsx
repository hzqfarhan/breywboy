"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserRound } from "lucide-react"

type Customer = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  avatarUrl: string | null
  favouriteDrink: string | null
  points: number | null
  createdAt: string | null
}

export function CustomerDirectory({ customers }: { customers: Customer[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell className="font-mono text-sm">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar customer={customer} />
                    <span className="font-medium">{customer.name || "No nickname"}</span>
                  </div>
                </TableCell>
                <TableCell>{customer.phone || "-"}</TableCell>
                <TableCell>{customer.email || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No registered customers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Customer Details</DialogTitle>
              <DialogDescription>Full registered customer information.</DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-4 rounded-xl bg-secondary p-4">
              <Avatar customer={selectedCustomer} size="lg" />
              <div>
                <p className="font-heading text-xl font-bold text-primary">{selectedCustomer.name || "No nickname"}</p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email || "No email"}</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm">
              <Detail label="Customer ID" value={selectedCustomer.id} />
              <Detail label="Phone number" value={selectedCustomer.phone || "-"} />
              <Detail label="Email" value={selectedCustomer.email || "-"} />
              <Detail label="Nickname" value={selectedCustomer.name || "-"} />
              <Detail label="Favourite drink" value={selectedCustomer.favouriteDrink || "-"} />
              <Detail label="Points" value={`${selectedCustomer.points || 0}`} />
              <Detail label="Registered" value={selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" }) : "-"} />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

function Avatar({ customer, size = "md" }: { customer: Customer, size?: "md" | "lg" }) {
  const className = size === "lg" ? "h-16 w-16" : "h-10 w-10"

  return (
    <div className={`${className} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary`}>
      {customer.avatarUrl ? (
        <img src={customer.avatarUrl} alt={customer.name || "Customer"} className="h-full w-full object-cover" />
      ) : (
        <UserRound className={size === "lg" ? "h-8 w-8" : "h-5 w-5"} />
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-64 text-right font-medium break-words">{value}</span>
    </div>
  )
}
