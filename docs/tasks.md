# LOTTOX — Task Tracker

> **Status legend:** `[x]` done · `[/]` in progress · `[ ]` todo
> Updated: April 2026

---

## Phase 0 — Test Infrastructure ✅

- [x] **0.1** — Install Vitest + Testing Library + MSW
- [x] **0.2** — Install Playwright for E2E
- [x] **0.3** — Set up MSW mock server for API tests
- [x] **0.4** — Create Prisma test utilities & fixtures

---

## Phase 1 — Security & Vulnerability Hardening ✅

- [x] **1.1** — Sanitise error responses (generic errors via `apiErrorHandler.ts`)
- [x] **1.2** — Add Zod validation to all API routes
- [x] **1.3** — Guard `JSON.parse` calls in news/result services
- [x] **1.4** — Add rate limiting middleware (`proxy.ts`)
- [x] **1.5** — Add CSRF origin validation for mutating requests

---

## Phase 2 — Architecture Refactoring ✅

- [x] **2.1** — Extract shared `formatLotteryResult()` utility
- [x] **2.2** — Extract shared `slugify()` to `utils.ts`
- [x] **2.3** — Split services by domain (`newsService`, `statisticsService`, `countryService`, etc.)
- [x] **2.4** — Implement `checkNumber` (functional win/loss detection)
- [x] **2.5** — Implement `getStatsFrequency` in `statisticsService.ts`
- [x] **2.6** — Split i18n into per-locale dictionary files

---

## Phase 3 — Rendering & Performance ✅

- [x] **3.1** — Add ISR revalidation to API routes (300s on countries/lotteries/results/stats, 60s on upcoming)
- [x] **3.2** — Fix `useEffect` interval leak in `HeroSection.tsx`
- [x] **3.3** — Remove debug `console.log` in `useApi.ts`
- [x] **3.4** — Move CMS URL to environment variable
- [x] **3.5** — Add `loading.tsx` root segment
- [x] **3.6** — Add CORS headers via `next.config.ts`

---

## Phase 4 — UX & Accessibility (Partial)

- [x] **4.1** — Add skip-to-content link (`SkipToContent.tsx`)
- [x] **4.2** — Dynamic `<html lang>` via `HtmlLangSync.tsx`
- [x] **4.3** — Breadcrumb navigation component
- [x] **4.4** — Custom 404 page (`not-found.tsx`)
- [x] **4.5** — `ErrorBoundary` component for graceful degradation
- [x] **4.6** — Cookie consent banner
- [x] **4.7** — Visitor analytics tracking endpoint
- [ ] **4.8** — Add `prefers-reduced-motion` for confetti & animations
- [ ] **4.9** — Add `focus-visible` ring styles globally
- [ ] **4.10** — Share to LINE app

---

## Phase 5 — Code Quality (In Progress)

- [x] **5.1** — Extract `typographyUtils.ts` semantic class presets
- [x] **5.2** — Extract `lotteryValidation.ts` with country-specific rules
- [x] **5.3** — Extract `apiErrorHandler.ts` for consistent error responses
- [x] **5.4** — Add `ResultStates` component (jackpot, standard win, no win)
- [x] **5.5** — Add `LotteryResultJsonLd` for structured data
- [ ] **5.6** — Split `LotteryDetail.tsx` (800+ lines) into sub-components
- [ ] **5.7** — Remove remaining `eslint-disable any` casts
- [ ] **5.8** — Increase test coverage to ≥ 60%

---

## Phase 6 — SEO Enhancements (Planned)

- [x] **6.1** — Dynamic sitemap generator (`sitemap.ts`)
- [x] **6.2** — Robots.txt generator (`robots.ts`)
- [x] **6.3** — OpenGraph & Twitter card metadata
- [x] **6.4** — JSON-LD on homepage + articles
- [ ] **6.5** — `hreflang` alternate language tags
- [ ] **6.6** — JSON-LD breadcrumb on deep pages
- [ ] **6.7** — Per-lottery dynamic OG images
- [ ] **6.8** — `FAQPage` schema on `/faq`

---

## Completed Features

- [x] CountryGrid database migration
- [x] News article content from database (removed `newsData.ts` fallback)
- [x] Fix Noto Sans Thai font rendering
- [x] Dual-theme gradient backgrounds (light/dark)
- [x] Prize label i18n (lottery card countdown labels)
- [x] Laos prize display format (`6,000X`)
- [x] Australia Powerball zero-amount prize filter
- [x] Global results dashboard with personal board
- [x] Pagination across global results (replaced infinite scroll)
- [x] Latest Update section with filtering
- [x] Sentry integration (client + server + edge)
- [x] PWA (service worker, manifest)
- [x] Regions API endpoint
- [x] Feature toggles + revalidation endpoint
- [x] Visitor analytics endpoint
