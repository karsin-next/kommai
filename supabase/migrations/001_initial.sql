-- INITIAL SCHEMA FOR KOMMAI.ASIA

-- 1. Businesses
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    owner_phone TEXT NOT NULL UNIQUE,
    whatsapp_phone TEXT NOT NULL UNIQUE,
    google_sheet_id TEXT,
    plan TEXT DEFAULT 'free', -- 'free', 'pro', 'premium'
    plan_status TEXT DEFAULT 'active', -- 'active', 'past_due', 'canceled'
    unique_customer_count INTEGER DEFAULT 0,
    config JSONB DEFAULT '{
        "services": [],
        "operating_hours": {"open": "10:00", "close": "22:00"},
        "deposit_required": true,
        "deposit_amount_rm": 30,
        "auto_confirm": true,
        "reminder_hours_before": 24,
        "language": "en"
    }',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_name TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'canceled'
    deposit_status TEXT DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
    billplz_bill_id TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Customer Uniques (for Freemium enforcement)
CREATE TABLE customer_uniques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone_hash TEXT NOT NULL,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, customer_phone_hash)
);

-- 4. Referral Program
CREATE TABLE referral_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) UNIQUE,
    code TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_business_id UUID REFERENCES businesses(id),
    referred_business_id UUID REFERENCES businesses(id) UNIQUE,
    referral_code TEXT REFERENCES referral_codes(code),
    status TEXT DEFAULT 'pending', -- 'pending', 'completed'
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id),
    amount_rm DECIMAL(10, 2) NOT NULL,
    reason TEXT NOT NULL,
    source_referral_id UUID REFERENCES referrals(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Webhook Events (Idempotency)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    result JSONB,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. RPC Functions
CREATE OR REPLACE FUNCTION increment_customer_count(biz_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE businesses
    SET unique_customer_count = unique_customer_count + 1
    WHERE id = biz_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Views
CREATE OR REPLACE VIEW business_credit_balances AS
SELECT 
    business_id,
    SUM(amount_rm) as available_balance,
    SUM(CASE WHEN amount_rm > 0 THEN amount_rm ELSE 0 END) as total_earned
FROM credits
GROUP BY business_id;

-- 8. RLS Policies (Basic)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read for Businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Owner Access" ON businesses FOR ALL USING (auth.uid() = owner_id);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner Access Bookings" ON bookings FOR ALL USING (
  business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
);

-- Indices
CREATE INDEX idx_bookings_business_date ON bookings(business_id, booking_date);
CREATE INDEX idx_customer_uniques_hash ON customer_uniques(business_id, customer_phone_hash);
