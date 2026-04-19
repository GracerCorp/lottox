# Application Routes Documentation

This document provides a comprehensive overview of all routes available in the application, including both frontend pages (App Router) and backend API endpoints.

> **Last updated**: April 2026

---

## Frontend Routes (App Router)

### Core User Flow

| Route | Description | Source |
| --- | --- | --- |
| `/` | Home page — hero carousel, results, country list, live ticker, check widget | `src/app/page.tsx` |
| `/login` | Login / Authentication page | `src/app/login/page.tsx` |
| `/[country]` | Country-specific overview with lotteries, recent draws, and ticket verifier | `src/app/[country]/page.tsx` |
| `/[country]/[lottery]` | Specific lottery details, latest results, draw history | `src/app/[country]/[lottery]/page.tsx` |
| `/[country]/[lottery]/[date]` | Specific lottery draw results for a given date | `src/app/[country]/[lottery]/[date]/page.tsx` |

### Features & Results

| Route | Description | Source |
| --- | --- | --- |
| `/results` | Results overview page | `src/app/results/page.tsx` |
| `/global-results` | Global results dashboard with personal board and filters | `src/app/global-results/page.tsx` |
| `/statistics` | Statistics and frequency analysis for lotteries | `src/app/statistics/page.tsx` |

### News & Content

| Route | Description | Source |
| --- | --- | --- |
| `/news` | News article listing with category and search filters | `src/app/news/page.tsx` |
| `/news/[slug]` | Specific news article with related articles | `src/app/news/[slug]/page.tsx` |

### Informational & Legal

| Route | Description | Source |
| --- | --- | --- |
| `/about` | About Us | `src/app/about/page.tsx` |
| `/contact` | Contact Us / Support | `src/app/contact/page.tsx` |
| `/faq` | Frequently Asked Questions | `src/app/faq/page.tsx` |
| `/privacy` | Privacy Policy (PDPA) | `src/app/privacy/page.tsx` |
| `/terms` | Terms of Service | `src/app/terms/page.tsx` |
| `/disclaimer` | Legal Disclaimer | `src/app/disclaimer/page.tsx` |

### Developer & Testing

| Route | Description | Source |
| --- | --- | --- |
| `/api-docs` | API documentation viewer | `src/app/api-docs/page.tsx` |
| `/sentry-example-page` | Sentry error tracking diagnostic page | `src/app/sentry-example-page/page.tsx` |

### Special Route Segments

| File | Description | Source |
| --- | --- | --- |
| `error.tsx` | Root error boundary with retry | `src/app/error.tsx` |
| `global-error.tsx` | Global uncaught error boundary | `src/app/global-error.tsx` |
| `not-found.tsx` | Custom 404 page with brand theme | `src/app/not-found.tsx` |
| `loading.tsx` | Root loading skeleton | `src/app/loading.tsx` |
| `sitemap.ts` | Dynamic sitemap generation (countries, lotteries, news) | `src/app/sitemap.ts` |
| `robots.ts` | Robots.txt generator | `src/app/robots.ts` |
| `manifest.ts` | PWA web manifest | `src/app/manifest.ts` |
| `sw.ts` | Service worker (Serwist) | `src/app/sw.ts` |

---

## Backend API Routes (`/api/*`)

All API routes are protected by the proxy middleware (`src/proxy.ts`) which enforces:
- **CSRF / Origin validation** on mutating requests (POST, PUT, PATCH, DELETE)
- **In-memory rate limiting** — 100 req/min (general), 300 req/min (results), 10 req/min (subscribe)
- **CORS headers** configured via `next.config.ts`

### Results & Number Checking

---

#### `GET /api/results/latest`
Returns the most recent lottery results across all types.

- **Source:** `src/app/api/results/latest/route.ts`

---

#### `GET /api/results/global`
Paginated global lottery results with filtering.

- **Query Parameters:**
  - `page` (number) — Optional, default `1`, max `1000`
  - `limit` (number) — Optional, default `20`, max `100`
  - `country` (string) — Optional country code filter
  - `period` (string) — Optional period filter
  - `date` (string) — Optional date filter
- **Revalidation:** 5 minutes
- **Source:** `src/app/api/results/global/route.ts`

---

#### `GET /api/results/upcoming`
List of upcoming lottery draws with expected prizes and currency.

- **Query Parameters:**
  - `limit` (number) — Optional, default `3`, max `20`
- **Response shape:** `{ upcoming: [{ name, countryCode, nextDrawAt, logo, expectedPrize, currency }] }`
- **Revalidation:** 60 seconds
- **Source:** `src/app/api/results/upcoming/route.ts`

---

#### `GET /api/results/[type]`
Historical results for a specific lottery type.

- **Path Parameters:**
  - `type` (string) — Required. The lottery type identifier.
- **Source:** `src/app/api/results/[type]/route.ts`

---

#### `GET /api/results/[type]/[date]`
Results for a specific lottery type on a specific date.

- **Path Parameters:**
  - `type` (string) — Required. Lottery type identifier.
  - `date` (string) — Required. Draw date in `YYYY-MM-DD` format.
- **Source:** `src/app/api/results/[type]/[date]/route.ts`

---

#### `GET /api/check`
Check if a specific number has won in a given lottery.

- **Query Parameters:**
  - `number` (string) — **Required.** Numeric, 1–7 digits.
  - `type` (string) — **Required.** Lottery type identifier.
  - `drawDate` (string) — Optional. `YYYY-MM-DD` format.
- **Validation:** Zod schema + country-specific number validation (`lotteryValidation.ts`)
- **Source:** `src/app/api/check/route.ts`

---

### Data & Configuration

---

#### `GET /api/countries`
Returns a list of all active countries.

- **Revalidation:** 5 minutes
- **Source:** `src/app/api/countries/route.ts`

---

#### `GET /api/lotteries`
Returns all active lotteries grouped by their parent country, including region data.

- **Response shape:** `{ countries: [{ code, name, flag, region, lotteries: [{ id, name, logo }] }] }`
- **Revalidation:** 5 minutes
- **Source:** `src/app/api/lotteries/route.ts`

---

#### `GET /api/regions`
Returns active regions with their associated country codes.

- **Response shape:** `{ regions: [{ id, name, countries: ["th", "la", ...] }] }`
- **Revalidation:** 5 minutes
- **Source:** `src/app/api/regions/route.ts`

---

#### `GET /api/statistics`
Draw statistics and frequency analysis.

- **Query Parameters:**
  - `type` (enum) — `overview` | `frequency` | `thai` | `lao` | `vietnam`. Default: `overview`.
  - `draws` (number) — Number of draws to analyse, default `30`, max `100`.
- **Revalidation:** 5 minutes
- **Source:** `src/app/api/statistics/route.ts`

---

### News & Content

---

#### `GET /api/news`
Paginated news articles with category and search filtering.

- **Query Parameters:**
  - `page` (number) — Optional, default `1`
  - `limit` (number) — Optional, max `50`, default `10`
  - `category` (string) — Optional tag/category filter
  - `lang` (string) — `th` or `en`, default `th`
  - `search` (string) — Optional text search on title
- **Source:** `src/app/api/news/route.ts`

---

#### `GET /api/news/[slug]`
Detailed content for a specific news article.

- **Path Parameters:**
  - `slug` (string) — Required. Article slug identifier.
- **Query Parameters:**
  - `lang` (string) — `th` or `en`, default `th`
- **Source:** `src/app/api/news/[slug]/route.ts`

---

#### `POST /api/articles/[slug]/track`
Track article analytics (views, reading time, scrolls).

- **Path Parameters:**
  - `slug` (string) — Required. Article slug identifier.
- **Source:** `src/app/api/articles/[slug]/track/route.ts`

---

### Users & Subscriptions

---

#### `POST /api/subscribe`
Subscribe a user's email to lottery result notifications. Proxied to external CMS API.

- **Body (JSON):**
  - `email` (string) — **Required.** Valid email address.
  - `lotteryId` (number) — **Required.** Positive integer.
- **Source:** `src/app/api/subscribe/route.ts`

---

#### `POST /api/analytics/track`
Track visitor analytics with geo data.

- **Body (JSON):**
  - `countryCode` (string) — Optional, max 10 chars
  - `countryName` (string) — Optional, max 100 chars
  - `city` (string) — Optional, max 100 chars
  - `region` (string) — Optional, max 100 chars
- **Auto-captured:** IP address (from `x-forwarded-for`), user agent
- **Source:** `src/app/api/analytics/track/route.ts`

---

### Admin & System

---

#### `GET | POST /api/revalidate-toggles`
Revalidate the feature toggles cache tag.

- **Response:** `{ revalidated: true, now: <timestamp> }`
- **Source:** `src/app/api/revalidate-toggles/route.ts`

---

#### `GET /api/sentry-example-api`
Diagnostic endpoint that throws an intentional error to test Sentry backend integration.

- **Source:** `src/app/api/sentry-example-api/route.ts`
