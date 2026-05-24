---
name: create-api-route
description: Creates a new API route in Kommai.asia following the 3-layer architecture (Route → Service → Data). Use when adding new endpoints.
---

# Create API Route Skill

## Procedure
1. Create route file at `src/app/api/<name>/route.ts`.
2. Route layer handles ONLY: request parsing, input validation, calling service, returning formatted response.
3. Business logic goes in `src/services/<name>.ts`.
4. Data queries through `src/lib/supabase.ts`.
5. Response format: `{ success: boolean, data?: any, error?: string }`.
6. Add rate limiting (configurable via env) if public-facing.
7. Update `docs/API.md` with new endpoint.

## Checklist
- [ ] Input validation on all request body fields
- [ ] Authentication check if applicable
- [ ] Try-catch with Sentry logging
- [ ] Consistent JSON response format
- [ ] Tested with curl or Postman
