# Bongo Sharee — Production-Hardened Storefront

React + Vite + Tailwind storefront with Supabase-ready authentication, catalog, cart, wishlist, addresses, reviews, secure checkout RPC, and an admin catalog flow.

## Run locally

```bash
npm install
npm run dev
```

The project still has a demo mode when Supabase credentials are absent. Demo mode is for UI/testing only and is not a real payment or multi-user store.

## Supabase setup

1. Create a Supabase project.
2. Run **all** of `supabase/schema.sql` in the SQL Editor.
3. Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Create your first user normally, then set that user's `profiles.role` to `admin` in Supabase for admin access.
5. Add real products/images from the admin catalog.

### Important schema change

`create_order_secure()` is included at the bottom of `supabase/schema.sql`. It is the trusted checkout path: it re-reads product prices and stock, calculates shipping/discounts, creates the order and order items atomically, records coupon usage, and decrements stock.

## Payments

The frontend no longer fakes successful online payments. **Cash on Delivery** works without a gateway. Stripe, SSLCommerz, bKash and Nagad require a server-side/Supabase Edge Function.

Set:

```env
VITE_PAYMENT_FUNCTION_URL=https://<your-project>.supabase.co/functions/v1/payment
```

Your server endpoint must keep all secret credentials server-side and return JSON such as:

```json
{"status":"succeeded","transactionId":"provider_transaction_id"}
```

Never put payment secret keys in `.env` variables prefixed with `VITE_`.

## What was hardened

- Supabase product/category field mapping
- Live product and category loading
- Real user/admin role lookup
- Supabase-backed cart and wishlist synchronization
- Persistent addresses
- Real order history/detail loading
- Atomic order + order-item checkout RPC
- Server-side price/stock/shipping/coupon calculation
- Coupon persistence from cart to checkout
- Verified-review insertion path
- Real password reset/update calls
- Out-of-stock and cart quantity limits
- Online payment simulation removed
- Better checkout/error handling

## Still required before accepting real online payments

Gateway-specific Edge Functions/webhooks must be configured and tested with sandbox credentials. This ZIP intentionally does not contain merchant secrets.

## Production build

```bash
npm run build
npm run preview
```

Dependency installation/build could not be executed in the audit environment because the npm registry request timed out, so run the commands above locally/CI after installing dependencies.
