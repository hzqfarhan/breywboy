-- Breywboy FIFO inventory, recipes, and profit tracking update.
-- Run this in Supabase SQL Editor after the existing schema/data is installed.

CREATE TABLE IF NOT EXISTS "Supplier" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "email" TEXT,
  "address" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RawMaterial" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL UNIQUE,
  "sku" TEXT UNIQUE,
  "category" TEXT NOT NULL DEFAULT 'Other',
  "unit" TEXT NOT NULL,
  "currentStock" DOUBLE PRECISION DEFAULT 0,
  "minimumStock" DOUBLE PRECISION DEFAULT 0,
  "isPerishable" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RawMaterialBatch" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "rawMaterialId" TEXT NOT NULL REFERENCES "RawMaterial"("id") ON DELETE CASCADE,
  "batchNumber" TEXT NOT NULL UNIQUE,
  "supplierId" TEXT REFERENCES "Supplier"("id") ON DELETE SET NULL,
  "purchaseDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "expiryDate" TIMESTAMP WITH TIME ZONE,
  "quantityPurchased" DOUBLE PRECISION NOT NULL,
  "quantityRemaining" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "totalCost" DOUBLE PRECISION NOT NULL,
  "costPerUnit" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Purchase" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "supplierId" TEXT REFERENCES "Supplier"("id") ON DELETE SET NULL,
  "invoiceNumber" TEXT,
  "purchaseDate" TIMESTAMP WITH TIME ZONE NOT NULL,
  "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "PurchaseItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "purchaseId" TEXT NOT NULL REFERENCES "Purchase"("id") ON DELETE CASCADE,
  "rawMaterialId" TEXT NOT NULL REFERENCES "RawMaterial"("id") ON DELETE CASCADE,
  "batchId" TEXT REFERENCES "RawMaterialBatch"("id") ON DELETE SET NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "totalCost" DOUBLE PRECISION NOT NULL,
  "costPerUnit" DOUBLE PRECISION NOT NULL,
  "expiryDate" TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS "Recipe" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "version" INTEGER DEFAULT 1,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "RecipeItem" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "recipeId" TEXT NOT NULL REFERENCES "Recipe"("id") ON DELETE CASCADE,
  "rawMaterialId" TEXT NOT NULL REFERENCES "RawMaterial"("id") ON DELETE CASCADE,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "wastePercent" DOUBLE PRECISION DEFAULT 0,
  "notes" TEXT
);

CREATE TABLE IF NOT EXISTS "StockMovement" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "rawMaterialId" TEXT NOT NULL REFERENCES "RawMaterial"("id") ON DELETE CASCADE,
  "batchId" TEXT REFERENCES "RawMaterialBatch"("id") ON DELETE SET NULL,
  "type" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "unit" TEXT NOT NULL,
  "costPerUnit" DOUBLE PRECISION DEFAULT 0,
  "totalCost" DOUBLE PRECISION DEFAULT 0,
  "referenceType" TEXT,
  "referenceId" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "OrderCost" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"("id") ON DELETE CASCADE,
  "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "cogs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "grossProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "grossMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "OrderItemCost" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderItemId" TEXT NOT NULL UNIQUE REFERENCES "OrderItem"("id") ON DELETE CASCADE,
  "productId" TEXT REFERENCES "Product"("id") ON DELETE SET NULL,
  "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "cogs" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "grossProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "grossMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "costBreakdown" JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "InventoryAdjustment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "rawMaterialId" TEXT NOT NULL REFERENCES "RawMaterial"("id") ON DELETE CASCADE,
  "batchId" TEXT REFERENCES "RawMaterialBatch"("id") ON DELETE SET NULL,
  "adjustmentType" TEXT NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "reason" TEXT NOT NULL,
  "notes" TEXT,
  "createdById" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ProductCostSnapshot" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "estimatedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sellingPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "estimatedProfit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "estimatedMargin" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "calculatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "InventorySetting" (
  "id" TEXT PRIMARY KEY DEFAULT 'default',
  "enableInventoryTracking" BOOLEAN DEFAULT true,
  "enableFifoCosting" BOOLEAN DEFAULT true,
  "allowNegativeStock" BOOLEAN DEFAULT false,
  "lowStockAlertEnabled" BOOLEAN DEFAULT true,
  "expiryAlertDays" INTEGER DEFAULT 7,
  "defaultWastePercent" DOUBLE PRECISION DEFAULT 0,
  "autoDeductStockOn" TEXT DEFAULT 'ACCEPTED',
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_raw_material_batch_fifo" ON "RawMaterialBatch" ("rawMaterialId", "status", "purchaseDate", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_stock_movement_created" ON "StockMovement" ("createdAt", "type");
CREATE INDEX IF NOT EXISTS "idx_recipe_active_product" ON "Recipe" ("productId", "isActive");

INSERT INTO "InventorySetting" ("id") VALUES ('default') ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Promo" ("id", "code", "description", "discountType", "discountValue", "minOrderAmount", "maxUses", "currentUses", "isActive", "startsAt", "expiresAt") VALUES
('promo-welcome10', 'WELCOME10', '10% off for first Breywboy online orders.', 'PERCENTAGE', 10, 10, 200, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '90 days'),
('promo-kopi5', 'KOPI5', 'RM5 off orders RM30 and above.', 'FIXED', 5, 30, 150, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '60 days'),
('promo-matcha12', 'MATCHA12', '12% off Matcha Series campaign.', 'PERCENTAGE', 12, 12, 120, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '45 days'),
('promo-pasta3', 'PASTA3', 'RM3 off pasta orders RM20 and above.', 'FIXED', 3, 20, 100, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '45 days'),
('promo-student15', 'STUDENT15', '15% student promo for selected cafe orders.', 'PERCENTAGE', 15, 15, 100, 0, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days')
ON CONFLICT ("code") DO UPDATE SET
"description" = EXCLUDED."description",
"discountType" = EXCLUDED."discountType",
"discountValue" = EXCLUDED."discountValue",
"minOrderAmount" = EXCLUDED."minOrderAmount",
"maxUses" = EXCLUDED."maxUses",
"isActive" = EXCLUDED."isActive",
"startsAt" = EXCLUDED."startsAt",
"expiresAt" = EXCLUDED."expiresAt";

INSERT INTO "Reward" ("id", "name", "description", "pointsRequired", "isActive") VALUES
('reward-rm3-voucher', 'RM3 Breywboy Voucher', 'Redeem RM3 off your next Breywboy order.', 30, true),
('reward-free-toast', 'Free Kaya Butter Toast', 'Redeem one steamed toast with kaya butter.', 45, true),
('reward-free-extra-shot', 'Free Extra Shot', 'Redeem one extra espresso shot add-on.', 50, true),
('reward-free-iced-americano', 'Free Iced Americano', 'Redeem one iced Americano.', 80, true),
('reward-rm10-voucher', 'RM10 Breywboy Voucher', 'Redeem RM10 off a larger cafe order.', 100, true)
ON CONFLICT ("id") DO UPDATE SET
"name" = EXCLUDED."name",
"description" = EXCLUDED."description",
"pointsRequired" = EXCLUDED."pointsRequired",
"isActive" = EXCLUDED."isActive";

INSERT INTO "Supplier" ("id", "name", "phone", "email", "address") VALUES
('sup-brey-main', 'Breywboy Main Supplier', '012-0000000', 'supplier@breywboy.local', 'Johor Bahru'),
('sup-packaging', 'JB Packaging Supply', '012-1111111', 'packaging@breywboy.local', 'Johor Bahru')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "RawMaterial" ("id", "name", "sku", "category", "unit", "currentStock", "minimumStock", "isPerishable") VALUES
('rm-beans', 'Brazil Cerrado Coffee Beans', 'BEANS-BRAZIL', 'Coffee', 'g', 2000, 500, false),
('rm-shot-placeholder', 'Espresso Shot Costing Placeholder', 'SHOT-PLACEHOLDER', 'Coffee', 'pcs', 0, 0, false),
('rm-fresh-milk', 'Fresh Milk', 'FRESH-MILK', 'Dairy', 'ml', 24000, 3000, true),
('rm-condensed-milk', 'Condensed Milk', 'COND-MILK', 'Dairy', 'ml', 3000, 500, true),
('rm-oat-milk', 'Oat Milk', 'OAT-MILK', 'Non-Dairy Milk', 'ml', 6000, 1000, true),
('rm-matcha', 'Matcha Powder', 'MATCHA', 'Powder', 'g', 1000, 200, false),
('rm-taro', 'Taro Powder', 'TARO', 'Powder', 'g', 1000, 200, false),
('rm-chocolate', 'Chocolate Powder', 'CHOCOLATE', 'Powder', 'g', 1000, 200, false),
('rm-strawberry-syrup', 'Strawberry Syrup', 'STRAW-SYRUP', 'Syrup', 'ml', 2000, 300, false),
('rm-caramel-syrup', 'Caramel Syrup', 'CARAMEL-SYRUP', 'Syrup', 'ml', 2000, 300, false),
('rm-hazelnut-syrup', 'Hazelnut Syrup', 'HAZEL-SYRUP', 'Syrup', 'ml', 2000, 300, false),
('rm-vanilla-syrup', 'Vanilla Syrup', 'VANILLA-SYRUP', 'Syrup', 'ml', 2000, 300, false),
('rm-banana-syrup', 'Banana Syrup', 'BANANA-SYRUP', 'Syrup', 'ml', 2000, 300, false),
('rm-spaghetti', 'Spaghetti Pasta', 'SPAGHETTI', 'Pasta', 'g', 5000, 1000, false),
('rm-aglio', 'Aglio Olio Seasoning', 'AGLIO-SEASON', 'Pasta', 'g', 1000, 200, false),
('rm-carbonara', 'Carbonara Sauce', 'CARBONARA-SAUCE', 'Sauce', 'g', 3000, 500, true),
('rm-buttermilk', 'Buttermilk Sauce', 'BUTTERMILK-SAUCE', 'Sauce', 'g', 3000, 500, true),
('rm-tomyum', 'Tomyum Sauce', 'TOMYUM-SAUCE', 'Sauce', 'g', 3000, 500, true),
('rm-chicken', 'Chicken', 'CHICKEN', 'Protein', 'g', 5000, 1000, true),
('rm-fries', 'Fries', 'FRIES', 'Frozen Food', 'g', 5000, 1000, true),
('rm-curly-fries', 'Curly Fries', 'CURLY-FRIES', 'Frozen Food', 'g', 3000, 800, true),
('rm-popcorn', 'Chicken Popcorn', 'CHICKEN-POPCORN', 'Frozen Food', 'g', 4000, 800, true),
('rm-tempura', 'Chicken Tempura', 'CHICKEN-TEMPURA', 'Frozen Food', 'pcs', 200, 40, true),
('rm-toast', 'Steamed Toast', 'STEAMED-TOAST', 'Bread', 'pcs', 80, 20, true),
('rm-kaya', 'Kaya', 'KAYA', 'Bread', 'g', 1000, 200, true),
('rm-butter', 'Butter', 'BUTTER', 'Bread', 'g', 1000, 200, true),
('rm-hot-cup', 'Hot Cup', 'HOT-CUP', 'Packaging', 'pcs', 500, 100, false),
('rm-iced-cup', 'Iced Cup', 'ICED-CUP', 'Packaging', 'pcs', 500, 100, false),
('rm-cup-lid', 'Cup Lid', 'CUP-LID', 'Packaging', 'pcs', 500, 100, false),
('rm-straw', 'Straw', 'STRAW', 'Packaging', 'pcs', 500, 100, false),
('rm-food-container', 'Food Container', 'FOOD-CONTAINER', 'Packaging', 'pcs', 300, 80, false),
('rm-napkin', 'Napkin', 'NAPKIN', 'Packaging', 'pcs', 500, 100, false),
('rm-spritzer', 'Spritzer Bottle', 'SPRITZER', 'Other', 'bottle', 48, 12, false),
('rm-ice', 'Ice', 'ICE', 'Other', 'g', 20000, 5000, true)
ON CONFLICT ("name") DO UPDATE SET
"sku" = EXCLUDED."sku",
"category" = EXCLUDED."category",
"unit" = EXCLUDED."unit",
"minimumStock" = EXCLUDED."minimumStock",
"isPerishable" = EXCLUDED."isPerishable";

INSERT INTO "RawMaterialBatch" ("rawMaterialId", "batchNumber", "supplierId", "purchaseDate", "expiryDate", "quantityPurchased", "quantityRemaining", "unit", "totalCost", "costPerUnit", "status") VALUES
('rm-beans', 'BEAN-001', 'sup-brey-main', CURRENT_DATE - INTERVAL '20 days', NULL, 2000, 2000, 'g', 90, 0.045, 'ACTIVE'),
('rm-fresh-milk', 'MILK-001', 'sup-brey-main', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days', 12000, 12000, 'ml', 84, 0.007, 'ACTIVE'),
('rm-fresh-milk', 'MILK-002', 'sup-brey-main', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '6 days', 12000, 12000, 'ml', 96, 0.008, 'ACTIVE'),
('rm-oat-milk', 'OAT-001', 'sup-brey-main', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '14 days', 6000, 6000, 'ml', 72, 0.012, 'ACTIVE'),
('rm-matcha', 'MATCHA-001', 'sup-brey-main', CURRENT_DATE - INTERVAL '15 days', NULL, 1000, 1000, 'g', 120, 0.12, 'ACTIVE'),
('rm-chocolate', 'CHOCO-001', 'sup-brey-main', CURRENT_DATE - INTERVAL '15 days', NULL, 1000, 1000, 'g', 45, 0.045, 'ACTIVE'),
('rm-iced-cup', 'CUP-001', 'sup-packaging', CURRENT_DATE - INTERVAL '10 days', NULL, 500, 500, 'pcs', 75, 0.15, 'ACTIVE'),
('rm-cup-lid', 'LID-001', 'sup-packaging', CURRENT_DATE - INTERVAL '10 days', NULL, 500, 500, 'pcs', 40, 0.08, 'ACTIVE'),
('rm-straw', 'STRAW-001', 'sup-packaging', CURRENT_DATE - INTERVAL '10 days', NULL, 500, 500, 'pcs', 25, 0.05, 'ACTIVE'),
('rm-hot-cup', 'HOTCUP-001', 'sup-packaging', CURRENT_DATE - INTERVAL '10 days', NULL, 500, 500, 'pcs', 80, 0.16, 'ACTIVE'),
('rm-food-container', 'FOODBOX-001', 'sup-packaging', CURRENT_DATE - INTERVAL '10 days', NULL, 300, 300, 'pcs', 90, 0.30, 'ACTIVE'),
('rm-napkin', 'NAPKIN-001', 'sup-packaging', CURRENT_DATE - INTERVAL '10 days', NULL, 500, 500, 'pcs', 15, 0.03, 'ACTIVE')
ON CONFLICT ("batchNumber") DO NOTHING;

UPDATE "RawMaterial" rm
SET "currentStock" = COALESCE(batch_totals.total, rm."currentStock")
FROM (
  SELECT "rawMaterialId", SUM("quantityRemaining") AS total
  FROM "RawMaterialBatch"
  WHERE "status" = 'ACTIVE'
  GROUP BY "rawMaterialId"
) batch_totals
WHERE rm."id" = batch_totals."rawMaterialId";

INSERT INTO "Product" ("id", "name", "description", "categoryId", "basePrice", "hasTemperatureOption", "allowHot", "allowIced", "allowOatMilk", "allowExtraShot", "isAvailable", "isPopular")
VALUES
('p-extra-shot', 'Extra Shot', 'Add-on espresso shot for costing.', 'cat-addons', 2, false, false, false, false, false, true, false),
('p-oat-milk-addon', 'Oat Milk', 'Add-on oat milk replacement for costing.', 'cat-addons', 2, false, false, false, false, false, true, false)
ON CONFLICT ("id") DO NOTHING;

CREATE OR REPLACE FUNCTION seed_recipe(recipe_product_id TEXT, recipe_name TEXT, item_rows JSONB)
RETURNS VOID AS $$
DECLARE
  new_recipe_id TEXT;
  item JSONB;
BEGIN
  UPDATE "Recipe" SET "isActive" = false WHERE "productId" = recipe_product_id;
  INSERT INTO "Recipe" ("productId", "name", "version", "isActive")
  VALUES (recipe_product_id, recipe_name, 1, true)
  RETURNING "id" INTO new_recipe_id;

  FOR item IN SELECT * FROM jsonb_array_elements(item_rows)
  LOOP
    INSERT INTO "RecipeItem" ("recipeId", "rawMaterialId", "quantity", "unit", "wastePercent")
    VALUES (
      new_recipe_id,
      item->>'rawMaterialId',
      (item->>'quantity')::double precision,
      item->>'unit',
      COALESCE((item->>'wastePercent')::double precision, 0)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

SELECT seed_recipe('p-latte', 'Latte Iced', '[{"rawMaterialId":"rm-beans","quantity":18,"unit":"g"},{"rawMaterialId":"rm-fresh-milk","quantity":160,"unit":"ml"},{"rawMaterialId":"rm-ice","quantity":100,"unit":"g"},{"rawMaterialId":"rm-iced-cup","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-cup-lid","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-straw","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-americano', 'Americano Iced', '[{"rawMaterialId":"rm-beans","quantity":18,"unit":"g"},{"rawMaterialId":"rm-ice","quantity":120,"unit":"g"},{"rawMaterialId":"rm-iced-cup","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-cup-lid","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-straw","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-matcha-latte', 'Matcha Latte Iced', '[{"rawMaterialId":"rm-matcha","quantity":20,"unit":"g"},{"rawMaterialId":"rm-fresh-milk","quantity":180,"unit":"ml"},{"rawMaterialId":"rm-ice","quantity":100,"unit":"g"},{"rawMaterialId":"rm-iced-cup","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-cup-lid","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-straw","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-strawberry-matcha', 'Strawberry Matcha Latte Iced', '[{"rawMaterialId":"rm-matcha","quantity":20,"unit":"g"},{"rawMaterialId":"rm-fresh-milk","quantity":160,"unit":"ml"},{"rawMaterialId":"rm-strawberry-syrup","quantity":30,"unit":"ml"},{"rawMaterialId":"rm-ice","quantity":100,"unit":"g"},{"rawMaterialId":"rm-iced-cup","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-cup-lid","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-straw","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-taro-latte', 'Taro Latte Iced', '[{"rawMaterialId":"rm-taro","quantity":25,"unit":"g"},{"rawMaterialId":"rm-fresh-milk","quantity":180,"unit":"ml"},{"rawMaterialId":"rm-ice","quantity":100,"unit":"g"},{"rawMaterialId":"rm-iced-cup","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-cup-lid","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-straw","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-chocolatte', 'Chocolatte Iced', '[{"rawMaterialId":"rm-chocolate","quantity":25,"unit":"g"},{"rawMaterialId":"rm-fresh-milk","quantity":180,"unit":"ml"},{"rawMaterialId":"rm-ice","quantity":100,"unit":"g"},{"rawMaterialId":"rm-iced-cup","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-cup-lid","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-straw","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-carbonara', 'Chicken Carbonara', '[{"rawMaterialId":"rm-spaghetti","quantity":120,"unit":"g"},{"rawMaterialId":"rm-chicken","quantity":100,"unit":"g"},{"rawMaterialId":"rm-carbonara","quantity":100,"unit":"g"},{"rawMaterialId":"rm-food-container","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-napkin","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-aglio-olio', 'Chicken Aglio Olio', '[{"rawMaterialId":"rm-spaghetti","quantity":120,"unit":"g"},{"rawMaterialId":"rm-chicken","quantity":100,"unit":"g"},{"rawMaterialId":"rm-aglio","quantity":30,"unit":"g"},{"rawMaterialId":"rm-food-container","quantity":1,"unit":"pcs"},{"rawMaterialId":"rm-napkin","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-fries', 'Fries', '[{"rawMaterialId":"rm-fries","quantity":150,"unit":"g"},{"rawMaterialId":"rm-food-container","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-popcorn', 'Chicken Popcorn', '[{"rawMaterialId":"rm-popcorn","quantity":150,"unit":"g"},{"rawMaterialId":"rm-food-container","quantity":1,"unit":"pcs"}]'::jsonb);
SELECT seed_recipe('p-extra-shot', 'Extra Shot', '[{"rawMaterialId":"rm-beans","quantity":18,"unit":"g"}]'::jsonb);
SELECT seed_recipe('p-oat-milk-addon', 'Oat Milk', '[{"rawMaterialId":"rm-oat-milk","quantity":160,"unit":"ml"}]'::jsonb);

DROP FUNCTION IF EXISTS seed_recipe(TEXT, TEXT, JSONB);
