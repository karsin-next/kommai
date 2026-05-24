# Supabase Row Level Security Policies

## Authentication Approach
- Owner dashboard uses passwordless login (magic link via email or SMS OTP; WhatsApp OTP if technically feasible with current Meta policies).
- Auth user ID linked to `businesses.id` for RLS context.

## Policies

### businesses table
- SELECT: `(auth.uid() = id)` — business sees only its own row.
- INSERT: `(auth.uid() = id)` — new signup creates own row.
- UPDATE: `(auth.uid() = id)` — business updates its own config, plan, etc.

### bookings table
- SELECT: `(auth.uid() = business_id)` — business sees its own bookings.
- INSERT: service_role only (via API routes).
- UPDATE: service_role only (via API routes for payment state changes, reminders).

### customer_uniques table
- SELECT: service_role only (via API routes for freemium checks).
- INSERT: service_role only.

### webhook_events table
- SELECT/INSERT/UPDATE: service_role only.
- No direct client access.

## Notes
- All API routes use `supabaseAdmin` (service_role) for server-side operations.
- Owner-facing queries use authenticated client with RLS.
