# Kommai.asia Technology Stack Rules

## TypeScript
- TypeScript strict mode ON.
- All function parameters and return types explicitly typed.
- Use `interface` for data shapes, `type` for unions/primitives.
- No `any` type – use `unknown` and narrow.

## Next.js
- Always App Router (not Pages Router).
- API routes in `src/app/api/` only.
- Server components for landing page; API routes for webhooks and backend logic.
- All API responses: `{ success: boolean, data?: any, error?: string }`.

## Supabase (Source of Truth)
- Use `@supabase/supabase-js` client library.
- Row Level Security (RLS) on all tables (see `supabase/rls.md`).
- Service role key NEVER exposed to client; used only server-side.
- All DB writes go through API routes.

## Google Sheets (Export Only)
- Used ONLY for owner-friendly booking visibility.
- Never queried for availability checks or business logic.
- Writes are async, non-blocking. Failures logged but never break booking flow.

## Environment Variables (`.env`, never committed)
Required variables:
- `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`
- `CLAUDE_API_KEY`
- `BILLPLZ_API_KEY`, `BILLPLZ_COLLECTION_ID`, `BILLPLZ_WEBHOOK_SECRET`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `SENTRY_DSN`
- `CRON_SECRET`
- `RATE_LIMIT_REQUESTS_PER_MIN` (default: 50)
