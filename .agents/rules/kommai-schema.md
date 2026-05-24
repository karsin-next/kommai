# Kommai.asia Database Schema

**Rule:** Any schema change must create a migration in `supabase/migrations/` AND update this file.

## Table: businesses
| Column | Type | Description |
|:---|:---|:---|
| id | UUID (PK) | Business unique ID |
| name | TEXT | Business name |
| owner_name | TEXT | Owner's full name |
| owner_phone | TEXT | Owner's WhatsApp (for hot lead alerts) |
| whatsapp_phone | TEXT | Business WhatsApp number (API-connected) |
| config | JSONB | Service catalog, hours, deposit rules (see structure below) |
| plan | TEXT | 'free', 'pro', 'premium' |
| plan_status | TEXT | 'active', 'past_due', 'cancelled' |
| unique_customer_count | INTEGER | Lifetime unique customers (never decreases) |
| google_sheet_id | TEXT | Google Sheet ID for booking export |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

## Table: bookings
| Column | Type | Description |
|:---|:---|:---|
| id | UUID (PK) | Booking unique ID |
| business_id | UUID (FK → businesses.id) | Which business |
| customer_name | TEXT | |
| customer_phone | TEXT | Raw phone (hashed for uniqueness separately) |
| service_name | TEXT | Matched from businessConfig |
| booking_date | DATE | |
| booking_time | TIME | |
| deposit_status | TEXT | 'pending_deposit', 'paid', 'expired', 'refunded' |
| billplz_bill_id | TEXT | Billplz transaction reference (idempotency key) |
| reminder_sent | BOOLEAN | Default false |
| status | TEXT | 'confirmed', 'cancelled', 'completed', 'no_show' |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

## Table: customer_uniques (Freemium Tracking)
| Column | Type | Description |
|:---|:---|:---|
| business_id | UUID (FK) | |
| customer_phone_hash | TEXT | SHA256(phone + salt from env) |
| first_seen | TIMESTAMPTZ | |
| PRIMARY KEY | (business_id, customer_phone_hash) | |

## businessConfig JSON Structure
```json
{
  "services": [
    {
      "name": "Traditional Massage",
      "duration_minutes": 60,
      "price_rm": 120
    }
  ],
  "operating_hours": {
    "open": "10:00",
    "close": "22:00"
  },
  "deposit_required": true,
  "deposit_amount_rm": 30,
  "auto_confirm": true,
  "reminder_hours_before": 24,
  "language": "bm"
}
```

## Table: webhook_events (Idempotency)
| Column | Type | Description |
|:---|:---|:---|
| id | UUID (PK) | |
| event_id | TEXT (UNIQUE) | External event ID (e.g., Billplz bill ID, WhatsApp message ID) |
| event_type | TEXT | 'whatsapp_message', 'billplz_payment', etc. |
| processed_at | TIMESTAMPTZ | When first processed |
| result | JSONB | Processing result for replay detection |

## Table: referral_codes
| Column | Type | Description |
|:---|:---|:---|
| id | UUID PK | |
| business_id | UUID FK → businesses.id | Owner of the code |
| code | TEXT UNIQUE | e.g., `KOMREF-A1B2C3` |
| is_active | BOOLEAN default true | |
| created_at | TIMESTAMPTZ | |

## Table: referrals
| Column | Type | Description |
|:---|:---|:---|
| id | UUID PK | |
| referrer_business_id | UUID FK | Who shared the code |
| referred_business_id | UUID FK | Who signed up using the code |
| referral_code | TEXT | The code used |
| status | TEXT | 'pending', 'completed' |
| completed_at | TIMESTAMPTZ | When reward was credited |
| created_at | TIMESTAMPTZ | |

## Table: credits
| Column | Type | Description |
|:---|:---|:---|
| id | UUID PK | |
| business_id | UUID FK | |
| amount_rm | DECIMAL | e.g., 79.00 |
| reason | TEXT | 'referral_reward', 'referred_friend_reward', 'manual' |
| source_referral_id | UUID nullable | Link to the referral row |
| applied_invoice_id | UUID nullable | When credit was consumed |
| created_at | TIMESTAMPTZ | |
| expires_at | TIMESTAMPTZ | nullable |
