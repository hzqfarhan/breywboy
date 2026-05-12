You are editing my existing Breywboy café ordering app.

I already have a Next.js PWA ordering system with customer and admin roles. Do not rebuild from zero unless necessary. Update the current app with the real Breywboy menu from the attached menu images and redesign the UI to match Breywboy’s real black-and-white brand direction.

IMPORTANT DESIGN DIRECTION

Breywboy’s real menu design is mainly:
- White background
- Black typography
- Minimal layout
- Bold café-menu style
- Simple, clean, high contrast
- Playful but not childish
- Modern local café feel

Update the UI color palette to be mainly black and white.

Use this new color system:

Primary background:
- White: #FFFFFF

Secondary background:
- Soft white: #FAFAF7

Card background:
- White: #FFFFFF

Primary text:
- Black: #050505

Secondary text:
- Dark grey: #3A3A3A

Muted text:
- Medium grey: #777777

Borders:
- Light grey: #E8E8E3

Primary button:
- Black background #050505
- White text #FFFFFF

Secondary button:
- White background
- Black text
- Black border

Accent:
- Use black only as main accent
- Use very subtle grey for inactive states
- Avoid brown, caramel, cream, gold, and matcha-heavy branding from the previous version

The app should look mostly white with bold black details.

ZUS-STYLE APP FEEL WITHOUT COPYING

Make the app feel closer to the convenience and polish of the ZUS Coffee app, but do not copy ZUS branding, exact layout, logo, icons, proprietary UI, assets, wording, or visual identity.

Use only general modern coffee-ordering app patterns:
- Clean mobile-first layout
- Easy category switching
- Sticky cart button
- Bottom navigation
- Fast add-to-cart flow
- Product cards that are easy to scan
- Minimal checkout
- Clear order tracking
- Rewards/voucher section
- Polished admin dashboard

The result should feel like:
“a clean black-and-white Breywboy ordering app with the smoothness of a modern coffee app.”

TYPOGRAPHY

Use next/font/google.

Update fonts to better match Breywboy’s real menu vibe.

Recommended:
- Headings / brand display: Bebas Neue, Archivo Black, or Bungee
- Body: Inter or Plus Jakarta Sans
- Prices / numbers: Space Grotesk or Inter

Typography rules:
- Big page headings should be bold, uppercase, black
- Category headings should feel like the printed Breywboy menu
- Product names should be uppercase or strong title case
- Prices should be very clear
- Keep body text clean and readable

MENU UPDATE

Replace the current fake/placeholder menu with this real Breywboy menu.

The menu has different pricing types:
1. Hot/Ice products with separate hot and iced prices
2. Ice-only products where hot price is not available
3. Single-price food/snack products
4. Add-ons/extras

Update the database, seed data, menu UI, product detail modal, cart, checkout, and admin menu editor to support these pricing types.

Recommended product pricing structure:
- hotPrice: nullable number
- icedPrice: nullable number
- basePrice: nullable number
- hasTemperatureOption: boolean
- availableTemperatures: HOT, ICED
- categoryId
- isAvailable
- isPopular
- description

For products with “RM - / 12”, this means Hot is not available and Iced price is RM12.

For food/snacks, use basePrice only.

REAL BREYWBOY MENU DATA

Create these categories:

1. Coffee
2. Non Coffee
3. Matcha Series
4. Pasta
5. Snacks
6. Add-ons / Extras

CATEGORY: Coffee

Products:

Latte
- Hot: RM9
- Iced: RM10
- Description: Classic espresso latte with smooth milk.
- Temperature options: Hot, Iced

Americano
- Hot: RM8
- Iced: RM10
- Description: Bold black coffee brewed with Brazil Cerrado beans.
- Temperature options: Hot, Iced

Ruby Americano
- Hot: Not available
- Iced: RM12
- Description: Refreshing iced americano with ruby-style fruity notes.
- Temperature options: Iced only

Mocha
- Hot: RM9
- Iced: RM11
- Description: Espresso, chocolate, and milk in a rich café favourite.
- Temperature options: Hot, Iced

Spanish Latte
- Hot: RM9
- Iced: RM11
- Description: Creamy latte with a sweet Spanish-style finish.
- Temperature options: Hot, Iced

Banana Latte
- Hot: RM9
- Iced: RM12
- Description: Smooth latte with banana sweetness.
- Temperature options: Hot, Iced

Caramel Latte
- Hot: RM9
- Iced: RM11
- Description: Latte with caramel sweetness.
- Temperature options: Hot, Iced

Hazelnut Latte
- Hot: RM9
- Iced: RM11
- Description: Nutty hazelnut latte.
- Temperature options: Hot, Iced

Vanilla Latte
- Hot: RM9
- Iced: RM11
- Description: Smooth vanilla latte.
- Temperature options: Hot, Iced

Strawberry Latte
- Hot: RM9
- Iced: RM12
- Description: Latte with strawberry flavour.
- Temperature options: Hot, Iced

Coffee notes:
- Beans in the hopper: Brazil Cerrado
- Varietal: Mundo Novo
- Process: Natural

Show this coffee bean information somewhere in the Coffee category page or as a small info card.

CATEGORY: Non Coffee

Products:

Taro Latte
- Hot: RM9
- Iced: RM11
- Description: Creamy taro latte.
- Temperature options: Hot, Iced

Chocolatte
- Hot: RM9
- Iced: RM10
- Description: Rich chocolate milk drink.
- Temperature options: Hot, Iced

Chocolatte Strawberry
- Hot: RM9
- Iced: RM11
- Description: Chocolate drink with strawberry flavour.
- Temperature options: Hot, Iced

Strawberry Milk
- Hot: Not available
- Iced: RM10
- Description: Cold strawberry milk.
- Temperature options: Iced only

Spritzer
- Base price: RM2
- Description: Bottled spritzer.
- No temperature customization required

CATEGORY: Matcha Series

Products:

Matcha Latte
- Hot: RM10
- Iced: RM12
- Description: Smooth matcha latte.
- Temperature options: Hot, Iced

Strawberry Matcha Latte
- Hot: Not available
- Iced: RM13
- Description: Iced matcha latte with strawberry.
- Temperature options: Iced only

Caramel Matcha Latte
- Hot: RM10
- Iced: RM12
- Description: Matcha latte with caramel sweetness.
- Temperature options: Hot, Iced

Taro Matcha Latte
- Hot: Not available
- Iced: RM13
- Description: Iced matcha with taro flavour.
- Temperature options: Iced only

CATEGORY: Pasta

Products:

Chicken Aglio Olio
- Base price: RM13
- Description: Chicken aglio olio pasta.
- No temperature customization

Chicken Buttermilk
- Base price: RM14
- Description: Creamy chicken buttermilk pasta.
- No temperature customization

Chicken Carbonara
- Base price: RM14
- Description: Creamy chicken carbonara pasta.
- No temperature customization

Chicken Creamy Tomyum
- Base price: RM14
- Description: Creamy tomyum pasta with chicken.
- No temperature customization

CATEGORY: Snacks

Products:

Fries
- Base price: RM6
- Description: Crispy fries.
- No temperature customization

Chicken Popcorn
- Base price: RM10
- Description: Bite-sized crispy chicken popcorn.
- No temperature customization

Curly Fries
- Base price: RM8
- Description: Crispy curly fries.
- No temperature customization

Chicken Tempura 8pcs
- Base price: RM10
- Description: Chicken tempura, 8 pieces.
- No temperature customization

Steamed Toast with Kaya Butter
- Base price: RM3
- Description: Steamed toast served with kaya butter.
- No temperature customization

CATEGORY: Add-ons / Extras

Add-ons:

Oat Milk
- Price: RM2
- Applies to coffee, non-coffee, and matcha drinks

Extra Shot
- Price: RM2
- Applies to coffee drinks only

CUSTOMIZATION LOGIC

Update product customization rules.

For drinks with Hot/Iced pricing:
- Show temperature selector.
- If both hot and iced are available, user can choose Hot or Iced.
- If only iced is available, show Iced selected and disable Hot.
- Price should update based on selected temperature.

For food:
- Do not show temperature selector.
- Show quantity only.
- Allow special instructions.

For coffee drinks:
- Show add-ons:
  - Oat Milk +RM2
  - Extra Shot +RM2

For non-coffee and matcha drinks:
- Show add-ons:
  - Oat Milk +RM2

For food/snacks:
- Do not show drink add-ons by default.

Keep existing customization options only if they make sense. Remove unnecessary fake add-ons like boba, cream cheese foam, vanilla syrup, caramel syrup, etc., unless they are already part of the real Breywboy menu. The real add-ons from the menu are only:
- Oat Milk +RM2
- Extra Shot +RM2

MENU UI UPDATE

Update the menu page to look like a clean black-and-white mobile café app.

Menu page requirements:
- White background
- Big uppercase “MENU” heading
- Category tabs/chips in black and white
- Active category: black background, white text
- Inactive category: white background, black text, grey border
- Product cards should be clean white cards with black borders or very soft grey borders
- Product name should be bold
- Price should show clearly:
  - For Hot/Iced: “Hot RM9 · Iced RM10”
  - For iced-only: “Iced RM12”
  - For food: “RM14”
- Add button should be black with white text
- Sticky cart button should be black
- Keep layout very clean and spacious

Suggested mobile menu layout:
- Header: “BREYWBOY” small top label
- Large title: “MENU”
- Search bar
- Horizontal category chips
- Product list
- Sticky cart summary at bottom

Product card style:
- White card
- Thin black or grey border
- Rounded corners
- Product name
- Short description
- Price row
- Add button
- Optional small badge: “Iced Only”, “Hot/Iced”, or “Food”

PRODUCT DETAIL MODAL UPDATE

Update product detail modal:
- White modal
- Black text
- Strong uppercase product name
- Clear price
- Temperature selector in black/white pill style
- Quantity selector
- Add-ons section only when applicable
- Special instructions
- Add to cart button in black

Temperature buttons:
- Available active: black background, white text
- Available inactive: white background, black text, black border
- Disabled unavailable: light grey background, grey text

CART UPDATE

Cart should correctly store:
- productId
- product name
- selected temperature, if any
- selected add-ons
- quantity
- unit price
- item total
- notes

Cart item example:
Latte
Iced · Oat Milk · Extra Shot
RM14 x 1

Price calculation:
Latte iced RM10 + oat milk RM2 + extra shot RM2 = RM14

CHECKOUT UPDATE

Server-side checkout must recalculate prices using the database:
- Never trust client cart totals
- Validate selected temperature is available
- Validate selected add-ons are allowed
- Calculate final total correctly
- Save selected temperature and add-ons in OrderItem customizations JSON

ADMIN MENU UPDATE

Update admin menu management so admin can create/edit products with:
- Product name
- Category
- Description
- Base price
- Hot price
- Iced price
- Temperature availability
- Availability toggle
- Popular toggle
- Add-on eligibility
- Image/placeholder
- Sort order

Admin should be able to manage:
- Hot price
- Iced price
- Iced-only products
- Food products with single price

DATABASE UPDATE

Update Prisma schema if needed.

Suggested Product model fields:

Product:
- id
- name
- slug
- description
- categoryId
- basePrice Decimal? nullable
- hotPrice Decimal? nullable
- icedPrice Decimal? nullable
- hasTemperatureOption Boolean default false
- allowHot Boolean default false
- allowIced Boolean default false
- allowOatMilk Boolean default false
- allowExtraShot Boolean default false
- imageUrl String? nullable
- isAvailable Boolean default true
- isPopular Boolean default false
- sortOrder Int default 0
- createdAt
- updatedAt

OrderItem customizations should save:
- temperature
- addOns
- notes

SEED SCRIPT UPDATE

Update the Prisma seed script to remove old fake menu items and insert the real Breywboy menu above.

Important:
- Do not duplicate products if seed runs multiple times.
- Use upsert where possible.
- Preserve demo admin and demo customer accounts.
- Preserve existing demo login system.

DEMO LOGIN

Keep the existing demo login buttons:
- Login as Customer
- Login as Admin

Do not remove authentication, admin routes, customer routes, cart, checkout, order tracking, PWA, rewards, or admin dashboard.

UI REDESIGN DETAILS

Apply the black-and-white Breywboy theme across the whole app:

Landing page:
- Mostly white
- Big black “BREYWBOY” heading
- Large “Order Now” black button
- Minimal product/category preview
- No brown/caramel theme

Login page:
- White background
- Black Breywboy logo text
- Black demo buttons
- Clean card design
- Demo buttons must remain very obvious

Customer app:
- White app shell
- Black bottom nav icons/text when active
- Grey inactive nav
- Black sticky cart button
- Black order status accents

Admin dashboard:
- White background
- Black sidebar/header
- Clean statistic cards
- Thin grey borders
- Charts should use monochrome/grey palette where possible

Buttons:
- Primary: black
- Secondary: white with black border
- Destructive: black outline or muted red only when needed
- Success: use black/grey styling if possible, or subtle green only for ready/completed status

PWA UPDATE

Make sure PWA theme colors are updated:
- theme_color: #050505
- background_color: #FFFFFF
- app name: Breywboy Ordering
- short name: Breywboy

ORDERING FLOW MUST STILL WORK

After updates, the customer flow must work:

Browse menu
→ choose category
→ open product
→ select temperature if drink
→ select add-ons if allowed
→ add to cart
→ checkout
→ order created
→ customer can track order
→ admin can update order status

QUALITY CHECK

After implementing, verify:
- All real menu items appear
- Hot/iced prices are correct
- Iced-only products do not show Hot as selectable
- Food items do not show temperature options
- Coffee drinks allow oat milk and extra shot
- Non-coffee/matcha drinks allow oat milk only
- Cart totals are correct
- Checkout recalculates prices on server
- Admin can edit prices
- UI is mostly white with black typography
- No old brown/caramel theme remains
- App still works as PWA
- Demo login buttons still work

Do not copy ZUS Coffee exactly. Make the UX feel similarly smooth and convenient, but keep the visual identity original and clearly Breywboy black-and-white.