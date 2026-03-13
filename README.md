# 🎰 LOTTOX

> **Multi-country lottery results platform** — check winning numbers, verify tickets, read news, and explore statistics across Southeast Asian lotteries.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io)

---

## ✨ Features

| Feature | Description |
| --- | --- |
| **Multi-Country Results** | Thailand 🇹🇭, Laos 🇱🇦, Vietnam 🇻🇳 lottery results with draw history |
| **Ticket Verification** | Interactive ticket checker — enter numbers to see if you won |
| **News & Articles** | CMS-powered lottery news with categories, reactions, and comments |
| **Statistics** | Frequency analysis and draw statistics across lotteries |
| **i18n** | Full Thai 🇹🇭 and English 🇬🇧 language support |
| **Dark Mode** | System-aware theme toggle with smooth transitions |
| **Email Subscriptions** | Subscribe for result notifications per lottery |
| **Hero Banners** | Dynamic, database-driven promotional banners |
| **SEO Optimised** | OpenGraph, Twitter cards, canonical URLs, and structured metadata |
| **Global Draw Dashboard** | Paginated, filterable view of draws across all countries |

---

## 🏗️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router, Server Components) |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Language** | TypeScript 5 |
| **Database** | PostgreSQL via Prisma ORM 6 |
| **Validation** | Zod 4 |
| **Icons** | Lucide React |
| **Fonts** | Inter + Noto Sans Thai (Google Fonts) |
| **Markdown** | react-markdown + remark-gfm |

---

## 📂 Project Structure

```
lottox/
├── prisma/
│   ├── schema.prisma       # Database schema (20+ models)
│   └── seed.ts             # Seed script
├── public/                 # Static assets (flags, noise texture, icons)
├── src/
│   ├── app/
│   │   ├── page.tsx        # Home page (hero, results, country list)
│   │   ├── layout.tsx      # Root layout (header, footer, theme)
│   │   ├── [country]/      # Dynamic country pages → lottery detail
│   │   ├── api/            # API routes (see below)
│   │   ├── about/          # About page
│   │   ├── contact/        # Contact page
│   │   ├── disclaimer/     # Disclaimer page
│   │   ├── faq/            # FAQ page
│   │   ├── global-draws/   # Global draws dashboard
│   │   ├── login/          # Login page
│   │   ├── news/           # News listing & detail
│   │   ├── privacy/        # Privacy (PDPA) page
│   │   ├── results/        # Results overview
│   │   ├── statistics/     # Statistics page
│   │   └── terms/          # Terms of service
│   ├── components/
│   │   ├── home/           # HeroSection, CountryList, ResultsTable, etc.
│   │   ├── lottery/        # DrawResult, TicketVerifier, LotteryDetail
│   │   ├── layout/         # Header, Footer
│   │   ├── ui/             # Reusable UI (LotteryBall, ThemeToggle, etc.)
│   │   ├── country/        # Country-specific components
│   │   └── dashboard/      # Dashboard components
│   ├── contexts/
│   │   └── LanguageContext  # i18n language provider (TH/EN)
│   ├── data/               # Static data & mockups
│   └── lib/
│       ├── services/       # Business logic
│       │   ├── lotteryResultService.ts  # Results, check number, news, stats
│       │   ├── lotteryService.ts        # Countries & lottery queries
│       │   └── bannerService.ts         # Hero banner queries
│       ├── hooks/          # useApi, useDebounce
│       ├── i18n.ts         # Full TH/EN dictionary (~900 lines)
│       ├── prisma.ts       # Prisma client singleton
│       ├── api-types.ts    # Shared API type definitions
│       ├── flags.ts        # Country flag URL helpers
│       └── utils.ts        # General utilities
├── next.config.ts          # Image domains, config
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (or **Bun**)
- **PostgreSQL** database
- A `.env` file with `DATABASE_URL`

### Installation

```bash
# Clone the repository
git clone <repo-url> && cd lottox

# Install dependencies
npm install
# or
bun install

# Set up environment
cp .env.example .env   # then edit DATABASE_URL

# Generate Prisma client & run migrations
npx prisma generate
npx prisma db push

# (Optional) Seed sample data
npx prisma db seed

# Start development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** to see the app.

---

## 📡 API Routes

All API routes live under `/api` and return JSON.

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/results/latest` | GET | Latest results for all lotteries |
| `/api/results/[type]` | GET | Results by lottery type with pagination |
| `/api/results/global` | GET | Paginated global results (filter by country, period, date) |
| `/api/check` | GET | Check a ticket number against draw results |
| `/api/countries` | GET | List active countries and their lotteries |
| `/api/news` | GET | Paginated news articles with category & search filters |
| `/api/news/[slug]` | GET | Single article by slug |
| `/api/statistics` | GET | Draw statistics and frequency analysis |
| `/api/subscribe` | POST | Email subscription for lottery results |

---

## 🗄️ Database Models

The Prisma schema defines **20+ models** including:

- **`countries`** / **`lotteries`** — Country & lottery configuration
- **`lottery_results`** — Draw results with full prize data (JSON)
- **`result_verifications`** — Multi-source result verification
- **`articles`** — CMS articles with reactions, comments, and analytics
- **`lottery_jobs`** / **`scraper_logs`** — Automated scraping infrastructure
- **`background_jobs`** — Async job queue
- **`user`** / **`session`** / **`account`** — Auth (NextAuth-compatible)
- **`lottery_subscriptions`** / **`subscriptions`** — User subscriptions
- **`email_logs`** — Email delivery tracking
- **`ai_usage_logs`** / **`api_keys`** — AI & API usage tracking
- **`prediction_feedback`** / **`gamification_logs`** — User engagement
- **`banners`** — Promotional hero banners

---

## 🌐 Internationalisation (i18n)

The app ships with a comprehensive dictionary (`src/lib/i18n.ts`) covering **Thai** (`th`) and **English** (`en`). Language switching is handled via `LanguageContext` and persisted client-side.

Translated sections: header, hero, common UI, lottery names, results labels, news, statistics, footer, about, FAQ, terms, privacy, and more.

---

## 🎨 Theming

- **Dark/Light mode** via `next-themes` with system preference detection.
- Custom CSS variables for the dark "navy" palette with gold/neon accents.
- Background effects: radial gradients, noise overlay, animated star mockups (dark mode).

---

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 📄 Licence

Private project — all rights reserved.
