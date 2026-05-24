---
name: enforce-freemium
description: Checks and enforces the 25-customer freemium limit before allowing a booking. Existing customers are never blocked.
---

# Enforce Freemium Skill

## Logic
1. Hash incoming customer phone: `SHA256(phone + SALT)` where SALT is from `FREEMIUM_SALT` env var.
2. Query `customer_uniques` for `(business_id, hashed_phone)`.
3. **If hash EXISTS:**
   - Customer is already known.
   - Allow booking. Do NOT increment count.
   - Return `{ allowed: true, isNew: false }`.
4. **If hash is NEW:**
   - Check `business.plan` and `business.unique_customer_count`.
   - **If plan == 'free' AND current count >= 25:**
     - Block booking.
     - Call `send-upgrade-prompt` skill.
     - Return `{ allowed: false, reason: 'freemium_limit_reached' }`.
   - **Otherwise (paid plan OR count < 25):**
     - Atomic INSERT into `customer_uniques` + INCREMENT `businesses.unique_customer_count`.
     - Return `{ allowed: true, isNew: true, newCount: count + 1 }`.

## Key Principles
- Count NEVER decreases (even if booking is later cancelled or customer never returns).
- Existing customers (#1-25) can ALWAYS book, regardless of current plan.
- On upgrade from free to Pro (RM99/month) or Premium (RM199/month), the limit is permanently removed.
- All operations atomic: use Supabase transaction or `insert + increment` in a single query.
