---
name: kommai-mvp
description: Builds the complete Kommai.asia MVP from scratch following the production-grade scaffolding (freemium, Supabase source of truth, idempotency, state machine).
---

# Kommai.asia MVP Workflow

## Step 1: Project Initialization
- Initialize Next.js 14 + TypeScript + Tailwind.
- Deploy empty app to Vercel (Hobby plan).
- Configure custom domain `kommai.asia`.
- Set up Sentry project.

## Step 2: Database & Infrastructure
- Create Supabase project.
- Run initial migrations for `businesses`, `bookings`, `customer_uniques`, `webhook_events` tables.
- Apply RLS policies per `supabase/rls.md`.
- Create WhatsApp Cloud API app on Meta Developer.
- Register Billplz merchant account.
- Add all environment variables to `.env` and Vercel dashboard.

## Step 3: Core Services
- WhatsApp webhook handler (`src/services/whatsapp.ts`, route at `/api/whatsapp`).
- Claude Haiku intent detection (`src/services/intent.ts`).
- Booking service with Supabase writes + Sheets export (`src/services/booking.ts`).
- Billplz payment integration with idempotency (`src/services/payment.ts`).
- Freemium enforcement service (`src/services/freemium.ts`).
- Business config loader (`src/services/config.ts`).

## Step 4: Booking Loop Implementation
- Full flow: WhatsApp message → intent detection → freemium gate → service match → availability check (Supabase) → booking creation → deposit link → confirmation.
- Hot lead handoff: urgency keywords → WhatsApp alert to owner.
- All webhooks: signature verification + idempotency.

## Step 5: Reminders & Cron
- Vercel Cron job (hourly): query Supabase for tomorrow's confirmed bookings with `reminder_sent = false`.
- Send 24h reminder via WhatsApp.
- Set `reminder_sent = true`.

## Step 6: Owner Dashboard
- Minimal `/dashboard` with passwordless login (magic link email/SMS).
- View today's bookings, upcoming bookings.
- Edit operating hours, deposit amount, service list.
- See unique customer count and plan status.
- Upgrade plan button (Billplz payment link at RM99/Pro or RM199/Premium).

## Step 7: Landing Page
- Static landing page at `kommai.asia`.
- Sections: Hero ("Your Free WhatsApp Receptionist"), Features, Pricing (free ≤25, Pro RM99, Premium RM199), FAQ, CTA.
- Template library page (`/templates`) for SEO.

## Step 8: Testing & Deployment
- End-to-end test: WhatsApp message → booking → deposit → reminder.
- Idempotency test: double webhook → no duplicate state change.
- State machine test: deposit expiry → booking NOT auto-cancelled.
- Freemium test: 25th customer allowed, 26th blocked, 1st still allowed after limit hit.
- Deploy to Vercel production.
- Run post-deployment verification checklist.
