# 🔍 LOTTOX — Senior Engineering Code Review

> Reviewed: 2026-03-13 · Reviewer: Senior Software Engineer (Next.js specialist)
> Scope: Architecture, Readability, Rendering, Query, Vulnerability, Security, Optimisation

---

## 📊 Overall Score

| Area | Score | Verdict |
| --- | :---: | --- |
| Architecture | 5/10 | God-class pattern, duplicated logic, no clear domain boundaries |
| Code Readability | 4/10 | 20+ `eslint-disable`, massive files, `any` everywhere |
| Rendering Performance | 6/10 | Good Server Component usage, but missing caching and lazy loading |
| Query Performance | 5/10 | N+1 risk, no result caching, unbound pagination |
| Vulnerability | 3/10 | Raw error leaks, unvalidated params, unguarded JSON.parse |
| Security | 3/10 | No rate limiting, no CORS, API key in env without rotation |
| Optimisation | 5/10 | No Suspense, no ISR/cache, large client bundles |

---

## 🚨 Priority List (Highest → Lowest)

### P0 — Critical (Fix Immediately)

#### 1. Raw Error Messages Leaked to Clients
**Files:** `api/countries/route.ts`, `api/results/global/route.ts`, `api/statistics/route.ts`

```ts
// ❌ Current — Prisma stack traces sent to browser
catch (error: any) {
  return NextResponse.json({ error: error.message }, { status: 500 });
}
```

**Risk:** Internal DB schema, table names, and connection details exposed.
**Fix:** Return generic error; log full error server-side only.

---

#### 2. Unvalidated Pagination — Denial of Service Vector
**File:** `api/results/global/route.ts`

```ts
// ❌ No upper bound — attacker can request limit=999999
const limit = parseInt(searchParams.get("limit") || "20", 10);
```

**Risk:** Single request can exhaust DB connections and memory.
**Fix:** Zod validation with `z.number().int().min(1).max(100)`.

---

#### 3. No Rate Limiting on Any API Route
**Files:** All 10 `route.ts` files

**Risk:** Brute-force attacks, scraping, and denial of service.
**Fix:** Add rate limiting middleware (e.g., `next-rate-limit`, Vercel rate-limit headers, or Upstash Redis).

---

#### 4. Unguarded `JSON.parse` — Crash on Malformed Data
**File:** `lotteryResultService.ts` (lines 483–485, 539–541)

```ts
// ❌ Will throw uncaught exception on invalid JSON
const contentData = typeof article.content === "string"
  ? JSON.parse(article.content)   // 💥 no try/catch
  : (article.content as Record<string, unknown>) || {};
```

**Fix:** Wrap in try/catch or use Zod `.safeParse()`.

---

### P1 — High (Fix This Sprint)

#### 5. God-Class `ApiClient` (605 lines, 11 methods)
**File:** `lotteryResultService.ts`

The single `ApiClient` class handles results, countries, news, statistics, and number checking. This violates SRP and makes testing nearly impossible.

**Fix:** Split into domain services: `ResultsService`, `CountryService`, `NewsService`, `StatsService`.

---

#### 6. `formatResult` Duplicated 4× (Lines 69, 149, 249, 410+)
**File:** `lotteryResultService.ts`

Four near-identical `formatResult` closures with the same type signature and logic, redefined inside each method.

**Fix:** Extract to a single shared `formatLotteryResult()` utility.

---

#### 7. `LotteryDetail.tsx` — 939-Line Monolith Component
**File:** `components/lottery/LotteryDetail.tsx`

A single `"use client"` file with:
- 20+ `eslint-disable @typescript-eslint/no-explicit-any`
- Inline data parsing logic that belongs in the service layer
- Hardcoded Thai strings (e.g., `"ยินดีด้วย! คุณถูกรางวัล"`) bypassing i18n
- Prize extraction logic duplicated with `thaiSecondaryPrizes` array

**Fix:** Extract to: `PrizeParser` utility, `PrizeGrid` component, `HistoryTable` component. Move all strings to `i18n.ts`.

---

#### 8. `checkNumber` Is a Stub — Always Returns `false`
**File:** `lotteryResultService.ts` (line 324)

```ts
const isWin = false;  // ← hardcoded, never actually checks
```

**Risk:** Core user feature is non-functional. Users will believe their tickets never win.
**Fix:** Implement proper check against `full_data` prizes JSON.

---

#### 9. `getStatsFrequency` Is a Stub — Returns Empty Object
**File:** `lotteryResultService.ts` (lines 585–592)

```ts
return { frequency: {}, trends: {} };  // ← no implementation
```

**Fix:** Implement aggregation over `lottery_results.full_data` to compute actual frequencies.

---

### P2 — Medium (Plan for Next Sprint)

#### 10. Zero Data Caching — Every Page Hit Goes to DB

No use of:
- `unstable_cache` / `next.revalidate` (Next.js data cache)
- `Cache-Control` headers on API routes
- Static generation / ISR for results pages

**Impact:** Lottery results change only 2-3x per month per country. Every visitor triggers fresh DB queries.

**Fix:**
```ts
// Add to API routes
export const revalidate = 300; // 5 min ISR

// Or per-query
import { unstable_cache } from "next/cache";
const getCachedResults = unstable_cache(
  async () => apiClient.getLatestResults(),
  ["latest-results"],
  { revalidate: 300 }
);
```

---

#### 11. `useEffect` Without Dependency Array — Interval Leak
**File:** `HeroSection.tsx` (line 61–64)

```ts
// ❌ Runs on EVERY render — creates new interval each time
useEffect(() => {
  startAutoScroll();
  return () => stopAutoScroll();
}); // ← missing [isPaused, displayItems.length]
```

**Fix:** Add proper dependency array `[isPaused]`.

---

#### 12. `useApi` Hook Logs All Responses to Console
**File:** `hooks/useApi.ts` (line 32)

```ts
console.log("[useApi Debug]", url, json);  // ← left in production code
```

**Fix:** Remove debug log or gate behind `process.env.NODE_ENV`.

---

#### 13. `slugify` Function Duplicated in 3 Files
**Files:** `app/page.tsx`, `app/[country]/page.tsx`, `lotteryService.ts`

Same implementation copy-pasted.

**Fix:** Export from a single `utils.ts` and import.

---

#### 14. Client-Side Data Fetching for Main Content
**File:** `LotteryDetail.tsx` — Uses `useApi` hook for primary page content

```ts
const { data, loading, error } = useApi<ResultsByTypeResponse>(
  `${apiEndpoint}?limit=10`,
);
```

**Impact:** First paint shows skeleton, then waterfall fetch. Bad for SEO and LCP.

**Fix:** Fetch data server-side in `[country]/[lottery]/page.tsx` and pass as props.

---

#### 15. `subscribe/route.ts` — Hardcoded External CMS URL
**File:** `api/subscribe/route.ts` (line 6)

```ts
const EXTERNAL_API = "https://lotto-x-cms.vercel.app";
```

**Fix:** Move to `process.env.CMS_API_URL`.

---

### P3 — Low (Backlog / Quality of Life)

#### 16. Excessive `eslint-disable` Suppression
**File:** `LotteryDetail.tsx` — 20+ instances of `@typescript-eslint/no-explicit-any`

**Fix:** Define proper TypeScript interfaces for prize data (`PrizeEntry`, `DrawData`).

---

#### 17. `bannerService.ts` — Deeply Nested `include` With No `select`
**File:** `bannerService.ts`

```ts
include: {
  lottery_results: {
    include: {
      lottery: {
        include: {
          countries: true,  // ← fetches ALL columns
        },
      },
    },
  },
},
```

**Fix:** Use `select` to limit to `name`, `code` only.

---

#### 18. No `Suspense` Boundaries for Streaming
**File:** `app/page.tsx`, `app/[country]/page.tsx`

Server Components do async data fetching but without `<Suspense>` wrappers, so no streaming or progressive rendering.

**Fix:** Wrap data-heavy sections in `<Suspense fallback={<Skeleton />}>`.

---

#### 19. `InteractiveTicketVerifier` — Hardcoded Thai in Result Messages
**File:** `InteractiveTicketVerifier.tsx` (lines 249–256, 283–291)

```tsx
<h4>ยินดีด้วย! คุณถูกรางวัล</h4>  // ← Thai only, ignores i18n
<h4>เสียใจด้วยนะ</h4>               // ← Thai only
```

**Fix:** Use `t.common.wonPrize` and `t.common.lostPrize` from the dictionary.

---

#### 20. Missing `loading.tsx` and `error.tsx` Route Segments
**Files:** None exist in any route folder

Next.js App Router supports `loading.tsx` for automatic `<Suspense>` and `error.tsx` for error boundaries. Neither is used.

**Fix:** Add `loading.tsx` with skeleton UI in key routes (`/`, `/[country]`, `/news`).

---

#### 21. No CORS Headers on API Routes
**Files:** All API routes

The APIs have no Access-Control headers. If consumed by external clients (mobile app, partner integrations), they will fail on CORS preflight.

**Fix:** Add middleware or per-route CORS headers for public-facing APIs.

---

#### 22. i18n Dictionary Is 916 Lines in a Single File
**File:** `lib/i18n.ts`

A single file with both `th` and `en` dictionaries makes it hard to maintain and increases the client bundle.

**Fix:** Split into `locales/th.ts` and `locales/en.ts`, lazy-load the active locale.

---

## 📋 Summary Table by Priority

| # | Issue | Area | Priority | Effort |
| --- | --- | --- | :---: | :---: |
| 1 | Raw error leak to client | Security | P0 | S |
| 2 | Unvalidated pagination params | Vulnerability | P0 | S |
| 3 | No rate limiting | Security | P0 | M |
| 4 | Unguarded `JSON.parse` | Vulnerability | P0 | S |
| 5 | God-class `ApiClient` | Architecture | P1 | L |
| 6 | `formatResult` duplicated 4× | Readability | P1 | S |
| 7 | 939-line monolith component | Readability | P1 | L |
| 8 | `checkNumber` stub | Vulnerability | P1 | M |
| 9 | `getStatsFrequency` stub | Architecture | P1 | M |
| 10 | Zero data caching | Performance | P2 | M |
| 11 | `useEffect` interval leak | Rendering | P2 | S |
| 12 | Debug `console.log` in production | Security | P2 | S |
| 13 | `slugify` duplicated 3× | Readability | P2 | S |
| 14 | Client-side fetch for main content | Rendering/SEO | P2 | M |
| 15 | Hardcoded external CMS URL | Security | P2 | S |
| 16 | 20+ `eslint-disable any` | Readability | P3 | M |
| 17 | Banner query over-fetching | Query | P3 | S |
| 18 | No `Suspense` boundaries | Rendering | P3 | M |
| 19 | Hardcoded Thai in i18n component | Readability | P3 | S |
| 20 | Missing `loading.tsx`/`error.tsx` | Rendering | P3 | S |
| 21 | No CORS headers | Security | P3 | S |
| 22 | 916-line i18n single file | Optimisation | P3 | M |

> **Effort key:** S = hours, M = 1–2 days, L = 3–5 days

---

## ✅ What's Done Well

- ✅ **Prisma singleton** pattern is correct — no connection pool leak
- ✅ **Zod validation** on some routes (`/check`, `/results/latest`, `/subscribe`)
- ✅ **Server Components** used correctly for country pages and home
- ✅ **Dynamic routing** via `[country]/[lottery]` is clean
- ✅ **Dark mode** with `next-themes` and system detection
- ✅ **SEO metadata** including OpenGraph, Twitter, robots, canonical
- ✅ **Proper Next.js Image** component with `sizes` prop
- ✅ **Input sanitisation** on ticket verifier (`/\D/g` strip)
