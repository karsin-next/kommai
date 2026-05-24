# Kommai Code Conventions

## Naming
- Files: kebab-case (`booking-service.ts`, `whatsapp-webhook.ts`)
- Functions: camelCase (`detectIntent`, `createBooking`)
- Types/Interfaces: PascalCase (`BusinessConfig`, `BookingRecord`)
- Constants: UPPER_SNAKE_CASE (`MAX_FREE_CUSTOMERS`, `DEFAULT_DEPOSIT_AMOUNT`)
- Database tables: snake_case, plural (`businesses`, `bookings`)
- API routes: kebab-case folders (`/api/whatsapp-webhook`)

## Error Handling
- All API routes wrapped in try-catch.
- Catch blocks: log to Sentry, return sanitized error to client.
- Never throw in API routes – always return structured error response.
- External API calls: one retry with 1s exponential backoff.

## Logging
- Structured logging: `{ level, message, context, timestamp }`.
- Log all external API calls (WhatsApp send, Claude intent, Billplz).
- Log all booking state transitions.
- Log all payment webhook events with idempotency keys.

## Testing (Future Phase)
- Unit tests for all service functions.
- Integration test for full booking loop.
- Test WhatsApp webhook with Meta's sample payloads.
