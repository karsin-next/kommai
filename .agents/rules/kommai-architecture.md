# Kommai.asia Architecture Blueprint

## System Overview
WhatsApp-native auto-booking system for massage & wellness centres. Freemium model: free ≤25 unique customers forever; paid plans unlock unlimited customers.

## Core Business Rules
- Deposit REQUIRED for all bookings (amount from `businessConfig.deposit_amount_rm`).
- Operating hours enforced per business (`businessConfig.operating_hours`).
- Double-booking prevention: check **Supabase `bookings` table** for conflicting date/time slots. Google Sheets is NEVER the availability check source.
- Hot Lead Handoff: when customer shows urgency ("nak sekarang", "urgent", "sekarang", "cepat"), immediately send WhatsApp alert to owner with conversation context.
- AI NEVER generates pricing, durations, or policy text – all from `businessConfig`.

## Freemium Enforcement (Precise Definition)
- **Unique customer** = phone number hash exists in `customer_uniques` table for this business.
- **Count never decreases.** Free plan lifetime cap is 25 unique customers.
- **Logic:**
  1. Hash incoming customer phone.
  2. If hash already exists in `customer_uniques` for this business → **allow booking** (no count increment).
  3. If new hash AND `business.plan == 'free'` AND `business.unique_customer_count >= 25` → **block booking** + trigger `send-upgrade-prompt` skill.
  4. If new hash AND (plan is paid OR count < 25) → atomic INSERT into `customer_uniques` + increment count.
- On upgrade to Pro (RM99/month) or Premium (RM199/month), limit is removed. All customers can book regardless of count.
- Existing customers (#1–25) can ALWAYS book, even if business remains on free plan beyond the limit.

## Booking Data Flow (Source of Truth: Supabase)
1. WhatsApp message → webhook `POST /api/whatsapp`
2. Verify Meta signature (`x-hub-signature-256`). Reject if invalid.
3. Intent detection (Claude Haiku) → `{ intent, entities }`.
4. **Freemium gate:** hash phone → check `customer_uniques` → enforce limit or allow.
5. Service match from `businessConfig.services` (fuzzy string matching).
6. Check operating hours + existing bookings in **Supabase `bookings` table**.
7. Create booking row in Supabase: `status = 'confirmed'`, `deposit_status = 'pending_deposit'`.
8. Export booking to Google Sheets (for owner visibility; non-critical, async).
9. Generate Billplz deposit payment link → send via WhatsApp.
10. Billplz webhook → verify signature → idempotent state transition per state machine.
11. Vercel Cron (hourly) → finds tomorrow's confirmed bookings with `reminder_sent = false` → sends 24h reminder → sets `reminder_sent = true`.
12. Hot Lead: urgency keywords or low AI confidence → alert owner immediately.

## File Architecture
/
├── .env                              # Secrets (never committed)
├── .env.example                      # Safe template with placeholders
├── docs/
│   ├── AI_CONSTITUTION.md            # Portable global rules (mirror of ~/.gemini/GEMINI.md)
│   ├── ARCHITECTURE.md
│   └── API.md
├── .agents/
│   ├── rules/
│   │   ├── kommai-architecture.md
│   │   ├── kommai-stack.md
│   │   ├── kommai-schema.md
│   │   ├── kommai-conventions.md
│   │   ├── kommai-state-machine.md
│   │   ├── kommai-security.md
│   │   └── kommai-idempotency.md
│   ├── skills/
│   │   ├── create-api-route/
│   │   │   └── SKILL.md
│   │   ├── add-payment-gateway/
│   │   │   └── SKILL.md
│   │   ├── deploy-to-vercel/
│   │   │   └── SKILL.md
│   │   ├── enforce-freemium/
│   │   │   └── SKILL.md
│   │   └── send-upgrade-prompt/
│   │       └── SKILL.md
│   └── workflows/
│       └── kommai-mvp.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── whatsapp/route.ts    # WhatsApp webhook
│   │   │   ├── billplz/route.ts     # Billplz payment webhook
│   │   │   └── onboard/route.ts     # Business onboarding
│   │   └── (landing)/               # Public landing page (kommai.asia)
│   │       └── dashboard/           # Minimal owner dashboard
│   ├── services/
│   │   ├── whatsapp.ts              # WhatsApp message send/receive
│   │   ├── intent.ts                # Claude AI intent detection
│   │   ├── booking.ts              # Booking CRUD (Supabase + Sheets export)
│   │   ├── payment.ts              # Billplz integration
│   │   ├── reminder.ts             # Cron reminder logic
│   │   ├── config.ts               # Business config loader
│   │   └── freemium.ts             # Customer count & upgrade enforcement
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client
│   │   ├── sheets.ts               # Google Sheets client (export only)
│   │   └── guardrails.ts           # AI safety guardrails
│   └── types/
│       ├── business.ts
│       ├── booking.ts
│       └── whatsapp.ts
├── supabase/
│   ├── migrations/                  # All DB migrations
│   └── rls.md                       # RLS policy definitions
