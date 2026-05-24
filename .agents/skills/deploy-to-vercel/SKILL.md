---
name: deploy-to-vercel
description: Deploys Kommai.asia to Vercel production with full verification of webhooks, state machine, and idempotency.
---

# Deploy to Vercel Skill

## Pre-Deployment Checklist
- [ ] All environment variables set in Vercel dashboard
- [ ] Supabase RLS policies tested
- [ ] WhatsApp webhook URL updated in Meta Developer dashboard
- [ ] Billplz webhook URL updated in Billplz dashboard
- [ ] `CRON_SECRET` set for Vercel Cron authentication
- [ ] `vercel build` succeeds locally
- [ ] Landing page loads correctly at `kommai.asia`
- [ ] All test phone numbers configured for WhatsApp sandbox (if in development)

## Post-Deployment Verification
1. **WhatsApp webhook:** Send test message, verify reply within 2 seconds.
2. **Booking flow:** Full end-to-end – message → intent → booking → deposit link → payment → confirmation.
3. **Billplz webhook:** Create test payment, verify webhook fires and updates booking.
4. **Idempotency:** Send same webhook payload twice, verify second call returns 200 with no state change.
5. **State machine:** Test deposit expiry scenario; verify booking NOT auto-cancelled.
6. **Freemium gate:** Test with business at 25 customers; verify 26th new customer blocked, 1st-25th still allowed.
7. **Reminder cron:** Check Vercel logs for cron execution within 1 hour window.
8. **Sentry:** Verify errors are being captured.
