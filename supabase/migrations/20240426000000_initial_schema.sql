-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: businesses
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_name TEXT,
    owner_phone TEXT NOT NULL,
    whatsapp_phone TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    plan TEXT DEFAULT 'free',
    plan_status TEXT DEFAULT 'active',
    unique_customer_count INTEGER DEFAULT 0,
    google_sheet_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_name TEXT,
    customer_phone TEXT NOT NULL,
    service_name TEXT,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    deposit_status TEXT DEFAULT 'pending_deposit',
    billplz_bill_id TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: customer_uniques (Freemium Tracking)
CREATE TABLE customer_uniques (
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone_hash TEXT NOT NULL,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (business_id, customer_phone_hash)
);

-- Table: webhook_events (Idempotency)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW(),
    result JSONB
);

-- RLS Policies (as per supabase/rls.md)

-- Enable RLS
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_uniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Businesses Policies
CREATE POLICY "Businesses see only their own row" ON businesses
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "New signup creates own row" ON businesses
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Businesses update their own row" ON businesses
    FOR UPDATE USING (auth.uid() = id);

-- Bookings Policies
CREATE POLICY "Businesses see their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = business_id);

-- Note: INSERT/UPDATE for bookings, customer_uniques, webhook_events are restricted to service_role in the rls.md.
-- In Supabase, service_role bypasses RLS by default.
-- If we want to be explicit:
-- CREATE POLICY "Service role only" ON bookings FOR ALL USING (false); -- This would block even service_role if not careful.
-- Actually, the standard way is to enable RLS and just not add policies for other roles.

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to increment unique_customer_count atomically
CREATE OR REPLACE FUNCTION increment_unique_customer_count(biz_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE businesses
    SET unique_customer_count = unique_customer_count + 1
    WHERE id = biz_id;
END;
$$ LANGUAGE plpgsql;
