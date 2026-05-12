-- 0. Drop existing tables to ensure a clean setup
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "AddOn" CASCADE;
DROP TABLE IF EXISTS "Reward" CASCADE;

-- 1. Create Tables

-- Users Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "passwordHash" TEXT,
  "role" TEXT DEFAULT 'CUSTOMER',
  "points" INTEGER DEFAULT 0,
  "phone" TEXT,
  "favouriteDrink" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "slug" TEXT, -- Added to match existing schema
  "sortOrder" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true
);

-- Products Table
CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "categoryId" TEXT REFERENCES "Category"("id") ON DELETE CASCADE,
  "isAvailable" BOOLEAN DEFAULT true,
  "isPopular" BOOLEAN DEFAULT false,
  "basePrice" DOUBLE PRECISION DEFAULT 0,
  "hotPrice" DOUBLE PRECISION,
  "icedPrice" DOUBLE PRECISION,
  "allowHot" BOOLEAN DEFAULT true,
  "allowIced" BOOLEAN DEFAULT true,
  "hasTemperatureOption" BOOLEAN DEFAULT true,
  "allowOatMilk" BOOLEAN DEFAULT true,
  "allowExtraShot" BOOLEAN DEFAULT true,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add-Ons Table
CREATE TABLE IF NOT EXISTS "AddOn" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION DEFAULT 0,
  "isAvailable" BOOLEAN DEFAULT true
);

-- Orders Table
CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "orderNumber" TEXT UNIQUE,
  "subtotal" DOUBLE PRECISION DEFAULT 0,
  "total" DOUBLE PRECISION DEFAULT 0,
  "paymentMethod" TEXT, -- 'Online', 'Counter'
  "paymentStatus" TEXT, -- 'PENDING', 'PAID'
  "pickupTime" TIMESTAMP WITH TIME ZONE,
  "status" TEXT DEFAULT 'NEW', -- 'NEW', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT REFERENCES "Order"("id") ON DELETE CASCADE,
  "productId" TEXT REFERENCES "Product"("id") ON DELETE SET NULL,
  "productNameSnapshot" TEXT,
  "unitPrice" DOUBLE PRECISION DEFAULT 0,
  "quantity" INTEGER DEFAULT 1,
  "total" DOUBLE PRECISION DEFAULT 0,
  "customizations" TEXT -- Stringified JSON
);

-- Rewards Table
CREATE TABLE IF NOT EXISTS "Reward" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "pointsRequired" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT true
);

-- 2. Insert Initial Data (Categories)
INSERT INTO "Category" ("id", "name", "slug", "sortOrder", "isActive") VALUES
('cat-coffee', 'Coffee', 'coffee', 1, true),
('cat-non-coffee', 'Non Coffee', 'non-coffee', 2, true),
('cat-matcha', 'Matcha Series', 'matcha', 3, true),
('cat-pasta', 'Pasta', 'pasta', 4, true),
('cat-snacks', 'Snacks', 'snacks', 5, true),
('cat-addons', 'Add-ons / Extras', 'addons', 6, true);

-- 3. Insert Initial Data (Add-Ons)
INSERT INTO "AddOn" ("id", "name", "price", "isAvailable") VALUES
('addon-oat-milk', 'Oat Milk', 2.0, true),
('addon-extra-shot', 'Extra Shot', 2.0, true);

-- 4. Insert Initial Data (Products)

-- Coffee
INSERT INTO "Product" ("id", "name", "description", "categoryId", "hotPrice", "icedPrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isPopular", "imageUrl") VALUES
('p-latte', 'Latte', 'Classic espresso latte with smooth milk.', 'cat-coffee', 9, 10, true, true, true, true, true, true, '/assets/menu/latte.png'),
('p-americano', 'Americano', 'Bold black coffee brewed with Brazil Cerrado beans.', 'cat-coffee', 8, 10, true, true, true, true, true, false, '/assets/menu/americano.png'),
('p-ruby-americano', 'Ruby Americano', 'Refreshing iced americano with ruby-style fruity notes.', 'cat-coffee', NULL, 12, true, false, true, true, true, false, '/assets/menu/ruby_americano.png'),
('p-mocha', 'Mocha', 'Espresso, chocolate, and milk in a rich café favourite.', 'cat-coffee', 9, 11, true, true, true, true, true, false, '/assets/menu/mocha.png'),
('p-spanish-latte', 'Spanish Latte', 'Creamy latte with a sweet Spanish-style finish.', 'cat-coffee', 9, 11, true, true, true, true, true, true, '/assets/menu/spanish_latte.png'),
('p-banana-latte', 'Banana Latte', 'Smooth latte with banana sweetness.', 'cat-coffee', 9, 12, true, true, true, true, true, false, '/assets/menu/banana_latte.png'),
('p-caramel-latte', 'Caramel Latte', 'Latte with caramel sweetness.', 'cat-coffee', 9, 11, true, true, true, true, true, false, '/assets/menu/caramel_latte.png'),
('p-hazelnut-latte', 'Hazelnut Latte', 'Nutty hazelnut latte.', 'cat-coffee', 9, 11, true, true, true, true, true, false, '/assets/menu/hazelnut_latte.png'),
('p-vanilla-latte', 'Vanilla Latte', 'Smooth vanilla latte.', 'cat-coffee', 9, 11, true, true, true, true, true, false, '/assets/menu/vanilla_latte.png'),
('p-strawberry-latte', 'Strawberry Latte', 'Latte with strawberry flavour.', 'cat-coffee', 9, 12, true, true, true, true, true, false, '/assets/menu/strawberry_latte.png');

-- Non Coffee
INSERT INTO "Product" ("id", "name", "description", "categoryId", "hotPrice", "icedPrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isPopular", "imageUrl") VALUES
('p-taro-latte', 'Taro Latte', 'Creamy taro latte.', 'cat-non-coffee', 9, 11, true, true, true, true, false, false, '/assets/menu/taro_latte.png'),
('p-chocolatte', 'Chocolatte', 'Rich chocolate milk drink.', 'cat-non-coffee', 9, 10, true, true, true, true, false, true, '/assets/menu/chocolatte.png'),
('p-chocolatte-strawberry', 'Chocolatte Strawberry', 'Chocolate drink with strawberry flavour.', 'cat-non-coffee', 9, 11, true, true, true, true, false, false, '/assets/menu/chocolatte_strawberry.png'),
('p-strawberry-milk', 'Strawberry Milk', 'Cold strawberry milk.', 'cat-non-coffee', NULL, 10, true, false, true, true, false, false, '/assets/menu/strawberry_milk.png');

INSERT INTO "Product" ("id", "name", "description", "categoryId", "basePrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isPopular") VALUES
('p-spritzer', 'Spritzer', 'Bottled spritzer.', 'cat-non-coffee', 2, false, false, false, false, false, false);

-- Matcha Series
INSERT INTO "Product" ("id", "name", "description", "categoryId", "hotPrice", "icedPrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isPopular", "imageUrl") VALUES
('p-matcha-latte', 'Matcha Latte', 'Smooth matcha latte.', 'cat-matcha', 10, 12, true, true, true, true, false, true, '/assets/menu/matcha_latte.png'),
('p-strawberry-matcha', 'Strawberry Matcha Latte', 'Iced matcha latte with strawberry.', 'cat-matcha', NULL, 13, true, false, true, true, false, false, '/assets/menu/strawberry_matcha_latte.png'),
('p-caramel-matcha', 'Caramel Matcha Latte', 'Matcha latte with caramel sweetness.', 'cat-matcha', 10, 12, true, true, true, true, false, false, NULL),
('p-taro-matcha', 'Taro Matcha Latte', 'Iced matcha with taro flavour.', 'cat-matcha', NULL, 13, true, false, true, true, false, false, NULL);

-- Pasta
INSERT INTO "Product" ("id", "name", "description", "categoryId", "basePrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isPopular", "imageUrl") VALUES
('p-aglio-olio', 'Chicken Aglio Olio', 'Chicken aglio olio pasta.', 'cat-pasta', 13, false, false, false, false, false, true, '/assets/menu/chicken_aglio_olio.png'),
('p-buttermilk', 'Chicken Buttermilk', 'Creamy chicken buttermilk pasta.', 'cat-pasta', 14, false, false, false, false, false, false, NULL),
('p-carbonara', 'Chicken Carbonara', 'Creamy chicken carbonara pasta.', 'cat-pasta', 14, false, false, false, false, false, false, NULL),
('p-tomyum', 'Chicken Creamy Tomyum', 'Creamy tomyum pasta with chicken.', 'cat-pasta', 14, false, false, false, false, false, false, NULL);

-- Snacks
INSERT INTO "Product" ("id", "name", "description", "categoryId", "basePrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isPopular") VALUES
('p-fries', 'Fries', 'Crispy fries.', 'cat-snacks', 6, false, false, false, false, false, false),
('p-popcorn', 'Chicken Popcorn', 'Bite-sized crispy chicken popcorn.', 'cat-snacks', 10, false, false, false, false, false, false),
('p-curly-fries', 'Curly Fries', 'Crispy curly fries.', 'cat-snacks', 8, false, false, false, false, false, false),
('p-tempura', 'Chicken Tempura 8pcs', 'Chicken tempura, 8 pieces.', 'cat-snacks', 10, false, false, false, false, false, false),
('p-toast', 'Steamed Toast with Kaya Butter', 'Steamed toast served with kaya butter.', 'cat-snacks', 3, false, false, false, false, false, false);

-- 5. Enable RLS (Optional - depending on if you use Service Role or Anon)
-- For a simple demo, you can leave RLS disabled or set it to allow all.
-- ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access" ON "User" FOR ALL USING (true);
-- (Repeat for other tables)
