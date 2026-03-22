# Application Routes Documentation

This document provides a comprehensive overview of all routes available in the application, including both frontend pages (App Router) and backend API endpoints.

---

## Frontend Routes (App Router)

### Core User Flow

- **`/`** - Home page (`src/app/page.tsx`)
- **`/login`** - Login / Authentication page (`src/app/login/page.tsx`)
- **`/[country]`** - Country-specific overview page displaying lotteries for a given country (`src/app/[country]/page.tsx`)
- **`/[country]/[lottery]`** - Specific lottery details and latest results (`src/app/[country]/[lottery]/page.tsx`)
- **`/[country]/[lottery]/[date]`** - Specific lottery draw results for a specific date (`src/app/[country]/[lottery]/[date]/page.tsx`)

### Features & Results

- **`/results`** - General results page (`src/app/results/page.tsx`)
- **`/global-draws`** - Overview of global lottery draws (`src/app/global-draws/page.tsx`)
- **`/statistics`** - Statistics and analytics for lotteries (`src/app/statistics/page.tsx`)

### News & Content

- **`/news`** - News article index/listing page (`src/app/news/page.tsx`)
- **`/news/[slug]`** - Specific news article details (`src/app/news/[slug]/page.tsx`)

### Informational & Legal

- **`/about`** - About Us (`src/app/about/page.tsx`)
- **`/contact`** - Contact Us / Support (`src/app/contact/page.tsx`)
- **`/faq`** - Frequently Asked Questions (`src/app/faq/page.tsx`)
- **`/privacy`** - Privacy Policy (`src/app/privacy/page.tsx`)
- **`/terms`** - Terms of Service (`src/app/terms/page.tsx`)
- **`/disclaimer`** - Legal Disclaimer (`src/app/disclaimer/page.tsx`)

### Developer & Testing

- **`/api-docs`** - Swagger/OpenAPI documentation viewer (`src/app/api-docs/page.tsx`)
- **`/sentry-example-page`** - Example page used to trigger and test Sentry error logging (`src/app/sentry-example-page/page.tsx`)

---

## Backend API Routes (`/api/*`)

### General Data

- **`GET /api/countries`**
  - **Description:** Returns a list of all active countries.
  - **Source:** `src/app/api/countries/route.ts`

- **`GET /api/lotteries`**
  - **Description:** Returns all active lotteries grouped by their parent country.
  - **Source:** `src/app/api/lotteries/route.ts`

### Results & Number Checking

- **`GET /api/check`**
  - **Description:** Check if a specific number has won in a given lottery type.
  - **Query Parameters:**
    - `number` (string) - Required. Must be numeric (1-7 digits).
    - `type` (string) - Required. The lottery type identifier.
    - `drawDate` (string) - Optional. Format `YYYY-MM-DD`.
  - **Source:** `src/app/api/check/route.ts`

- **`GET /api/results/global`**
  - **Description:** Retrieve paginated global lottery results.
  - **Query Parameters:**
    - `page` (number) - Optional.
    - `limit` (number) - Optional.
    - `country` (string) - Optional.
    - `period` (string) - Optional.
    - `date` (string) - Optional.
  - **Source:** `src/app/api/results/global/route.ts`

- **`GET /api/results/latest`**
  - **Description:** Get the most recent lottery results across all types.
  - **Source:** `src/app/api/results/latest/route.ts`

- **`GET /api/results/upcoming`**
  - **Description:** Get a list of upcoming lottery draws.
  - **Source:** `src/app/api/results/upcoming/route.ts`

- **`GET /api/results/[type]`**
  - **Description:** Get historical results for a specific lottery type.
  - **Source:** `src/app/api/results/[type]/route.ts`

- **`GET /api/results/[type]/[date]`**
  - **Description:** Get results for a specific lottery type on a specific date.
  - **Source:** `src/app/api/results/[type]/[date]/route.ts`

### News & API Content

- **`GET /api/news`**
  - **Description:** Retrieve a paginated list of news articles.
  - **Query Parameters:**
    - `page` (number) - Optional (default `1`).
    - `limit` (number) - Optional, max 50 (default `10`).
    - `category` (string) - Optional.
    - `lang` (string) - Optional, `th` or `en` (default `th`).
    - `search` (string) - Optional text search.
  - **Source:** `src/app/api/news/route.ts`

- **`GET /api/news/[slug]`**
  - **Description:** Retrieve the detailed content for a specific news article.
  - **Query Parameters:**
    - `lang` (string) - Optional, `th` or `en` (default `th`).
  - **Path Parameters:**
    - `slug` (string) - Required. The article identifier.
  - **Source:** `src/app/api/news/[slug]/route.ts`

- **`POST /api/articles/[slug]/track`**
  - **Description:** Track analytics (views/reads) for a specific article.
  - **Path Parameters:**
    - `slug` (string) - Required. The article identifier.
  - **Source:** `src/app/api/articles/[slug]/track/route.ts`

### Users & Subscriptions

- **`POST /api/subscribe`**
  - **Description:** Subscribe a user's email to notifications for a specific lottery. Proxies to the external CMS API.
  - **Body Payload (JSON):**
    - `email` (string) - Required. Must be a valid email address.
    - `lotteryId` (number) - Required. Must be a positive integer.
  - **Source:** `src/app/api/subscribe/route.ts`

### Statistics

- **`GET /api/statistics`**
  - **Description:** Retrieve general lottery statistics data.
  - **Source:** `src/app/api/statistics/route.ts`

### Developer & Diagnostics

- **`GET /api/sentry-example-api`**
  - **Description:** Diagnostic endpoint that intentionally throws an error to test Sentry backend integration.
  - **Source:** `src/app/api/sentry-example-api/route.ts`
