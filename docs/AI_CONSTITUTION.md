# Global Engineering Constitution

## 1. Universal Coding Mandates
- Never invent prices, durations, or service details – always source from `businessConfig`.
- Database schema changes MUST create a migration in `supabase/migrations/` AND update `.agents/rules/kommai-schema.md`. Never alter the DB directly without both artifacts.
- Never remove or hardcode secrets; all keys in `.env` (never committed). `.env.example` must list every required variable with placeholder values.
- All API routes: rate limiting + input validation (thresholds configurable via env).
- Every function must have a JSDoc comment (purpose, parameters, return type).
- Error messages user-friendly; never expose stack traces or internal state.
- All user-facing text bilingual (Bahasa Malaysia + English).
- WhatsApp messages concise (≤400 characters), warm and friendly tone.
- Before writing code, state: what you're building, which files will be touched, and why.
- Never touch files outside the stated scope.
- After coding, produce a concise summary artifact of all changes made.

## 2. Tech Stack Declaration
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js API Routes (serverless on Vercel)
- Database: **Supabase (PostgreSQL, free tier) – source of truth for all bookings, availability, and customer data**
- Google Sheets: **read-only export/reporting layer only** (never used for availability checks, double-booking prevention, or as primary storage)
- AI: Claude Haiku API (intent detection only; no content generation)
- WhatsApp API: WhatsApp Cloud API (Meta)
- Payments: Billplz (Malaysia)
- Cron: Vercel Cron Jobs (1 free job)
- Monitoring: Sentry (free tier)
- Deployment: Vercel (Hobby plan)

## 3. Architecture Principles
- Strict 3-layer: Routes (API/Webhook handlers) → Services (business logic) → Data (Supabase queries).
- All external API calls through dedicated service layer.
- Multi-tenant: all data isolated by `business_id`. RLS enforced on every table.
- Rules-engine pattern: hardcoded `businessConfig` drives behaviour; AI only interprets user intent.
- WhatsApp webhook must verify Meta's `x-hub-signature-256`.
- Billplz webhook must verify Billplz signature.
- All payment state transitions are idempotent and follow the state machine in `.agents/rules/kommai-state-machine.md`.
- All webhook events deduplicated per the idempotency standard in `.agents/rules/kommai-idempotency.md`.
