# Inventory Guide

This guide explains how the inventory module works from an admin perspective, what each page does, and the usual flow to keep stock, product costing, and profit reports accurate.

## What The Inventory Module Does

The inventory system tracks raw materials and packaging, records stock purchases, stores stock in FIFO batches, links products to recipes, and automatically deducts ingredients when orders are prepared.

It helps admins answer:

- What ingredients or packaging items are low or out of stock?
- Which purchased batch should be used first?
- Which items are expiring soon?
- How much stock value is currently on hand?
- How much ingredient cost was used for each order?
- Which products are profitable after FIFO ingredient cost?

## Main Flow

Use the inventory system in this order:

1. Create raw materials.
2. Add purchases to create stock batches.
3. Create recipes for menu products.
4. Process orders from the admin order board.
5. Review stock, movements, and profit.

## 1. Raw Materials

Path: `Admin > Inventory > Raw Materials`

Raw materials are the items the business buys and uses to make products. This includes ingredients, packaging, and other consumables.

Examples:

- Coffee beans
- Fresh milk
- Oat milk
- Syrups
- Cups
- Lids
- Pasta ingredients

When adding a raw material, enter:

- `Name`: Human readable item name.
- `SKU`: Internal stock code.
- `Category`: Coffee, Dairy, Syrup, Packaging, Other, and so on.
- `Unit`: The base unit used for stock tracking.
- `Minimum Stock`: The threshold used for low-stock alerts.
- `Perishable`: Tick this for items with expiry dates.

The system stores stock in base units. For example, `kg` is converted into `g`, and `L` is converted into `ml`, so calculations stay consistent.

## 2. Purchases

Path: `Admin > Inventory > Purchases`

Purchases are how stock enters the system. When you create a purchase, the app automatically creates a FIFO stock batch.

Enter:

- Supplier
- Invoice number
- Purchase date
- Raw material
- Quantity purchased
- Unit
- Total cost
- Expiry date, if applicable
- Notes

After saving a purchase, the system:

- Creates a purchase record.
- Creates a stock batch.
- Calculates cost per base unit.
- Adds stock to the raw material's current stock.
- Records a `PURCHASE` stock movement.

Example:

If you buy `2 kg` of coffee beans for `RM80`, the app stores it as `2000 g` and calculates the cost as `RM0.04 per g`.

## 3. Stock Batches

Path: `Admin > Inventory > Stock Batches`

Stock batches show the actual purchased stock lots. They are sorted oldest first for FIFO usage.

Each batch shows:

- FIFO order
- Batch number
- Raw material
- Supplier
- Purchase date
- Expiry date
- Quantity purchased
- Quantity remaining
- Cost per unit
- Status

FIFO means "first in, first out." When an order consumes stock, the system uses the oldest active batch first. Once a batch has no quantity remaining, it becomes depleted.

## 4. Recipes

Path: `Admin > Inventory > Recipes`

Recipes connect menu products to raw materials. This is what allows the app to deduct stock and calculate cost when orders are prepared.

For each product, create a recipe with the raw materials and quantities needed to make one unit of that product.

Example:

For an iced latte recipe:

- Espresso beans: `18 g`
- Fresh milk: `180 ml`
- Cup: `1 pcs`
- Lid: `1 pcs`

You can also enter a waste percentage. If a recipe item has `10%` waste, the system adds that extra amount during stock calculation.

When saving a new recipe for a product, the app marks older recipes for that product inactive and uses the new recipe as the active one.

## 5. Order Stock Deduction

Path: `Admin > Orders`

Stock deduction happens when an admin moves an order from `New Orders` to `Preparing`.

At that point, the system:

- Finds each ordered product.
- Looks up the active recipe for that product.
- Multiplies recipe quantities by the ordered quantity.
- Applies waste percentage.
- Consumes stock from FIFO batches.
- Records `SALE_CONSUMPTION` stock movements.
- Creates item-level cost records.
- Creates order-level COGS, gross profit, and gross margin records.

This means stock is not deducted just because a customer places an order. It is deducted when the shop accepts/prepares the order.

## 6. Inventory Overview

Path: `Admin > Inventory > Overview`

The overview page summarizes inventory health.

It shows:

- Inventory value
- Low-stock item count
- Expiring-soon item count
- Out-of-stock item count
- Stock alerts
- Recent stock movements
- Ingredient usage today

Use this page as the daily check before service starts and during busy periods.

## 7. Stock Adjustments

Path: `Admin > Inventory > Stock Adjustments`

This page is the stock movement audit trail. It shows the latest purchase, sale consumption, waste, and manual movement records.

Each movement shows:

- Date
- Material
- Movement type
- Quantity
- Cost
- Reference

Use this page to investigate why stock changed.

## 8. Product Availability

The app can use inventory to decide whether a product is available.

If inventory tracking is enabled and negative stock is not allowed, products with active recipes may become unavailable when there is not enough stock for their required raw materials.

This protects customers from ordering products that cannot be made.

## 9. Profit And Costing

Inventory feeds into the profit pages.

When stock is consumed from FIFO batches, the app knows the actual cost of the ingredients used. That cost becomes the order's COGS.

Profit calculations use:

- Revenue: the order or item selling price.
- COGS: actual ingredient and packaging cost from FIFO batches.
- Gross profit: revenue minus COGS.
- Gross margin: gross profit divided by revenue.

This makes product margin reports more accurate than using a fixed average cost.

## Recommended Daily Workflow

1. Open `Inventory > Overview`.
2. Check low-stock and out-of-stock alerts.
3. Check expiring-soon batches.
4. Add any new supplier purchases in `Purchases`.
5. Confirm new batches appear in `Stock Batches`.
6. Make sure active products have recipes in `Recipes`.
7. During service, move orders from `New Orders` to `Preparing` only when the order is accepted.
8. Review `Stock Adjustments` if stock looks wrong.
9. Review profit pages after sales have been processed.

## Important Notes

- Always create raw materials before creating purchases.
- Always create purchases before expecting stock to exist.
- Always create recipes before relying on automatic stock deduction or product costing.
- FIFO costing depends on purchase batches. If there are no active batches, the system cannot calculate real stock cost.
- If a product has no active recipe, stock will not be deducted for that product.
- If an order has already been costed, the system skips costing it again to avoid double deduction.
- If stock is insufficient and negative stock is disabled, accepting/preparing an order can fail.

## Quick Troubleshooting

### Product is unavailable

Check:

- Does the product have an active recipe?
- Do all recipe raw materials have enough stock?
- Are stock batches active and not depleted?

### Stock did not increase after buying items

Check:

- Was the purchase saved successfully?
- Did it create a batch in `Stock Batches`?
- Is the raw material unit correct?

### Stock did not deduct after an order

Check:

- Was the order moved to `Preparing`?
- Does the product have an active recipe?
- Has the order already been costed before?
- Is inventory tracking enabled?

### Profit looks too low or too high

Check:

- Recipe quantities.
- Waste percentages.
- Purchase total costs.
- Units used during purchase and recipe setup.
- Whether old batches have very different costs from new batches.

