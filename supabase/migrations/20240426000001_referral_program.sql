-- Migration: Referral Program Tables
-- Description: Adds tables for tracking referral codes, referral relationships, and account credits.

-- 1. Referral Codes (Unique per business)
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(business_id)
);

-- 2. Referrals (Tracking relationship)
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_business_id UUID NOT NULL REFERENCES businesses(id),
    referred_business_id UUID NOT NULL REFERENCES businesses(id),
    referral_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed'
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Anti-gaming: One referral per referred business
    UNIQUE(referred_business_id)
);

-- 3. Credits (Account balance and audit trail)
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    amount_rm DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL, -- 'referral_reward', 'referred_friend_reward', 'manual'
    source_referral_id UUID REFERENCES referrals(id),
    applied_invoice_id UUID, -- Null until consumed by an invoice
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ -- Null for non-expiring
);

-- 4. Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_business_id);
CREATE INDEX IF NOT EXISTS idx_credits_business ON credits(business_id);

-- 5. Helper function for credit balance (read-only calculation)
CREATE OR REPLACE VIEW business_credit_balances AS
SELECT 
    business_id,
    COALESCE(SUM(amount_rm), 0) as total_earned,
    COALESCE(SUM(CASE WHEN applied_invoice_id IS NULL THEN amount_rm ELSE 0 END), 0) as available_balance
FROM credits
GROUP BY business_id;
