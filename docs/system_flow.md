# System Flow - API Integration

```
Client (Browser)
   |
   | fetch("/api/results/latest")
   | fetch("/api/results/thai")
   | fetch("/api/results/lao")
   | fetch("/api/results/global")
   | fetch("/api/check")
   | fetch("/api/news")
   | fetch("/api/statistics")
   | fetch("/api/countries")
   |
   v
Self API (Next.js API Routes)
   |  src/app/api/results/latest/route.ts
   |  src/app/api/results/[type]/route.ts
   |  src/app/api/results/global/route.ts
   |  src/app/api/check/route.ts
   |  src/app/api/news/route.ts
   |  src/app/api/statistics/route.ts
   |  src/app/api/countries/route.ts
   |
   | Authorization: Bearer <API_KEY from .env>
   |
   v
External API (https://lotto-x-cms.vercel.app/api)
   |  /results/latest
   |  /results/{type}
   |  /results/global
   |  /check
   |  /news
   |  /statistics/overview
   |  /countries
   |
   v
Database (Lotto-X CMS)
```

## Data Flow

1. **Client -> Self API**: Frontend components use `useApi` hook to call internal API routes (no API key needed from browser).
2. **Self API -> External API**: `src/lib/api-client.ts` adds `Authorization: Bearer <API_KEY>` from `.env` and proxies the request.
3. **External API -> Self API**: Response is forwarded back to the client.
4. **Caching**: Each endpoint uses Next.js `revalidate` for appropriate cache durations (60s for results, 1h for countries/stats, 5m for news).

## Key Files

| File | Purpose |
|---|---|
| `src/lib/api-client.ts` | Centralized fetch wrapper for External API |
| `src/lib/api-types.ts` | TypeScript type definitions |
| `src/lib/hooks/useApi.ts` | React hook for client-side data fetching |
| `src/app/api/*/route.ts` | Next.js API route handlers (proxy) |
