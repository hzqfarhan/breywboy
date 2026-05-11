"use client"

import { useState } from "react"
import { toggleProductAvailability } from "./actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export function MenuClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)

  const handleToggle = async (id: string, current: boolean) => {
    // Optimistic update
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !current } : p))
    try {
      await toggleProductAvailability(id, !current)
    } catch (e) {
      // Revert on error
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: current } : p))
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                {product.name}
                {product.isPopular && <span className="ml-2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">POPULAR</span>}
              </TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell className="font-mono">
                {product.hasTemperatureOption ? (
                  <div className="text-xs">
                    {product.allowHot && `Hot: RM${product.hotPrice?.toFixed(2)} `}
                    {product.allowIced && `Iced: RM${product.icedPrice?.toFixed(2)}`}
                  </div>
                ) : (
                  `RM${product.basePrice?.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.isAvailable ? 'bg-success/20 text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {product.isAvailable ? 'Available' : 'Sold Out'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleToggle(product.id, product.isAvailable)}
                >
                  Mark {product.isAvailable ? 'Sold Out' : 'Available'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
