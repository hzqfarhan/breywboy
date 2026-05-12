This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:6123](http://localhost:6123) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Breywboy FIFO Inventory & Profit Tracking

Run `supabase_inventory_update.sql` in the Supabase SQL Editor after the base schema. The script adds admin-only raw materials, suppliers, purchases, stock batches, recipes, stock movements, order COGS, item COGS, inventory settings, and product cost snapshots.

The seeded data includes realistic Breywboy materials and demo batches, including `MILK-001` at RM0.007/ml and `MILK-002` at RM0.008/ml so margin changes are visible when FIFO moves into the newer milk batch.

Inventory is deducted when an admin accepts an order by moving it from `NEW` to `PREPARING`. The server reads active recipes, consumes the oldest active batch first, writes `StockMovement` audit rows, saves `OrderItemCost` and `OrderCost`, and updates material/batch stock. A unique `OrderCost.orderId` prevents double stock deduction.

Admin routes:

- `/admin/inventory`
- `/admin/inventory/materials`
- `/admin/inventory/batches`
- `/admin/inventory/purchases`
- `/admin/inventory/recipes`
- `/admin/inventory/adjustments`
- `/admin/profit`
- `/admin/profit/products`
- `/admin/profit/orders`
- `/admin/profit/reports`

Customer pages do not expose internal cost, COGS, supplier, or batch data. Products with insufficient recipe stock are shown as currently unavailable and server checkout validates availability again.

Default inventory settings are stored in `InventorySetting`: tracking on, FIFO on, negative stock off, low-stock alerts on, expiry alert days 7, default waste 0%, and auto deduction on accepted orders.

Migration note: this project uses Supabase runtime queries rather than Prisma, so the database migration deliverable is the Supabase SQL update script.
