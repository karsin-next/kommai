---
name: add-payment-gateway
description: Integrates a new payment gateway (Billplz, Rabbit Gateway, Midtrans) using the common PaymentGateway interface.
---

# Add Payment Gateway Skill

## Common Interface
```typescript
interface PaymentGateway {
  createPaymentLink(amount: number, currency: string, metadata: Record<string, any>): Promise<string>;
  verifyPayment(paymentId: string): Promise<PaymentStatus>;
}

type PaymentStatus = 'pending' | 'paid' | 'expired' | 'failed';
```

## Procedure
1. Create gateway class in `src/services/<gateway>.ts` implementing `PaymentGateway`.
2. Register gateway in `PaymentRouter` (country-based selection).
3. Create webhook handler at `src/app/api/<gateway>-webhook/route.ts`.
4. Add required env vars to `.env.example`.
5. Implement idempotency per `.agents/rules/kommai-idempotency.md`.
6. Test in sandbox mode before production.
7. Update `docs/API.md`.
