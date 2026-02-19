# Security Analysis: API Layer

## Overview
We analyzed the communication flow between the Client (Browser) and the Next.js API Routes (Server-Side Proxy) for potential vulnerabilities.

## 1. Rate Limiting (Missing) -> **[HIGH RISK]**
- **Current Status**: No rate limiting implementation found.
- **Risk**:
  - **DoS/Spam**: Malicious users can flood your API routes (`/api/check`, `/api/results/*`), which in turn floods the External CMS API.
  - **Cost/Quotas**: If the External API has rate limits or usage costs, a single attacker can exhaust your quota.
- **Recommendation**: Implement `middleware.ts` with a Rate Limiter (e.g., handling 20-60 requests/minute per IP).

## 2. Input Validation (Weak) -> **[MEDIUM RISK]**
- **Current Status**: Inputs like `type`, `limit`, `slug` are passed directly to the External API without strict validation.
  - Example: `/api/results/latest?type=<script>...`
- **Risk**:
  - While `URLSearchParams` handles basic encoding, invalid inputs might cause unexpected behavior or errors from the External API.
  - "Garbage in, Garbage out" principle.
- **Recommendation**: Use **Zod** schema validation in API routes to ensure inputs match expected formats (e.g., `type` must be `THAI | LAO | VIETNAM...`).

## 3. Error Handling (Information Leakage) -> **[MEDIUM RISK]**
- **Current Status**: API routes catch errors and return `error.message` directly to the client.
  ```typescript
  return NextResponse.json({ error: error.message }, { status: 500 });
  ```
- **Risk**: If the External API returns detailed technical errors (stack traces, internal paths, SQL fragments), these are exposed to the public user.
- **Recommendation**: Log the detailed error on the server console, but return a generic message to the client (e.g., "Failed to fetch data") unless it's a specific user-validatable error.

## 4. Origin/CORS (Default) -> **[LOW RISK]**
- **Current Status**: Standard Next.js same-origin policy for API routes.
- **Risk**: Other sites could theoretically fetch your public data if not restricted, though usually Next.js handles this well for internal APIs.
- **Recommendation**: In `middleware.ts`, verify the `Referer` or `Origin` header to ensure requests come from your own frontend (optional, but good for anti-scraping).

## 5. Authentication (Secure) -> **[PASS]**
- **Status**: `API_KEY` is safely stored in `.env` and only used server-side in `api-client.ts`. It is **NOT** exposed to the client.
