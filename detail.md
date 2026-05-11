# Breywboy Café - Demo Credentials

You can use the following credentials to test the application locally or on Vercel.

### 👤 Customer Account
- **Email**: `customer@breywboy.demo`
- **Password**: `customer123`
- **Role**: Customer
- **Features**: Order drinks, earn points, track orders, redeem rewards.

### 🔑 Admin Account
- **Email**: `admin@breywboy.demo`
- **Password**: `admin123`
- **Role**: Admin
- **Features**: Manage menu availability, view all orders, update order status.

---

### 🛠️ Important Setup Notes
1. **Authentication**: These users are hardcoded in `lib/auth.ts` as fallbacks, so they will work even if your database is empty.
2. **Database Seeding**: To make these users appear in your Supabase dashboard and give them initial points, visit:
   `https://breywboy.vercel.app/api/seed` (or your local equivalent).
3. **Environment Variables**: Ensure `AUTH_SECRET` is set in Vercel for the login to persist.
