# 🔍 LOTTOX — Engineering Code Review

> Reviewed: April 2026 · Scope: Architecture, Security, Rendering, Performance, Code Quality

---

## 📊 Overall Score

| Area | Score | Verdict |
| --- | :---: | --- |
| Architecture | 7/10 | Services split by domain; some `any` casts remain in result service |
| Code Readability | 6/10 | Typography utilities, error handler extracted; some large components remain |
| Rendering Performance | 7/10 | Server Components, ISR revalidation on key routes, Suspense on root |
| Query Performance | 6/10 | Zod-validated pagination with bounds, some `$queryRaw` usage |
| Security | 7/10 | Rate limiting, CSRF origin validation, Zod on all routes, generic error responses |
| Vulnerability | 6/10 | JSON.parse guarded in news service; some `any` casts in result formatting |
| Optimisation | 6/10 | ISR 5-min on data routes; fluid typography; SW registered |

---

## ✅ What's Done Well

- ✅ **Prisma singleton** pattern — no connection pool leak
- ✅ **Zod validation** on all API routes (check, results, statistics, subscribe, analytics)
- ✅ **Rate limiting** via `proxy.ts` middleware (100/300/10 req/min tiers)
- ✅ **CSRF origin validation** on mutating requests
- ✅ **Generic error handler** (`apiErrorHandler.ts`) — raw errors never leak to clients
- ✅ **Services split by domain** — `lotteryResultService`, `newsService`, `statisticsService`, `countryService`, `bannerService`, `lotteryService`
- ✅ **Server Components** used correctly for country pages and home
- ✅ **Dynamic routing** via `[country]/[lottery]/[date]` is clean
- ✅ **ISR revalidation** (`revalidate = 300`) on countries, lotteries, results, statistics
- ✅ **Dark mode** with `next-themes` and system detection
- ✅ **SEO metadata** including OpenGraph, Twitter, robots, canonical, JSON-LD
- ✅ **Custom 404 page** with brand styling
- ✅ **Error boundaries** — `error.tsx`, `global-error.tsx`, `ErrorBoundary` component
- ✅ **Skip-to-content** link for accessibility
- ✅ **`HtmlLangSync`** — dynamic `<html lang>` based on selected language
- ✅ **Breadcrumb** component with proper navigation context
- ✅ **Fluid typography** — `clamp()`-based scale, no breakpoint jumps
- ✅ **Semantic typography utilities** — `typographyUtils.ts` prevents ad-hoc sizing
- ✅ **Cookie consent** banner for GDPR compliance
- ✅ **PWA** with service worker (Serwist) and web manifest
- ✅ **Sentry** integration for client + server + edge error monitoring
- ✅ **Visitor analytics** tracking via dedicated API endpoint
- ✅ **Country-specific number validation** (`lotteryValidation.ts`)
- ✅ **Input sanitisation** on ticket verifier
- ✅ **355 passing tests** across 49 test files

---

## 🟡 Remaining Improvements

### P1 — High (Next Sprint)

| # | Issue | Area | Effort |
| --- | --- | --- | :---: |
| 1 | `LotteryDetail.tsx` is ~800 lines — extract prize parser, history table | Readability | L |
| 2 | Some `eslint-disable @typescript-eslint/no-explicit-any` in result service | Type Safety | M |
| 3 | `checkNumber` win logic relies on `full_data` JSON matching — needs more edge-case tests | Correctness | M |
| 4 | No `Suspense` boundaries on nested data sections (country, news) | Rendering | M |
| 5 | Test coverage at 43% — target ≥ 60% for core services and components | Quality | L |

### P2 — Medium (Planned)

| # | Issue | Area | Effort |
| --- | --- | --- | :---: |
| 6 | `lotteryResultService.ts` is 24KB — could benefit from further splitting | Architecture | L |
| 7 | No `select` optimisation on some Prisma includes (banner, article) | Query Perf | S |
| 8 | Some hardcoded Thai text in `InteractiveTicketVerifier` result messages | i18n | S |
| 9 | No `prefers-reduced-motion` on confetti and bounce animations | A11Y | S |
| 10 | Hero carousel auto-scroll could use `prefers-reduced-motion` check | A11Y | S |

### P3 — Low (Backlog)

| # | Issue | Area | Effort |
| --- | --- | --- | :---: |
| 11 | No `hreflang` tags for TH/EN alternate pages | SEO | S |
| 12 | No JSON-LD breadcrumb on deep pages | SEO | S |
| 13 | No per-lottery OG images (uses single `og-image.png`) | SEO | M |
| 14 | Keyboard shortcuts (e.g., `/` to search) | UX | S |
| 15 | Share to LINE app (dominant in TH market) | UX | S |
| 16 | Print stylesheet for result pages | UX | S |

> **Effort key:** S = hours, M = 1–2 days, L = 3–5 days

---

## 📋 Issues Resolved Since Last Review

| # | Original Issue | Resolution |
| --- | --- | --- |
| 1 | Raw error messages leaked to clients | ✅ `apiErrorHandler.ts` returns generic errors; logs full error server-side |
| 2 | Unvalidated pagination — DoS vector | ✅ Zod validation on all paginated routes with `min(1).max(100)` |
| 3 | No rate limiting on any API route | ✅ In-memory rate limiter in `proxy.ts` (100/300/10 tiers) |
| 4 | Unguarded `JSON.parse` | ✅ Wrapped in try/catch in news service |
| 5 | `formatResult` duplicated 4× | ✅ Shared formatting in result service (remaining inline closures consolidated) |
| 6 | `slugify` duplicated in 3 files | ✅ Exported from `utils.ts` |
| 7 | No custom 404 page | ✅ `not-found.tsx` with brand theme |
| 8 | No skip-to-content link | ✅ `SkipToContent.tsx` component |
| 9 | Hardcoded `lang="en"` | ✅ `HtmlLangSync.tsx` sets dynamic `lang` |
| 10 | No breadcrumbs | ✅ `Breadcrumb.tsx` component |
| 11 | No error boundaries in components | ✅ `ErrorBoundary.tsx` wrapping component |
| 12 | Hardcoded CMS URL | ✅ Moved to `process.env.NEXT_PUBLIC_CMS_API_URL` |
| 13 | `useEffect` interval leak in HeroSection | ✅ Dependency array fixed |
| 14 | No CORS headers on API routes | ✅ Configured in `next.config.ts` headers |
| 15 | i18n in single 916-line file | ✅ Split into `dictionaries/en.ts`, `dictionaries/th.ts`, `locales/en.ts`, `locales/th.ts` |
| 16 | Debug `console.log` in `useApi.ts` | ✅ Removed |
| 17 | `getStatsFrequency` was a stub | ✅ Implemented in `statisticsService.ts` |
| 18 | Missing `loading.tsx` | ✅ Added root `loading.tsx` |
