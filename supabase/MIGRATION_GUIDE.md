# Migrating to Your Own Supabase Project

This app currently runs on **Lovable Cloud** (a managed backend). Its live
credentials in `.env` and `supabase/config.toml` are auto-generated and cannot
be edited here — so the preview keeps using the managed backend. To run against
**your own Supabase project**, use this guide when self-hosting or after
exporting the code.

## 1. Create the schema
Open your new Supabase project → **SQL Editor** → paste and run the entire
`supabase/manual-migration.sql`. This creates every table, RLS policy, trigger,
role helper, and storage bucket:

**Tables:** `profiles`, `user_roles`, `products`, `gallery`, `bookings`,
`orders`, `cart`, `wishlist`, `admin_users`
**Buckets:** `products`, `gallery`, `payments` (all private)

## 2. Disable email verification (immediate signup/login)
Dashboard → **Authentication → Providers → Email**:
- Enable **Email** provider
- Turn **OFF** "Confirm email"
- Leave **"Secure password change / reset"** as-is (forgot-password still works)

With "Confirm email" off, users sign up and are logged in instantly — no
verification email, no callback page needed.

## 3. Point the app at your project (self-host / eject only)
Set these environment variables (never commit real secrets):
```
VITE_SUPABASE_URL=https://<your-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your anon/publishable key>
# server-only (never exposed to the browser):
SUPABASE_SERVICE_ROLE_KEY=<your service_role key>
```
The frontend only ever uses the **publishable/anon** key. The `service_role`
key is read only inside server code (`client.server.ts`) and is never bundled
into the browser.

## 4. Make yourself admin
1. Sign up in the app with your admin email.
2. In SQL Editor run:
```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users
where email = 'harshitalalwani678@gmail.com'
on conflict do nothing;
```
The admin panel (`/admin`) is gated to authenticated users whose row exists in
`user_roles` with role `admin` (checked via the `has_role` function).

## 5. Sessions persist across refresh
Already configured in `src/integrations/supabase/client.ts`
(`persistSession: true`, `autoRefreshToken: true`, localStorage storage).

## Security summary
- RLS enabled on **all** tables.
- Users can only read/write their own `profiles`, `bookings`, `orders`,
  `cart`, `wishlist`.
- `products`/`gallery` are public-read, admin-write.
- Roles live in `user_roles` (never on `profiles`) to prevent privilege
  escalation; checked with a `SECURITY DEFINER` `has_role` function.
- `payments` uploads are locked to each user's own `{uid}/` folder.
- `service_role` key is server-only and never shipped to the client.
