import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Breywboy database with ZUS-style real menu...')

  // Clear existing products and categories to ensure a clean slate for the real menu
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.addOn.deleteMany()

  // 1. Create Demo Users
  await prisma.user.upsert({
    where: { email: 'customer@breywboy.demo' },
    update: {},
    create: {
      email: 'customer@breywboy.demo',
      name: 'Customer Demo',
      passwordHash: 'customer123',
      role: 'CUSTOMER',
      points: 150,
      phone: '0123456789',
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@breywboy.demo' },
    update: {},
    create: {
      email: 'admin@breywboy.demo',
      name: 'Admin Demo',
      passwordHash: 'admin123',
      role: 'ADMIN',
    },
  })

  // 2. Create Categories
  const categoriesData = [
    { name: 'Coffee', slug: 'coffee', sortOrder: 1 },
    { name: 'Non Coffee', slug: 'non-coffee', sortOrder: 2 },
    { name: 'Matcha Series', slug: 'matcha-series', sortOrder: 3 },
    { name: 'Pasta', slug: 'pasta', sortOrder: 4 },
    { name: 'Snacks', slug: 'snacks', sortOrder: 5 },
    { name: 'Add-ons / Extras', slug: 'add-ons-extras', sortOrder: 6 },
  ]

  for (const cat of categoriesData) {
    await prisma.category.create({ data: cat })
  }

  // 3. Create AddOns
  await prisma.addOn.createMany({
    data: [
      { name: 'Oat Milk', price: 2.00 },
      { name: 'Extra Shot', price: 2.00 },
    ],
  })

  // 4. Create Products
  const coffeeCat = await prisma.category.findUnique({ where: { slug: 'coffee' } })
  const nonCoffeeCat = await prisma.category.findUnique({ where: { slug: 'non-coffee' } })
  const matchaCat = await prisma.category.findUnique({ where: { slug: 'matcha-series' } })
  const pastaCat = await prisma.category.findUnique({ where: { slug: 'pasta' } })
  const snacksCat = await prisma.category.findUnique({ where: { slug: 'snacks' } })

  if (!coffeeCat || !nonCoffeeCat || !matchaCat || !pastaCat || !snacksCat) {
    throw new Error('Categories missing')
  }

  const productsData = [
    // --- COFFEE ---
    { name: 'Latte', slug: 'latte', categoryId: coffeeCat.id, description: 'Classic espresso latte with smooth milk.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 10, allowOatMilk: true, allowExtraShot: true, isPopular: true },
    { name: 'Americano', slug: 'americano', categoryId: coffeeCat.id, description: 'Bold black coffee brewed with Brazil Cerrado beans.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 8, icedPrice: 10, allowOatMilk: true, allowExtraShot: true, isPopular: true },
    { name: 'Ruby Americano', slug: 'ruby-americano', categoryId: coffeeCat.id, description: 'Refreshing iced americano with ruby-style fruity notes.',
      hasTemperatureOption: true, allowHot: false, allowIced: true, hotPrice: null, icedPrice: 12, allowOatMilk: true, allowExtraShot: true },
    { name: 'Mocha', slug: 'mocha', categoryId: coffeeCat.id, description: 'Espresso, chocolate, and milk in a rich café favourite.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: true },
    { name: 'Spanish Latte', slug: 'spanish-latte', categoryId: coffeeCat.id, description: 'Creamy latte with a sweet Spanish-style finish.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: true },
    { name: 'Banana Latte', slug: 'banana-latte', categoryId: coffeeCat.id, description: 'Smooth latte with banana sweetness.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 12, allowOatMilk: true, allowExtraShot: true },
    { name: 'Caramel Latte', slug: 'caramel-latte', categoryId: coffeeCat.id, description: 'Latte with caramel sweetness.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: true },
    { name: 'Hazelnut Latte', slug: 'hazelnut-latte', categoryId: coffeeCat.id, description: 'Nutty hazelnut latte.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: true },
    { name: 'Vanilla Latte', slug: 'vanilla-latte', categoryId: coffeeCat.id, description: 'Smooth vanilla latte.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: true },
    { name: 'Strawberry Latte', slug: 'strawberry-latte', categoryId: coffeeCat.id, description: 'Latte with strawberry flavour.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 12, allowOatMilk: true, allowExtraShot: true },
    
    // --- NON COFFEE ---
    { name: 'Taro Latte', slug: 'taro-latte', categoryId: nonCoffeeCat.id, description: 'Creamy taro latte.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: false },
    { name: 'Chocolatte', slug: 'chocolatte', categoryId: nonCoffeeCat.id, description: 'Rich chocolate milk drink.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 10, allowOatMilk: true, allowExtraShot: false },
    { name: 'Chocolatte Strawberry', slug: 'chocolatte-strawberry', categoryId: nonCoffeeCat.id, description: 'Chocolate drink with strawberry flavour.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 9, icedPrice: 11, allowOatMilk: true, allowExtraShot: false },
    { name: 'Strawberry Milk', slug: 'strawberry-milk', categoryId: nonCoffeeCat.id, description: 'Cold strawberry milk.',
      hasTemperatureOption: true, allowHot: false, allowIced: true, hotPrice: null, icedPrice: 10, allowOatMilk: true, allowExtraShot: false },
    { name: 'Spritzer', slug: 'spritzer', categoryId: nonCoffeeCat.id, description: 'Bottled spritzer.',
      hasTemperatureOption: false, basePrice: 2, allowOatMilk: false, allowExtraShot: false },

    // --- MATCHA SERIES ---
    { name: 'Matcha Latte', slug: 'matcha-latte', categoryId: matchaCat.id, description: 'Smooth matcha latte.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 10, icedPrice: 12, allowOatMilk: true, allowExtraShot: false },
    { name: 'Strawberry Matcha Latte', slug: 'strawberry-matcha-latte', categoryId: matchaCat.id, description: 'Iced matcha latte with strawberry.',
      hasTemperatureOption: true, allowHot: false, allowIced: true, hotPrice: null, icedPrice: 13, allowOatMilk: true, allowExtraShot: false },
    { name: 'Caramel Matcha Latte', slug: 'caramel-matcha-latte', categoryId: matchaCat.id, description: 'Matcha latte with caramel sweetness.',
      hasTemperatureOption: true, allowHot: true, allowIced: true, hotPrice: 10, icedPrice: 12, allowOatMilk: true, allowExtraShot: false },
    { name: 'Taro Matcha Latte', slug: 'taro-matcha-latte', categoryId: matchaCat.id, description: 'Iced matcha with taro flavour.',
      hasTemperatureOption: true, allowHot: false, allowIced: true, hotPrice: null, icedPrice: 13, allowOatMilk: true, allowExtraShot: false },

    // --- PASTA ---
    { name: 'Chicken Aglio Olio', slug: 'chicken-aglio-olio', categoryId: pastaCat.id, description: 'Chicken aglio olio pasta.',
      hasTemperatureOption: false, basePrice: 13 },
    { name: 'Chicken Buttermilk', slug: 'chicken-buttermilk', categoryId: pastaCat.id, description: 'Creamy chicken buttermilk pasta.',
      hasTemperatureOption: false, basePrice: 14 },
    { name: 'Chicken Carbonara', slug: 'chicken-carbonara', categoryId: pastaCat.id, description: 'Creamy chicken carbonara pasta.',
      hasTemperatureOption: false, basePrice: 14 },
    { name: 'Chicken Creamy Tomyum', slug: 'chicken-creamy-tomyum', categoryId: pastaCat.id, description: 'Creamy tomyum pasta with chicken.',
      hasTemperatureOption: false, basePrice: 14 },

    // --- SNACKS ---
    { name: 'Fries', slug: 'fries', categoryId: snacksCat.id, description: 'Crispy fries.',
      hasTemperatureOption: false, basePrice: 6 },
    { name: 'Chicken Popcorn', slug: 'chicken-popcorn', categoryId: snacksCat.id, description: 'Bite-sized crispy chicken popcorn.',
      hasTemperatureOption: false, basePrice: 10 },
    { name: 'Curly Fries', slug: 'curly-fries', categoryId: snacksCat.id, description: 'Crispy curly fries.',
      hasTemperatureOption: false, basePrice: 8 },
    { name: 'Chicken Tempura 8pcs', slug: 'chicken-tempura-8pcs', categoryId: snacksCat.id, description: 'Chicken tempura, 8 pieces.',
      hasTemperatureOption: false, basePrice: 10 },
    { name: 'Steamed Toast with Kaya Butter', slug: 'steamed-toast-with-kaya-butter', categoryId: snacksCat.id, description: 'Steamed toast served with kaya butter.',
      hasTemperatureOption: false, basePrice: 3 },
  ]

  for (const prod of productsData) {
    await prisma.product.create({ data: prod })
  }

  console.log('Database seeded successfully with the real Breywboy menu.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
