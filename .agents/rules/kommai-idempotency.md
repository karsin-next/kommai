# Webhook Idempotency Standard

## Purpose
Prevent duplicate processing of webhook events. Every external event must be processed exactly once, even if the webhook is retried by the sender.

## Idempotency Keys by Source
| Source | Idempotency Key | Source Field |
|:---|:---|:---|
| WhatsApp | Message ID | `entry[0].changes[0].value.messages[0].id` |
| Billplz | Bill ID | `payload.bill_id` |

## Processing Flow
1. Extract `event_id` and `event_type` from incoming webhook payload.
2. Query `webhook_events` table: `SELECT * WHERE event_id = <extracted_id>`.
3. **If record exists:**
   - Return HTTP 200 immediately.
   - Response body = stored `result` JSONB from the original processing.
   - Do NOT execute any business logic.
4. **If record does NOT exist:**
   - Insert new row: `{ event_id, event_type, processed_at: now(), result: null }`.
   - Execute business logic (payment processing, message handling, etc.).
   - Update `result` column with processing outcome.
   - Return HTTP 200 with result.

## Database
Uses `webhook_events` table defined in `kommai-schema.md`:
- `event_id` (UNIQUE constraint enforces idempotency at DB level)
- `event_type`
- `processed_at`
- `result` (JSONB)

## Error Handling
- If business logic fails after INSERT but before UPDATE of `result`: the event is recorded as processed (no duplicate), but the failure is logged to Sentry. Manual review may be needed.
- If INSERT fails due to UNIQUE constraint violation (race condition): retry from step 2 (query will now find the record).

## Testing
- Send same webhook payload twice → second call returns 200 with original result, no side effects.
- Verify only one booking/payment state change per event.
