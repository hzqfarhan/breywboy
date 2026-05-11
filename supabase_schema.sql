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
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "sortOrder" INTEGER DEFAULT 0
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
INSERT INTO "Category" ("id", "name", "sortOrder") VALUES
('cat-coffee', 'Coffee', 1),
('cat-non-coffee', 'Non-Coffee', 2),
('cat-matcha', 'Matcha', 3),
('cat-tea', 'Tea', 4),
('cat-refreshers', 'Refreshers', 5);

-- 3. Insert Initial Data (Add-Ons)
INSERT INTO "AddOn" ("name", "price", "isAvailable") VALUES
('Extra Shot', 2.0, true),
('Oat Milk', 3.0, true),
('Caramel Drizzle', 1.5, true);

-- 4. Enable RLS (Optional - depending on if you use Service Role or Anon)
-- For a simple demo, you can leave RLS disabled or set it to allow all.
-- ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public access" ON "User" FOR ALL USING (true);
-- (Repeat for other tables)
