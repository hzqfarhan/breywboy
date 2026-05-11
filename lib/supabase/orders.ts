import { supabase } from './client'
import { addUserPoints, getUserById } from './users'
import { getProductById } from './menu'

// ─── Order Queries ────────────────────────────────────────────────────────

/** Get all orders for a user */
export async function getUserOrders(userId: string) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('Order')
    .select('*, items:OrderItem(*)')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })

  if (error) console.error('[orders] getUserOrders:', error.message)
  return data || []
}

/** Get the latest active order for a user */
export async function getActiveOrder(userId: string) {
  if (!userId) return null
  const { data, error } = await supabase
    .from('Order')
    .select('*')
    .eq('userId', userId)
    .in('status', ['NEW', 'PREPARING', 'READY'])
    .order('createdAt', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[orders] getActiveOrder:', error.message)
  }
  return data
}

/** Get a single order with its items */
export async function getOrderById(orderId: string) {
  if (!orderId) return null
  const { data, error } = await supabase
    .from('Order')
    .select('*, items:OrderItem(*)')
    .eq('id', orderId)
    .single()

  if (error) console.error('[orders] getOrderById:', error.message)
  return data
}

/** Get all orders for admin */
export async function getAllOrders() {
  const { data, error } = await supabase
    .from('Order')
    .select('*, user:User(name, phone), items:OrderItem(*)')
    .order('createdAt', { ascending: true })

  if (error) console.error('[orders] getAllOrders:', error.message)
  return data || []
}

/** Update an order's status */
export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('Order')
    .update({ status })
    .eq('id', orderId)

  if (error) console.error('[orders] updateOrderStatus:', error.message)
  return !error
}

/** Create a new order from cart (server-side validated) */
export async function createOrder(
  userId: string,
  cartItems: any[],
  paymentMethod: string,
  pickupTime: string
) {
  let subtotal = 0
  const orderItemsData = []

  for (const item of cartItems) {
    const product = await getProductById(item.productId)
    if (!product) throw new Error(`Product not found: ${item.productId}`)

    let unitPrice = product.basePrice || 0

    if (product.hasTemperatureOption && item.customizations?.temperature) {
      const temp = item.customizations.temperature
      if (temp === 'Hot' && product.allowHot && product.hotPrice != null) {
        unitPrice = product.hotPrice
      } else if (temp === 'Iced' && product.allowIced && product.icedPrice != null) {
        unitPrice = product.icedPrice
      } else {
        throw new Error(`Invalid temperature option for ${product.name}`)
      }
    }

    if (item.customizations?.addOns?.length > 0) {
      for (const addon of item.customizations.addOns) {
        const { data: addonDb } = await supabase
          .from('AddOn')
          .select('*')
          .eq('id', addon.id)
          .single()
        if (!addonDb) throw new Error(`Add-on not found: ${addon.id}`)
        unitPrice += addonDb.price
      }
    }

    const itemTotal = unitPrice * item.quantity
    subtotal += itemTotal

    orderItemsData.push({
      productId: product.id,
      productNameSnapshot: product.name,
      unitPrice,
      quantity: item.quantity,
      total: itemTotal,
      customizations: JSON.stringify(item.customizations),
    })
  }

  const orderNumber = `BB-${Math.floor(1000 + Math.random() * 9000)}`
  const pickupDate =
    pickupTime === 'ASAP'
      ? new Date(Date.now() + 15 * 60000).toISOString()
      : new Date(Date.now() + 60 * 60000).toISOString()

  const { data: order, error: orderError } = await supabase
    .from('Order')
    .insert({
      userId,
      orderNumber,
      subtotal,
      total: subtotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'PAID' : 'PENDING',
      pickupTime: pickupDate,
      status: 'NEW',
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  const { error: itemsError } = await supabase
    .from('OrderItem')
    .insert(orderItemsData.map((item) => ({ ...item, orderId: order.id })))

  if (itemsError) throw new Error(itemsError.message)

  // Award loyalty points (1 point per RM1)
  await addUserPoints(userId, Math.floor(subtotal))

  return order
}
