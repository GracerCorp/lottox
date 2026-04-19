# 🎰 LOTTOX

> **Multi-country lottery results platform** — check winning numbers, verify tickets, read news, and explore statistics across Southeast Asian lotteries.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest)](https://vitest.dev)
[![Sentry](https://img.shields.io/badge/Sentry-10-362D59?logo=sentry)](https://sentry.io)

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **Multi-Country Results** | Thailand 🇹🇭, Laos 🇱🇦, Vietnam 🇻🇳, Australia 🇦🇺 lottery results with draw history |
| **Ticket Verification** | Interactive ticket checker — enter numbers to see if you won |
| **News & Articles** | Database-driven lottery news with categories, reactions, comments, and analytics |
| **Statistics** | Frequency analysis and draw statistics across lotteries |
| **Global Results Dashboard** | Paginated, filterable view of draws across all countries with personal board |
| **i18n** | Full Thai 🇹🇭 and English 🇬🇧 language support with split dictionaries |
| **Dark Mode** | System-aware theme toggle with smooth transitions |
| **Email Subscriptions** | Subscribe for result notifications per lottery |
| **Hero Banners** | Dynamic, database-driven promotional carousel |
| **SEO Optimised** | OpenGraph, Twitter cards, canonical URLs, JSON-LD, sitemap, robots.txt |
| **PWA** | Service worker, web manifest, offline-ready architecture |
| **Rate Limiting** | In-memory rate limiter + CSRF origin validation on API routes |
| **Error Monitoring** | Sentry integration for client and server error tracking |
| **Visitor Analytics** | Geo-aware visitor tracking via `/api/analytics/track` |

---

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router, Server Components) |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL (Neon) via Prisma ORM 6 |
| **Validation** | Zod 4 |
| **Icons** | Lucide React |
| **Fonts** | Inter + Noto Sans Thai (Google Fonts) |
| **Markdown** | react-markdown + remark-gfm |
| **Testing** | Vitest 4 + Testing Library + MSW + Playwright |
| **Monitoring** | Sentry (client + server + edge) |
| **PWA** | Serwist (service worker) |
| **Rate Limiting** | In-memory (proxy middleware) + Upstash Redis (optional) |

---

## 📂 Project Structure

```
lottox/
├── prisma/
│   ├── schema.prisma        # Database schema (30+ models)
│   └── seed.ts              # Seed script
├── public/                  # Static assets (logos, flags, images)
├── e2e/                     # Playwright E2E tests (7 specs)
├── docs/                    # Project documentation
├── src/
│   ├── app/
│   │   ├── page.tsx         # Home page (hero, results, country list)
│   │   ├── layout.tsx       # Root layout (header, footer, theme, providers)
│   │   ├── globals.css      # Design tokens, fluid typography, theme vars
│   │   ├── [country]/       # Dynamic country pages → lottery detail → date
│   │   ├── api/             # API routes (see API docs below)
│   │   ├── global-results/  # Global results dashboard
│   │   ├── news/            # News listing & detail ([slug])
│   │   ├── about/           # About page
│   │   ├── contact/         # Contact page
│   │   ├── disclaimer/      # Disclaimer page
│   │   ├── faq/             # FAQ page
│   │   ├── login/           # Login page
│   │   ├── privacy/         # Privacy (PDPA) page
│   │   ├── results/         # Results overview
│   │   ├── statistics/      # Statistics page
│   │   ├── terms/           # Terms of service
│   │   ├── api-docs/        # API documentation viewer
│   │   ├── error.tsx        # Root error boundary
│   │   ├── global-error.tsx # Global error boundary
│   │   ├── not-found.tsx    # Custom 404 page
│   │   ├── loading.tsx      # Root loading skeleton
│   │   ├── sitemap.ts       # Dynamic sitemap generator
│   │   ├── robots.ts        # Robots.txt generator
│   │   ├── manifest.ts      # PWA manifest
│   │   └── sw.ts            # Service worker (Serwist)
│   ├── components/
│   │   ├── home/            # HeroSection, LotteryCard, CheckLotteryWidget,
│   │   │   │                  ResultStates, LiveTicker, LatestUpdate/
│   │   │   └── LatestUpdate/ # LatestUpdateSection, Grid, Card, Filter
│   │   ├── lottery/         # LotteryDetail, DrawResult, TicketVerifier,
│   │   │                      FindByNumber, PrizeTierSection, RecentGlobalDraws
│   │   ├── global-results/  # GlobalBoard, MyResultBoard, AddLotteryModal,
│   │   │                      BoardPagination, LatestDrawCard, ResultBoardCard
│   │   ├── country/         # CountryHeroSection, RecentDrawsTable, TicketVerifier
│   │   ├── layout/          # Header, Footer
│   │   ├── ui/              # Breadcrumb, CookieConsent, CountdownTimer,
│   │   │                      CountryGrid, ErrorBoundary, FormattedDate,
│   │   │                      HeroCarousel, LotteryBall, ResultsTable,
│   │   │                      ScrollToTop, SkipToContent, SubscribeButton,
│   │   │                      ThemeToggle, HtmlLangSync
│   │   ├── seo/             # JsonLd, LotteryResultJsonLd
│   │   └── dashboard/       # DashboardTable
│   ├── contexts/
│   │   └── LanguageContext.tsx  # i18n language provider (TH/EN)
│   ├── data/                # Static data & mockups
│   ├── proxy.ts             # API middleware (CSRF, rate limiting)
│   ├── instrumentation.ts   # Sentry server instrumentation
│   └── lib/
│       ├── services/        # Business logic (split by domain)
│       │   ├── lotteryResultService.ts  # Results, check number
│       │   ├── lotteryService.ts        # Countries & lottery queries
│       │   ├── newsService.ts           # News articles
│       │   ├── statisticsService.ts     # Draw statistics
│       │   ├── countryService.ts        # Country data
│       │   └── bannerService.ts         # Hero banner queries
│       ├── hooks/           # useApi, useDebounce
│       ├── utils/           # apiErrorHandler, countryResolver,
│       │                      lotteryResultTransform, lotteryUtils,
│       │                      lotteryValidation, sanitizeHtml,
│       │                      typographyUtils, cookies
│       ├── constants/       # regions.ts
│       ├── dictionaries/    # en.ts, th.ts (full i18n dictionaries)
│       ├── locales/         # en.ts, th.ts (compact locale keys)
│       ├── i18n.ts          # Dictionary loader & type definitions
│       ├── api-types.ts     # Shared API type definitions
│       ├── prisma.ts        # Prisma client singleton
│       ├── flags.ts         # Country flag URL helpers
│       └── utils.ts         # General utilities (slugify, cn)
├── Dockerfile               # Production container (Bun)
├── next.config.ts           # Image domains, Sentry, Serwist, CORS
├── vitest.config.ts         # Test config (jsdom, istanbul coverage)
├── playwright.config.ts     # E2E test config
├── eslint.config.mjs        # ESLint flat config
├── postcss.config.mjs       # PostCSS (Tailwind)
├── sentry.server.config.ts  # Sentry server config
├── sentry.edge.config.ts    # Sentry edge config
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (or **Bun**)
- **PostgreSQL** database (recommended: [Neon](https://neon.tech))
- A `.env` file (see `.env.example`)

### Installation

```bash
# Clone the repository
git clone <repo-url> && cd lottox

# Install dependencies
npm install

# Set up environment
cp .env.example .env   # then fill in DATABASE_URL, KV_*, CSRF_SECRET

# Generate Prisma client & sync schema
npx prisma generate
npx prisma db push

# (Optional) Seed sample data
npx prisma db seed

# Start development server
npm run dev
```

Open **[http://localhost:4001](http://localhost:4001)** to see the app.

### Environment Variables

| Variable | Required | Description |
| --- | :---: | --- |
| `DATABASE_URL` | ✅ | PostgreSQL connection string (Neon) |
| `KV_REST_API_URL` | ✅ | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | ✅ | Upstash Redis token |
| `KV_REST_API_READ_ONLY_TOKEN` | | Upstash read-only token |
| `KV_URL` | | Upstash Redis URL (alternative) |
| `REDIS_URL` | | Redis connection URL |
| `CSRF_SECRET` | ✅ | Secret for CSRF validation |
| `NEXT_PUBLIC_CMS_API_URL` | | External CMS API (defaults to `https://lotto-x-cms.vercel.app`) |
| `SENTRY_DSN` | | Sentry error tracking DSN |

---

## 📡 API Routes

All API routes live under `/api` and return JSON. Protected by rate limiting and CSRF origin validation via `src/proxy.ts`.

### Results & Number Checking

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/results/latest` | GET | Latest results for all lotteries |
| `/api/results/global` | GET | Paginated global results (`page`, `limit`, `country`, `period`, `date`) |
| `/api/results/upcoming` | GET | Upcoming lottery draws with expected prizes (`limit`) |
| `/api/results/[type]` | GET | Results by lottery type with pagination |
| `/api/results/[type]/[date]` | GET | Results for a lottery type on a specific date |
| `/api/check` | GET | Check a ticket number (`number`, `type`, `drawDate?`) |

### Data & Configuration

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/countries` | GET | List active countries and their lotteries |
| `/api/lotteries` | GET | All active lotteries grouped by country (with regions) |
| `/api/regions` | GET | Active regions with their country codes |
| `/api/statistics` | GET | Draw statistics (`type`: overview/frequency/thai/lao/vietnam, `draws`) |

### News & Content

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/news` | GET | Paginated news articles (`page`, `limit`, `category`, `lang`, `search`) |
| `/api/news/[slug]` | GET | Single article by slug (`lang?`) |
| `/api/articles/[slug]/track` | POST | Track article analytics (views/reads) |

### Users & Subscriptions

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/subscribe` | POST | Email subscription (`email`, `lotteryId`) — proxied to CMS |
| `/api/analytics/track` | POST | Visitor analytics tracking (geo data) |

### Admin & System

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/revalidate-toggles` | GET/POST | Revalidate feature toggle cache |
| `/api/sentry-example-api` | GET | Sentry diagnostics (intentional error) |

---

## 🗄️ Database Models

The Prisma schema defines **30 models** including:

| Category | Models |
| --- | --- |
| **Core** | `countries`, `lotteries`, `lottery_results` |
| **Verification** | `result_verifications` |
| **Content** | `articles`, `article_comments`, `article_reactions`, `article_analytics_daily` |
| **Users & Auth** | `user`, `account`, `session`, `verificationToken`, `user_addresses` |
| **Subscriptions** | `lottery_subscriptions`, `subscriptions` |
| **Analytics** | `analytics_snapshots`, `lottery_analytics_cache`, `visitor_analytics` |
| **Predictions** | `lottery_predictions`, `prediction_feedback` |
| **Scraping** | `lottery_jobs`, `scraper_logs` |
| **Infrastructure** | `background_jobs`, `email_logs`, `notifications`, `banners` |
| **Admin** | `admins`, `audit_logs`, `platform_settings`, `feature_toggles` |
| **API** | `api_keys`, `ai_usage_logs`, `webhooks`, `gamification_logs` |

---

## 🌐 Internationalisation (i18n)

- **Split dictionary architecture**: `src/lib/dictionaries/en.ts` and `src/lib/dictionaries/th.ts` contain full translations.
- **Compact locale keys**: `src/lib/locales/en.ts` and `src/lib/locales/th.ts` for lightweight lookups.
- **Language switching**: `LanguageContext` provider with client-side persistence.
- **Dynamic `lang` attribute**: `HtmlLangSync` component syncs `<html lang>` with selected language.

**Translated sections**: header, hero, common UI, lottery names & prizes, results labels, news, statistics, footer, about, FAQ, terms, privacy, contact, disclaimer, global draws, and more.

---

## 🎨 Theming

- **Dark/Light mode** via `next-themes` with system preference detection.
- Custom CSS variables for the dark "navy" palette with gold/neon accents.
- Fluid typography scale using `clamp()` — no breakpoint jumps (see `docs/design-guidelines.md`).
- Background effects: radial gradients per theme, noise overlay.
- Semantic typography utilities via `typographyUtils.ts`.

---

## 🧪 Testing

| Tool | Purpose |
| --- | --- |
| **Vitest** | Unit & integration tests (`jsdom` environment) |
| **Testing Library** | React component rendering & interaction |
| **MSW** | API request mocking |
| **Istanbul** | Code coverage reporting |
| **Playwright** | End-to-end browser tests |

```bash
# Current stats (April 2026)
# 49 test files · 355 tests · 43% statement coverage
```

---

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start dev server on port 4001 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:ci` | Run tests with coverage report |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## 🐳 Docker

```bash
docker build -t lottox .
docker run -p 3000:3000 --env-file .env lottox
```

> **Note**: The Dockerfile uses Bun as the runtime for production builds.

---

## 📄 Licence

Private project — all rights reserved.
