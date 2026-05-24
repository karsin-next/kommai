# Booking & Payment State Machine

## Booking Statuses
| Status | Meaning | Allowed From | Allowed To |
|:---|:---|:---|:---|
| `confirmed` | Booking created, not yet completed | (initial) | `cancelled`, `completed`, `no_show` |
| `completed` | Customer attended | `confirmed` | (terminal) |
| `no_show` | Customer didn't show up | `confirmed` | (terminal) |
| `cancelled` | Booking cancelled | `confirmed` | (terminal) |

## Deposit Statuses
| Status | Meaning | Allowed From | Allowed To |
|:---|:---|:---|:---|
| `pending_deposit` | Payment link sent, awaiting payment | (initial) | `paid`, `expired` |
| `paid` | Payment received and verified | `pending_deposit` | `refunded` |
| `expired` | Payment link expired without payment | `pending_deposit` | (terminal) |
| `refunded` | Payment refunded to customer | `paid` | (terminal) |

## Critical Transition Rules

### When deposit expires (`pending_deposit` → `expired`):
- Deposit status becomes `expired`.
- Booking status remains `confirmed` (the slot is still held).
- Do NOT auto-cancel the booking. The business owner decides whether to cancel or hold the slot.
- Rationale: Some businesses want to hold slots even without deposit; deposit expiry is a flag, not a cancellation trigger.

### When payment succeeds (`pending_deposit` → `paid`):
- Deposit status becomes `paid`.
- Booking status stays `confirmed`.
- Send WhatsApp confirmation to customer.
- Update Google Sheets export.

### When cancelling a booking:
- Allowed from `confirmed` status only.
- If deposit_status is `paid`, a refund must be initiated before cancellation.
- If deposit_status is `pending_deposit`, cancel directly.
- Booking status → `cancelled` (terminal).

### When marking no-show:
- Allowed from `confirmed` status only, after appointment time has passed.
- Booking status → `no_show` (terminal).
- Deposit is NOT auto-refunded (per business policy; configurable later).

### Billplz Webhook Idempotency:
- Use `billplz_bill_id` as the idempotency key.
- If `billplz_bill_id` already exists in `webhook_events`, return 200 with stored result. Do not process again.
- If new: process payment, create `webhook_events` record, update booking deposit_status.
