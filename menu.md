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
