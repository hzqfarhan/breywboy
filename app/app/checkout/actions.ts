"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function createOrder(cartItems: any[], paymentMethod: string, pickupTime: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Strict server-side recalculation
  let subtotal = 0;
  const orderItemsData = [];

  for (const item of cartItems) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) throw new Error(`Product not found: ${item.productId}`);

    let unitPrice = product.basePrice || 0;
    
    // Validate temperature pricing
    if (product.hasTemperatureOption && item.customizations.temperature) {
      if (item.customizations.temperature === 'Hot' && product.allowHot && product.hotPrice !== null) {
        unitPrice = product.hotPrice;
      } else if (item.customizations.temperature === 'Iced' && product.allowIced && product.icedPrice !== null) {
        unitPrice = product.icedPrice;
      } else {
        throw new Error(`Invalid temperature option for ${product.name}`);
      }
    }

    // Validate add-ons
    if (item.customizations.addOns && item.customizations.addOns.length > 0) {
      for (const addonClient of item.customizations.addOns) {
        const addonDb = await prisma.addOn.findUnique({ where: { id: addonClient.id } });
        if (!addonDb) throw new Error(`Add-on not found: ${addonClient.id}`);
        
        if (addonDb.name === 'Oat Milk' && !product.allowOatMilk) {
          throw new Error(`Oat Milk not allowed for ${product.name}`);
        }
        if (addonDb.name === 'Extra Shot' && !product.allowExtraShot) {
          throw new Error(`Extra Shot not allowed for ${product.name}`);
        }
        unitPrice += addonDb.price;
      }
    }

    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: product.id,
      productNameSnapshot: product.name,
      unitPrice,
      quantity: item.quantity,
      total: itemTotal,
      customizations: JSON.stringify(item.customizations)
    });
  }

  const orderNumber = `BB-${Math.floor(1000 + Math.random() * 9000)}`;

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      orderNumber,
      subtotal,
      total: subtotal, // Assuming 0 tax/discount for demo
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'PAID' : 'PENDING',
      pickupTime: pickupTime === 'ASAP' ? new Date(Date.now() + 15 * 60000) : new Date(Date.now() + 60 * 60000), // Mock 15 mins for ASAP
      status: 'NEW',
      items: {
        create: orderItemsData
      }
    }
  });

  // Give points
  await prisma.user.update({
    where: { id: session.user.id },
    data: { points: { increment: Math.floor(subtotal) } }
  });

  redirect(`/app/orders/${order.id}`);
}
