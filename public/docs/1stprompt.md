You are a world-class full-stack engineer, UI/UX designer, product strategist, and PWA architect.

Build a complete premium café ordering system for “Breywboy”, a local café brand in Parit Raja, Johor.

The system must feel like a modern mobile coffee ordering app: fast, beautiful, installable, easy to use, and production-ready. Do not copy any existing café app UI, branding, assets, database, menus, proprietary flows, or copyrighted material. Create an original Breywboy ordering system using realistic seed data.

TECH STACK

Use:
- Next.js latest stable version with App Router
- TypeScript
- Tailwind CSS
- PWA support
- Prisma ORM
- PostgreSQL
- NextAuth or secure custom authentication
- Zod for validation
- Zustand or React Context for cart state
- Server Actions or API Routes where suitable
- Framer Motion for animations
- Recharts for admin analytics
- shadcn/ui-style components, customized for the Breywboy brand
- next/font/google for typography

MAIN PRODUCT

Create a complete online ordering system with two roles:

1. Customer
2. Admin

The app must include a login page with two large demo login buttons:

- “Login as Customer”
- “Login as Admin”

Demo customer account:
email: customer@breywboy.demo
password: customer123

Demo admin account:
email: admin@breywboy.demo
password: admin123

When the customer demo button is clicked, log in automatically and redirect to the customer ordering app.

When the admin demo button is clicked, log in automatically and redirect to the admin dashboard.

BRAND STYLE

Create a warm, cozy, premium, student-friendly café vibe.

The design should feel:
- Modern
- Local
- Warm
- Minimal
- Coffee-focused
- Instagrammable
- Fast and mobile-native
- Premium but not too luxury

Use this color palette:

- Espresso Brown: #3A2416
- Latte Cream: #F6EBDD
- Caramel Gold: #C98A45
- Matcha Green: #7A8F55
- Charcoal Text: #1F1A17
- Soft Beige Background: #FBF6EF
- Success Green for ready orders
- Amber for preparing orders
- Muted red for cancelled orders

FONTS

Use fonts that fit a modern café brand.

Use next/font/google.

Recommended typography:
- Headings: Fraunces or Playfair Display
- Body: Plus Jakarta Sans or Inter
- Numbers/prices/dashboard stats: DM Sans or Inter

Typography direction:
- Headings should feel warm, expressive, and premium.
- Body text must be clean and readable.
- Buttons should feel bold and confident.
- Prices should be easy to scan.

PWA REQUIREMENTS

Make the app a real Progressive Web App.

Include:
- Web app manifest
- App name: Breywboy Ordering
- Short name: Breywboy
- Theme color: #3A2416
- Background color: #F6EBDD
- Installable mobile app behavior
- Offline fallback page
- Cached menu browsing
- Cached static assets
- App icons
- Mobile app shell layout
- Install app prompt when supported
- Responsive customer bottom navigation

Customer mobile bottom navigation:
- Home
- Menu
- Rewards
- Orders
- Profile

PUBLIC PAGES

Create these pages:

1. Landing Page

Route: /

Include:
- Breywboy hero section
- Warm café visual style
- Main CTA: “Order Now”
- Secondary CTA: “View Menu”
- Store location card: Parit Raja, Johor
- Highlights:
  - Skip the queue
  - Pickup ordering
  - Fresh coffee
  - Rewards
  - Student-friendly drinks
- Featured drinks section
- Why order with Breywboy section
- Footer

2. Login Page

Route: /login

Include:
- Email/password login form
- “Login as Customer” demo button
- “Login as Admin” demo button
- Warm café illustration or background pattern
- Demo mode badge
- Clean responsive layout

3. Public Menu Preview

Route: /menu

Include:
- Product categories
- Featured drinks
- Product cards
- CTA to login/order

CUSTOMER APP

Create protected customer routes:

- /app
- /app/menu
- /app/cart
- /app/checkout
- /app/orders
- /app/orders/[id]
- /app/rewards
- /app/profile

Customer dashboard route: /app

Include:
- Welcome message
- Active order card
- Rewards points card
- Favourite drinks
- Recent orders
- Reorder buttons
- “Popular today” section

Menu route: /app/menu

Include:
- Search bar
- Category chips
- Featured carousel
- Product grid
- Sticky cart button
- Floating mobile cart summary
- Filters:
  - Popular
  - Coffee
  - Non-coffee
  - Matcha
  - Snacks
- Product cards with:
  - Product image or original gradient placeholder
  - Name
  - Description
  - Price
  - Popular badge
  - Availability
  - Add button

Product Detail Modal

When clicking a product, open a beautiful product customization modal.

Include:
- Product image
- Product name
- Description
- Base price
- Temperature:
  - Hot
  - Iced
- Size:
  - Regular
  - Large
- Sweetness:
  - 0%
  - 25%
  - 50%
  - 75%
  - 100%
- Ice level:
  - No Ice
  - Less Ice
  - Normal Ice
  - Extra Ice
- Milk option:
  - Regular Milk
  - Fresh Milk
  - Oat Milk
  - No Milk
- Add-ons:
  - Extra Shot
  - Oat Milk
  - Vanilla Syrup
  - Caramel Syrup
  - Cream Cheese Foam
  - Boba
- Quantity selector
- Special instructions
- Final calculated price
- Add to cart button

Cart Page

Route: /app/cart

Include:
- Cart item list
- Edit customization
- Remove item
- Quantity update
- Subtotal
- Promo code input
- Rewards discount section
- Pickup time selector:
  - ASAP
  - Schedule pickup
- Order note
- Checkout button
- Empty cart state

Checkout Page

Route: /app/checkout

Include:
- Customer details
- Pickup method only for MVP
- Pickup time
- Payment method:
  - Pay at counter
  - Demo online payment
  - QR payment placeholder
- Order summary
- Promo discount
- Rewards discount
- Confirm order button

Order Confirmation

After checkout:
- Generate order number like BB-1001
- Show estimated pickup time
- Show status tracker:
  - Order placed
  - Preparing
  - Ready for pickup
  - Completed
- Show order summary
- Button: “View Order”
- Button: “Order Again”

Orders Page

Route: /app/orders

Include:
- Active orders
- Past orders
- Order status badges
- Reorder button
- Order detail page

Rewards Page

Route: /app/rewards

Include:
- Points balance
- Membership tier
- Progress to next reward
- Earn rule: 1 point per RM1
- Reward vouchers:
  - RM2 Off
  - Free Add-on
  - Free Regular Drink
- Membership tiers:
  - Newcomer
  - Regular
  - Breywboss

Profile Page

Route: /app/profile

Include:
- Name
- Email
- Phone
- Favourite drink
- Points
- Order count
- Logout button

ADMIN APP

Create protected admin routes:

- /admin
- /admin/orders
- /admin/menu
- /admin/categories
- /admin/promos
- /admin/rewards
- /admin/customers
- /admin/settings

Only ADMIN users can access these routes.

Admin Dashboard

Route: /admin

Include:
- Today’s sales
- Today’s orders
- Pending orders
- Preparing orders
- Ready orders
- Completed orders
- Average order value
- Top-selling item
- Revenue chart
- Orders by status chart
- Top products chart
- Recent order feed

Admin Order Management

Route: /admin/orders

Create a Kanban-style order board with columns:

- New
- Preparing
- Ready
- Completed
- Cancelled

Each order card should show:
- Order number
- Customer name
- Items count
- Total
- Pickup time
- Status
- Created time

Admin can:
- View order detail drawer
- Update order status
- Cancel order
- Print receipt
- Search by order number
- Search by customer
- Filter by date
- Filter by status

Admin Menu Management

Route: /admin/menu

Admin can:
- View all products
- Create product
- Edit product
- Delete product
- Toggle availability
- Toggle popular status
- Assign category
- Set price
- Set description
- Set image URL or placeholder
- Manage customization availability

Admin Category Management

Route: /admin/categories

Admin can:
- Create category
- Edit category
- Delete category
- Sort categories
- Toggle visibility

Admin Promo Management

Route: /admin/promos

Admin can create promo codes.

Promo fields:
- Code
- Discount type:
  - Percentage
  - Fixed amount
  - Free add-on
- Discount value
- Minimum spend
- Expiry date
- Usage limit
- Active/inactive status

Admin Rewards Management

Route: /admin/rewards

Admin can:
- Configure points earning rate
- Create reward item
- Edit reward item
- Delete reward item
- Set required points
- Toggle active status

Admin Customer Management

Route: /admin/customers

Show:
- Customer name
- Email
- Phone
- Total orders
- Total spent
- Points balance
- Last order date

Admin Settings

Route: /admin/settings

Include:
- Store name
- Store address
- Phone number
- Opening hours
- Average preparation time
- Pickup enabled toggle
- Service charge setting
- Tax setting
- PWA preview

DATABASE SCHEMA

Create Prisma models for:

User:
- id
- name
- email
- passwordHash
- role: CUSTOMER or ADMIN
- phone
- points
- createdAt
- updatedAt

Category:
- id
- name
- slug
- sortOrder
- isActive
- products

Product:
- id
- name
- slug
- description
- price
- categoryId
- imageUrl
- isAvailable
- isPopular
- createdAt
- updatedAt

AddOn:
- id
- name
- price
- isAvailable
- createdAt
- updatedAt

Order:
- id
- orderNumber
- userId
- status: NEW, PREPARING, READY, COMPLETED, CANCELLED
- subtotal
- discount
- total
- paymentMethod
- paymentStatus
- pickupTime
- notes
- createdAt
- updatedAt

OrderItem:
- id
- orderId
- productId
- productNameSnapshot
- unitPrice
- quantity
- total
- customizations JSON

Promo:
- id
- code
- type
- value
- minSpend
- expiresAt
- usageLimit
- usedCount
- isActive
- createdAt
- updatedAt

Reward:
- id
- name
- description
- pointsRequired
- rewardType
- value
- isActive
- createdAt
- updatedAt

StoreSetting:
- id
- storeName
- address
- phone
- openingHours
- averagePreparationMinutes
- pickupEnabled
- serviceChargeRate
- taxRate

SEED DATA

Seed the database with realistic Breywboy demo data.

Categories:
- Signature Coffee
- Iced Coffee
- Matcha
- Chocolate
- Tea
- Frappe
- Pastries / Snacks
- Add-ons

Products:

Signature Coffee:
- Breywboy Signature Latte — RM9.90
- Kampung Gula Melaka Latte — RM11.90
- Brown Sugar Iced Coffee — RM10.90
- Classic Americano — RM7.90
- Spanish Latte — RM11.90

Matcha:
- Ceremonial Matcha Latte — RM12.90
- Strawberry Matcha Cloud — RM14.90
- Matcha Espresso Fusion — RM13.90

Chocolate:
- Belgian Chocolate — RM10.90
- Iced Choco Cloud — RM12.90

Tea:
- Lemon Tea Cooler — RM7.90
- Peach Tea Sparkle — RM8.90

Frappe:
- Caramel Coffee Frappe — RM13.90
- Mocha Frappe — RM13.90
- Matcha Cream Frappe — RM14.90

Pastries / Snacks:
- Butter Croissant — RM6.90
- Loaded Fries — RM9.90
- Burnt Cheesecake Slice — RM12.90

Add-ons:
- Extra Shot — RM2.50
- Oat Milk — RM3.00
- Vanilla Syrup — RM1.50
- Caramel Syrup — RM1.50
- Cream Cheese Foam — RM3.00
- Boba — RM2.00

Promos:
- BREYW10: 10% off minimum RM20
- STUDENT5: RM5 off minimum RM25
- FREEADDON: Free add-on minimum RM18

Rewards:
- RM2 Off Voucher — 80 points
- Free Add-on — 100 points
- Free Regular Drink — 250 points

ORDER LOGIC

When a customer places an order:
- Validate cart on the server
- Recalculate price on the server
- Apply promo safely
- Deduct/redeem reward points if used
- Create order with status NEW
- Generate order number like BB-1001
- Show estimated pickup time
- Add points after successful order
- Show order tracker

Admin can move order status:
- NEW → PREPARING
- PREPARING → READY
- READY → COMPLETED
- Any active order → CANCELLED

UI/UX REQUIREMENTS

The app must feel like a premium mobile app, not a basic website.

Include:
- Mobile-first responsive design
- Smooth page transitions
- Add-to-cart animation
- Toast notifications
- Skeleton loading states
- Empty states
- Error states
- Confirmation modals
- Sticky cart button
- Floating cart summary
- Large touch targets
- Accessible contrast
- Keyboard-accessible forms
- Proper aria labels
- Clean spacing
- Rounded 2xl cards
- Soft shadows
- Warm café background
- Subtle grain or noise texture
- Beautiful badges
- Premium product cards
- Smooth admin dashboard layout

COPYWRITING STYLE

Use friendly café-style microcopy.

Examples:
- “Skip the queue, sip sooner.”
- “Freshly brewed for pickup.”
- “Your coffee is almost ready.”
- “Made warm, served fast.”
- “Welcome back, Breywboss.”
- “Today’s crowd favourite.”
- “Ready in 10–15 min.”
- “Your usual is waiting.”

Do not copy existing brand taglines.

SECURITY REQUIREMENTS

Implement:
- Secure password hashing
- Role-based route protection
- Server-side checkout validation
- Server-side price calculation
- Zod validation
- Environment variables
- Protected API routes/server actions
- No trusting client cart totals
- Safe error handling
- Auth redirects
- Admin-only access checks

PROJECT STRUCTURE

Create a clean project structure similar to:

/app
  /(public)
  /login
  /menu
  /app
  /admin
/components
  /ui
  /customer
  /admin
  /layout
/lib
  auth.ts
  db.ts
  validations.ts
  cart.ts
  pricing.ts
/prisma
  schema.prisma
  seed.ts
/public
  manifest.json
  icons
/styles
/types

DELIVERABLES

Generate the full working codebase.

Include:
- Complete Next.js project
- Prisma schema
- Seed script
- Authentication
- Customer ordering flow
- Admin dashboard
- Admin CRUD pages
- PWA setup
- Manifest file
- Offline fallback
- Demo login buttons
- README.md
- .env.example
- Setup instructions
- Demo credentials
- Clean reusable components
- Responsive polished UI

IMPORTANT QUALITY BAR

This must look and feel like a real product ready for a café owner to demo.

Do not make a boring CRUD app.

Make it visually impressive, mobile-first, warm, fast, and polished.

The login page must clearly show:
- Login as Customer
- Login as Admin

The customer flow must allow:
Browse menu → customize item → add to cart → checkout → track order.

The admin flow must allow:
View dashboard → manage orders → update status → manage menu → manage promos → manage rewards.

Before generating the code, first output:
1. Sitemap
2. Database schema plan
3. Component architecture
4. Customer user flow
5. Admin user flow
6. UI theme tokens

Then generate the complete implementation.