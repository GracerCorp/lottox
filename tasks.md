# LOTTOX — Phased Fix Plan

> Derived from `summary.md` code review (22 findings)
> Each phase must be **complete and verified** before moving to the next.
> **Testing goal: 100% code coverage** — unit, integration, and e2e tests for every change.

---

## Phase 0 — Test Infrastructure Setup

> **Goal:** Establish testing foundation so all subsequent phases ship with tests.
> **Verify:** `npm test` runs, coverage report generates, Playwright e2e skeleton works.

- [ ] **0.1 — Install Vitest + Testing Library + MSW**
  - Install: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `msw`
  - Create `vitest.config.ts` with `jsdom` environment, path aliases, coverage config (`istanbul` provider, thresholds: 100%)
  - Create `vitest.setup.ts` with `@testing-library/jest-dom` matchers
  - Add scripts: `"test": "vitest"`, `"test:ci": "vitest run --coverage"`, `"test:watch": "vitest --watch"`
  - **Unit test:** Create `src/__tests__/setup.test.ts` — assert `expect(true).toBe(true)` → confirms runner works
  - **Check:** `npm test` exits 0

- [ ] **0.2 — Install Playwright for E2E**
  - Install: `@playwright/test`
  - Create `playwright.config.ts` with `webServer` pointing to `npm run dev`
  - Configure projects: `chromium`, `firefox`, `webkit`
  - Add script: `"test:e2e": "playwright test"`
  - **E2E test:** Create `e2e/smoke.spec.ts` — load `/`, assert page title contains "LOTTOX"
  - **Check:** `npm run test:e2e` opens browser and passes

- [ ] **0.3 — Set up MSW mock server for API tests**
  - Create `src/__tests__/mocks/handlers.ts` — mock handlers for all `/api/*` routes
  - Create `src/__tests__/mocks/server.ts` — MSW server setup
  - Create `src/__tests__/mocks/fixtures/` — sample DB response JSON for lottery results, countries, news, banners
  - **Unit test:** Create `src/__tests__/mocks/mock.test.ts` — assert mock server intercepts a request correctly
  - **Check:** Mock server starts/stops cleanly in test lifecycle

- [ ] **0.4 — Create Prisma test utilities**
  - Create `src/__tests__/helpers/prisma-mock.ts` — mock `prisma` client using `vitest.mock`
  - Create `src/__tests__/helpers/fixtures.ts` — factory functions for `country`, `lottery`, `lotteryResult`, `article`, `banner` objects
  - **Unit test:** Create `src/__tests__/helpers/fixtures.test.ts` — assert each factory returns valid shape
  - **Check:** Fixtures match Prisma schema types

---

## Phase 1 — Security & Vulnerability Hardening (P0)

> **Goal:** Eliminate all attack vectors and data exposure risks.
> **Verify:** No raw errors leak, all inputs validated, rate limiting active. 100% coverage on all route handlers.

- [ ] **1.1 — Sanitise error responses across all API routes**
  - Files: `api/countries/route.ts`, `api/results/global/route.ts`, `api/statistics/route.ts`
  - Replace `error.message` with generic `"Internal Server Error"`
  - Log full error server-side with `console.error`
  - **Unit tests** (`src/__tests__/api/countries.test.ts`, `global-results.test.ts`, `statistics.test.ts`):
    - ✅ Successful response returns correct JSON shape
    - ✅ Prisma error → returns `{ error: "Internal Server Error" }` with status 500
    - ✅ Error response does NOT contain Prisma/DB details (assert `not.toContain("prisma")`)
    - ✅ `console.error` is called with original error
  - **E2E test** (`e2e/api-error-handling.spec.ts`):
    - ✅ Hit each endpoint → response never contains stack traces
  - **Check:** 100% branch coverage on catch blocks

- [ ] **1.2 — Add Zod validation to unprotected API routes**
  - Files: `api/results/global/route.ts`, `api/countries/route.ts`, `api/statistics/route.ts`
  - Add `page: z.coerce.number().int().min(1).max(1000)` and `limit: z.coerce.number().int().min(1).max(100)`
  - Add type validation for `country`, `period`, `date` params
  - **Unit tests** (`src/__tests__/api/global-results-validation.test.ts`):
    - ✅ Valid params → 200 response
    - ✅ `limit=0` → 400 with Zod error
    - ✅ `limit=999999` → 400 with Zod error
    - ✅ `page=-1` → 400
    - ✅ `page=abc` → 400
    - ✅ `limit=50` → 200 (within bounds)
    - ✅ Missing params → uses defaults (`page=1`, `limit=20`)
    - ✅ `country=xx` (invalid code) → still 200 but empty results (not a Zod concern)
  - **Integration test** (`src/__tests__/integration/api-validation.test.ts`):
    - ✅ Full request cycle with valid/invalid params through Zod → service → response
  - **Check:** Every Zod branch covered (min, max, type coercion, optional, default)

- [ ] **1.3 — Guard `JSON.parse` calls in `lotteryResultService.ts`**
  - Wrap `JSON.parse(article.content)` (lines ~484, ~540) in try/catch
  - Return safe fallback `{}` on parse failure
  - **Unit tests** (`src/__tests__/services/news-service.test.ts`):
    - ✅ Valid JSON content → parsed correctly
    - ✅ Malformed JSON string → returns fallback `{}`, no throw
    - ✅ `null` content → returns fallback `{}`
    - ✅ Already-object content → used as-is
    - ✅ Empty string content → returns fallback `{}`
  - **Check:** 100% coverage on the content parsing branches

- [ ] **1.4 — Add rate limiting middleware**
  - Create `src/middleware.ts` with rate limiting for `/api/*` routes
  - Target: 60 req/min per IP for read endpoints, 10 req/min for `/api/subscribe`
  - **Unit tests** (`src/__tests__/middleware/rate-limit.test.ts`):
    - ✅ Request under limit → passes through (200)
    - ✅ 61st request within 1 min → returns 429
    - ✅ `/api/subscribe` 11th request → returns 429
    - ✅ Different IPs → independent counters
    - ✅ After window expires → counter resets
  - **E2E test** (`e2e/rate-limiting.spec.ts`):
    - ✅ Rapid-fire requests → eventually get 429 response
  - **Check:** Middleware has 100% branch coverage

---

## Phase 2 — Architecture Refactoring (P1)

> **Goal:** Break God-class, eliminate duplication, make code testable.
> **Verify:** All existing API responses remain identical (regression). Full test coverage on new services.

- [ ] **2.1 — Extract shared `formatLotteryResult()` utility**
  - Create `src/lib/services/formatters.ts`
  - Extract the `formatResult` closure (duplicated 4×) into a single exported function
  - Replace all 4 usages in `lotteryResultService.ts`
  - **Unit tests** (`src/__tests__/services/formatters.test.ts`):
    - ✅ Result with verified `chosen_data` → uses `chosen_data`
    - ✅ Result without verification → falls back to `full_data`
    - ✅ Result with `null` lottery → handles gracefully
    - ✅ Result with missing `countries` → `countryCode` is `""`
    - ✅ Result with unknown country code → `type` uses fallback
    - ✅ `showingPrizes` defaults to `[]` when undefined
    - ✅ `drawPeriod` null → `drawNo` is `""`
  - **Integration test** (`src/__tests__/integration/formatter-regression.test.ts`):
    - ✅ Format output matches snapshot of old inline `formatResult` for same input
  - **Check:** Formatter has 100% line + branch coverage

- [ ] **2.2 — Extract shared `slugify()` utility**
  - Move to `src/lib/utils.ts` (already exists)
  - Remove duplicates from `app/page.tsx`, `app/[country]/page.tsx`, `lotteryService.ts`
  - **Unit tests** (`src/__tests__/lib/utils.test.ts`):
    - ✅ `"Thai Government"` → `"thai-government"`
    - ✅ `"หวยลาว"` → `""` (non-latin stripped)
    - ✅ `"Lao--Lotto"` → `"lao-lotto"` (double dash collapsed)
    - ✅ `"--leading--"` → `"leading"` (leading/trailing dashes stripped)
    - ✅ Empty string → `""`
    - ✅ `"UPPER CASE 123"` → `"upper-case-123"`
  - **Check:** 100% coverage on `slugify`

- [ ] **2.3 — Split `ApiClient` into domain services**
  - Create `src/lib/services/resultsService.ts` — `getLatestResults`, `getResultsByType`, `getGlobalResults`, `checkNumber`
  - Create `src/lib/services/newsService.ts` — `getNews`, `getNewsDetail`
  - Create `src/lib/services/statsService.ts` — `getStatsOverview`, `getStatsFrequency`
  - Keep `apiResponse` / `apiError` helpers in `src/lib/services/apiHelpers.ts`
  - Update all API route imports
  - **Unit tests** (one test file per service):
    - `src/__tests__/services/resultsService.test.ts`:
      - ✅ `getLatestResults()` — no filter → returns all verified results
      - ✅ `getLatestResults("thai")` — filters by TH country code
      - ✅ `getLatestResults("UNKNOWN")` — returns unfiltered results
      - ✅ `getResultsByType("thai", 5, 0)` — limit + offset applied
      - ✅ `getResultsByType` — returns `total` count, `latest`, `history`
      - ✅ `getGlobalResults` — pagination, country filter, date filter, period filter
      - ✅ `getGlobalResults` — returns `totalPages` calculation
    - `src/__tests__/services/newsService.test.ts`:
      - ✅ `getNews()` — default pagination
      - ✅ `getNews({ category: "tips" })` — filters by tag
      - ✅ `getNews({ search: "หวย" })` — title search
      - ✅ `getNewsDetail("valid-slug")` — returns full article
      - ✅ `getNewsDetail("missing-slug")` — throws "Article not found"
    - `src/__tests__/services/statsService.test.ts`:
      - ✅ `getStatsOverview` — returns counts from DB
    - `src/__tests__/services/apiHelpers.test.ts`:
      - ✅ `apiResponse(data)` → `{ status: 200 }` with JSON body
      - ✅ `apiError("msg", 400)` → `{ error: "msg" }` with status 400
  - **Integration test** (`src/__tests__/integration/api-regression.test.ts`):
    - ✅ Each API route returns identical JSON shape post-refactor vs snapshot
  - **Check:** All new service files show 100% coverage

- [ ] **2.4 — Implement `checkNumber` (currently stub)**
  - Parse `full_data` JSON prizes array from latest verified result
  - Compare input number against all prize tiers
  - Return matching prize info or `{ win: false }`
  - **Unit tests** (`src/__tests__/services/checkNumber.test.ts`):
    - ✅ Number matches Prize 1 → `{ win: true, prize: "Prize 1", amount: "6000000" }`
    - ✅ Number matches last 2 digits → correct prize returned
    - ✅ Number matches last 3 digits → correct prize returned
    - ✅ Number matches no prize → `{ win: false }`
    - ✅ No result exists for given type → `{ win: false, drawDate: "Unknown" }`
    - ✅ Specific draw date provided → checks that exact draw
    - ✅ Number with leading zeros → handled correctly (e.g., `"007"`)
    - ✅ Invalid type string → `{ win: false }`
  - **Integration test** (`src/__tests__/integration/check-number.test.ts`):
    - ✅ Full API flow: `GET /api/check?number=123456&type=thai` → returns correct JSON
  - **E2E test** (`e2e/ticket-checker.spec.ts`):
    - ✅ Enter winning number in UI → confetti + "ยินดีด้วย" message shown
    - ✅ Enter non-winning number → "เสียใจด้วย" message shown
  - **Check:** 100% branch coverage including edge cases

- [ ] **2.5 — Implement `getStatsFrequency` (currently stub)**
  - Query last N draws, parse `full_data`, aggregate number frequencies
  - Return `{ frequency: Record<string, number>, trends: {...} }`
  - **Unit tests** (`src/__tests__/services/statsFrequency.test.ts`):
    - ✅ 30 draws → frequency map with correct counts
    - ✅ 0 draws → empty frequency map
    - ✅ Custom `draws` param applied (e.g., `draws=5`)
    - ✅ Invalid type → empty result
    - ✅ Numbers sorted by frequency descending
  - **Integration test** (`src/__tests__/integration/stats-frequency.test.ts`):
    - ✅ `GET /api/statistics?type=thai&draws=10` → returns non-empty frequency data
  - **Check:** 100% coverage on aggregation logic

---

## Phase 3 — Rendering & Performance (P2)

> **Goal:** Add caching, fix rendering issues, improve LCP.
> **Verify:** Lighthouse performance score ≥ 80, no visual regressions, tests cover all render paths.

- [ ] **3.1 — Add data caching to API routes & server fetches**
  - Add `export const revalidate = 300` to results API routes (5-min ISR)
  - Wrap `getActiveCountries()` and `getActiveBanners()` in `unstable_cache` with 5-min TTL
  - **Unit tests** (`src/__tests__/services/caching.test.ts`):
    - ✅ Cached function returns same result on second call without hitting Prisma
    - ✅ Cache key includes correct tags
    - ✅ `revalidate` export exists on route modules
  - **Integration test** (`src/__tests__/integration/cache-headers.test.ts`):
    - ✅ API response includes appropriate cache headers
  - **Check:** Cache wrapper has 100% coverage

- [ ] **3.2 — Fix `useEffect` interval leak in `HeroSection.tsx`**
  - Add dependency array `[isPaused]` to the `useEffect` on line 61
  - **Unit tests** (`src/__tests__/components/HeroSection.test.tsx`):
    - ✅ Component mounts → auto-scrolls after 4s
    - ✅ Mouse enter → pauses auto-scroll
    - ✅ Mouse leave → resumes auto-scroll
    - ✅ Prev/Next buttons → change active index
    - ✅ Unmount → `clearInterval` called (no leak)
    - ✅ Empty items → shows fallback message
  - **Check:** No interval leak on mount/unmount cycle (verify with spy on `clearInterval`)

- [ ] **3.3 — Remove debug `console.log` in `useApi.ts`**
  - Remove line 32: `console.log("[useApi Debug]", url, json)`
  - **Unit tests** (`src/__tests__/hooks/useApi.test.ts`):
    - ✅ Successful fetch → returns `{ data, loading: false, error: null }`
    - ✅ Failed fetch → returns `{ data: null, loading: false, error: "..." }`
    - ✅ `url` is `null` → returns `{ data: null, loading: false, error: null }`
    - ✅ `refetch` function re-fetches data
    - ✅ No `console.log` calls (spy on `console.log`, assert not called)
  - **Check:** 100% coverage on `useApi` hook

- [ ] **3.4 — Move hardcoded CMS URL to environment variable**
  - Replace `const EXTERNAL_API = "https://lotto-x-cms.vercel.app"` with `process.env.CMS_API_URL`
  - Add `CMS_API_URL` to `.env.example`
  - **Unit tests** (`src/__tests__/api/subscribe.test.ts`):
    - ✅ Valid email + lotteryId → proxies to CMS URL from env
    - ✅ Invalid email → 400
    - ✅ Missing lotteryId → 400
    - ✅ CMS API returns error → forwards error status
    - ✅ CMS API unreachable → returns 500
    - ✅ `CMS_API_URL` env not set → uses empty string (handled gracefully)
  - **Check:** 100% coverage on subscribe route

- [ ] **3.5 — Move lottery detail data fetch to server side**
  - In `app/[country]/[lottery]/page.tsx`: fetch results server-side, pass as props
  - Remove `useApi` call from `LotteryDetail.tsx`
  - **Unit tests** (`src/__tests__/components/LotteryDetail.test.tsx`):
    - ✅ Renders with pre-fetched data → shows prize numbers
    - ✅ Renders loading skeleton when data is loading
    - ✅ Renders error state when data fetch fails
    - ✅ Thai lottery → shows secondary prize grids
    - ✅ Non-Thai lottery → shows dynamic prizes
  - **Integration test** (`src/__tests__/integration/lottery-page-ssr.test.ts`):
    - ✅ Page HTML contains result data (no empty skeleton)
  - **E2E test** (`e2e/lottery-detail.spec.ts`):
    - ✅ Navigate to `/th/thai-government-lottery` → prize numbers visible immediately (no flash)
    - ✅ Page source contains first prize number (SSR confirmed)
  - **Check:** LotteryDetail component has 100% coverage

- [ ] **3.6 — Add `Suspense` boundaries & route segments**
  - Wrap `HomeResultsSection` in `<Suspense>` with skeleton fallback
  - Add `loading.tsx` to `/`, `/[country]`, `/news`
  - **Unit tests** (`src/__tests__/app/loading.test.tsx`):
    - ✅ Each `loading.tsx` renders a skeleton UI
    - ✅ Skeleton has accessible `aria-busy="true"` attribute
  - **E2E test** (`e2e/loading-states.spec.ts`):
    - ✅ Throttled network → loading skeleton appears before content
    - ✅ Content replaces skeleton (no layout shift)
  - **Check:** All loading/error segments have 100% coverage

---

## Phase 4 — Code Quality & Readability (P3)

> **Goal:** Eliminate type escapes, enforce i18n, reduce bundle size.
> **Verify:** `npm run lint` passes with zero `eslint-disable`, 100% test coverage maintained.

- [ ] **4.1 — Define TypeScript types for prize data structures**
  - Create `src/lib/types/prizes.ts` with `PrizeEntry`, `DrawData`, `VerifiedResult` interfaces
  - Replace all `any` casts in `LotteryDetail.tsx`
  - Remove `eslint-disable @typescript-eslint/no-explicit-any` comments
  - **Unit tests** (`src/__tests__/types/prizes.test.ts`):
    - ✅ Factory for `PrizeEntry` → valid shape
    - ✅ Factory for `DrawData` → valid shape
    - ✅ Type guards (`isPrizeEntry`, `isDrawData`) correctly identify valid/invalid data
  - **Check:** `npm run lint` → zero `any` warnings across typed files

- [ ] **4.2 — Split `LotteryDetail.tsx` into sub-components**
  - Extract `src/lib/services/prizeParser.ts` (data transformation, ~130 lines)
  - Extract `src/components/lottery/SecondaryPrizesSection.tsx`
  - Extract `src/components/lottery/HistoryTable.tsx`
  - Keep main `LotteryDetail.tsx` < 200 lines
  - **Unit tests**:
    - `src/__tests__/services/prizeParser.test.ts`:
      - ✅ Thai result → extracts all 5 prize tiers + running numbers
      - ✅ Lao result → extracts dynamic prizes
      - ✅ Vietnam result → extracts specific prizes
      - ✅ Missing prize data → returns safe defaults
      - ✅ `getPrizeName` → maps all known categories to i18n keys
      - ✅ `getPrizeNumber` → handles array, single value, undefined
      - ✅ `getPrizeAmount` → handles number, string, undefined
    - `src/__tests__/components/SecondaryPrizesSection.test.tsx`:
      - ✅ Renders prize grids with correct column layout
      - ✅ Empty prizes array → renders nothing
    - `src/__tests__/components/HistoryTable.test.tsx`:
      - ✅ Desktop view → table layout
      - ✅ Mobile view → card layout
      - ✅ Date formatting → locale-aware
  - **Check:** Each extracted file has 100% coverage

- [ ] **4.3 — Move hardcoded Thai strings to i18n dictionary**
  - `InteractiveTicketVerifier.tsx`: lines 249, 252, 283, 287, 268 (`"บาท"`)
  - Add keys: `t.common.wonPrize`, `t.common.lostPrize`, `t.common.numberMatched`, `t.common.numberNotMatched`
  - **Unit tests** (`src/__tests__/components/InteractiveTicketVerifier.test.tsx`):
    - ✅ Win result with Thai locale → shows Thai congratulations message
    - ✅ Win result with English locale → shows English congratulations message
    - ✅ Lose result with Thai locale → shows Thai sorry message
    - ✅ Lose result with English locale → shows English sorry message
    - ✅ Currency label uses i18n (not hardcoded `"บาท"`)
    - ✅ Confetti fires on win
    - ✅ Empty input → submit disabled
    - ✅ Date selector → navigates to correct URL
  - **E2E test** (`e2e/i18n-ticket-verifier.spec.ts`):
    - ✅ Switch to EN → verify all labels in English
    - ✅ Switch to TH → verify all labels in Thai
  - **Check:** Zero hardcoded Thai strings in component files

- [ ] **4.4 — Split i18n dictionary into per-locale files**
  - Create `src/lib/locales/th.ts` and `src/lib/locales/en.ts`
  - `i18n.ts` becomes thin re-export with `Dictionary` type definition
  - **Unit tests** (`src/__tests__/lib/i18n.test.ts`):
    - ✅ `th` dictionary has all keys that `en` has (structural match)
    - ✅ `en` dictionary has all keys that `th` has (no missing translations)
    - ✅ No empty string values in either dictionary
    - ✅ `dictionary.th.header.home` → non-empty string
    - ✅ `dictionary.en.header.home` → non-empty string
  - **Check:** Type-safe `Dictionary` type exported, both locales match

- [ ] **4.5 — Optimise banner query with `select`**
  - In `bannerService.ts`: replace `countries: true` with `select` for only needed fields
  - Similarly limit `lottery` fields
  - **Unit tests** (`src/__tests__/services/bannerService.test.ts`):
    - ✅ Returns active banners with expected shape
    - ✅ Inactive banners excluded
    - ✅ Response includes `lottery_results.lottery.countries.code` and `.name`
    - ✅ Response does NOT include unnecessary fields (e.g., `draw_schedule`)
  - **Check:** Banner query only selects required columns

- [ ] **4.6 — Add `error.tsx` route segments**
  - Add `error.tsx` to `/app`, `/app/[country]`, `/app/news`
  - Friendly error UI with retry button
  - **Unit tests** (`src/__tests__/app/error.test.tsx`):
    - ✅ Renders error message
    - ✅ Reset button calls `reset()` function
    - ✅ Accessible error announcement (`role="alert"`)
  - **E2E test** (`e2e/error-boundary.spec.ts`):
    - ✅ Simulated error → error boundary UI shown
    - ✅ Click retry → page reloads
  - **Check:** Error boundaries have 100% coverage

- [ ] **4.7 — Add CORS headers to public API routes**
  - In `src/middleware.ts`: add `Access-Control-Allow-Origin` for API routes
  - Support OPTIONS preflight for `/api/*`
  - **Unit tests** (`src/__tests__/middleware/cors.test.ts`):
    - ✅ API request → response includes `Access-Control-Allow-Origin`
    - ✅ OPTIONS request → returns 204 with correct CORS headers
    - ✅ Non-API routes → no CORS headers added
  - **Integration test** (`src/__tests__/integration/cors.test.ts`):
    - ✅ Cross-origin fetch succeeds
  - **Check:** Middleware CORS logic has 100% coverage

---

## Completion Checklist

After all phases:

- [ ] `npm run build` — zero errors
- [ ] `npm run lint` — zero warnings, zero `eslint-disable` comments
- [ ] `npm run test:ci` — all tests pass, **100% code coverage** (lines, branches, functions, statements)
- [ ] `npm run test:e2e` — all Playwright tests pass across Chromium, Firefox, Webkit
- [ ] Coverage report reviewed — no untested branches or edge cases
- [ ] All API routes return correct JSON (compare with pre-refactor snapshots)
- [ ] Lighthouse: Performance ≥ 80, Accessibility ≥ 90, SEO ≥ 90
- [ ] Manual: Language toggle TH/EN works on all pages
- [ ] Manual: Dark/Light mode works on all pages
- [ ] Manual: Ticket verifier correctly identifies winning numbers

---

## Test File Summary

| Phase | Test Files Created | Type |
| --- | --- | --- |
| **0** | `setup.test.ts`, `mock.test.ts`, `fixtures.test.ts`, `smoke.spec.ts` | Unit, E2E |
| **1** | `countries.test.ts`, `global-results.test.ts`, `statistics.test.ts`, `global-results-validation.test.ts`, `news-service.test.ts`, `rate-limit.test.ts`, `api-error-handling.spec.ts`, `rate-limiting.spec.ts`, `api-validation.test.ts` | Unit, Integration, E2E |
| **2** | `formatters.test.ts`, `utils.test.ts`, `resultsService.test.ts`, `newsService.test.ts`, `statsService.test.ts`, `apiHelpers.test.ts`, `checkNumber.test.ts`, `statsFrequency.test.ts`, `formatter-regression.test.ts`, `api-regression.test.ts`, `check-number.test.ts`, `stats-frequency.test.ts`, `ticket-checker.spec.ts` | Unit, Integration, E2E |
| **3** | `caching.test.ts`, `HeroSection.test.tsx`, `useApi.test.ts`, `subscribe.test.ts`, `LotteryDetail.test.tsx`, `loading.test.tsx`, `cache-headers.test.ts`, `lottery-page-ssr.test.ts`, `lottery-detail.spec.ts`, `loading-states.spec.ts` | Unit, Integration, E2E |
| **4** | `prizes.test.ts`, `prizeParser.test.ts`, `SecondaryPrizesSection.test.tsx`, `HistoryTable.test.tsx`, `InteractiveTicketVerifier.test.tsx`, `i18n.test.ts`, `bannerService.test.ts`, `error.test.tsx`, `cors.test.ts`, `i18n-ticket-verifier.spec.ts`, `error-boundary.spec.ts`, `cors.test.ts` | Unit, Integration, E2E |
| **Total** | **~45 test files** | |
