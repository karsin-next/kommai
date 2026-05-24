# Non-Negotiable Security Rules

## Webhook Verification
- **WhatsApp:** Verify `x-hub-signature-256` using `WHATSAPP_VERIFY_TOKEN`. Reject (401) if invalid.
- **Billplz:** Verify signature using `BILLPLZ_WEBHOOK_SECRET`. Reject (401) if invalid.
- Both webhooks: log verification failures (Sentry).

## Replay Attack Prevention
- All processed webhook events stored in `webhook_events` table (see schema).
- On receipt, check if `event_id` already exists → if yes, return 200 with stored result (idempotent).
- `event_id` sources: WhatsApp `message_id`, Billplz `bill_id`.
- See `.agents/rules/kommai-idempotency.md` for full standard.

## Rate Limiting
- All public API routes must implement rate limiting.
- Thresholds configurable via environment variables:
  - `RATE_LIMIT_REQUESTS_PER_MIN` (default: 50)
  - `RATE_LIMIT_PER_IP` (default: 5)
- WhatsApp webhook: apply per-business rate limiting to prevent abuse.
- Return 429 with retry-after header when exceeded.

## Data Access & RLS
- Row Level Security enforced on all Supabase tables (see `supabase/rls.md`).
- `SUPABASE_SERVICE_ROLE_KEY` used ONLY server-side in API routes.
- `NEXT_PUBLIC_SUPABASE_URL` is the only Supabase env var exposed to client.
- All queries filter by `business_id` from authenticated context.

## Secrets Management
- All secrets in `.env` (never committed to git).
- `.env.example` lists all required variables with placeholder values.
- Rotate keys if any accidentally committed.

## Logging
- Log webhook payload hashes (SHA256), not raw payloads.
- Log all payment events with `billplz_bill_id`.
- Log all authentication failures.
- Never log `WHATSAPP_TOKEN` or `BILLPLZ_WEBHOOK_SECRET`.
