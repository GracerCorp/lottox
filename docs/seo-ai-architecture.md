# Lottox Frontend - Technical SEO & UI Architecture (Full Detail)

## 1. Core Philosophy: The Traffic Catcher
The `lottox` frontend is built specifically to capture organic search traffic (Long-tail keywords) and monetize it. It is not just a data display app; it is a **Content Engine**. Every technical decision here is optimized for:
1.  **Indexability**: Google Bot must find and understand the pages instantly.
2.  **Performance (Core Web Vitals)**: Near-zero load times using Next.js Static Site Generation (SSG) / Incremental Static Regeneration (ISR).
3.  **Engagement & Conversion**: Keeping users on the page with AI insights and placing AdSense/Affiliate links strategically.

---

## 2. Next.js App Router Structure (Programmatic SEO)
To capture keywords like *"USA Powerball results today"* or *"UK Lotto results 2026-04-23"*, we use deep, dynamic hierarchical routing.

### Directory Tree
```text
src/
└── app/
    ├── layout.tsx                 # Root layout (Global headers, analytics scripts)
    ├── page.tsx                   # Homepage (Global lottery index)
    ├── [country]/                 # e.g., /usa, /uk, /japan
    │   ├── page.tsx               # Country Hub: Lists all lotteries in this country
    │   └── [lottery-name]/        # e.g., /usa/powerball
    │       ├── page.tsx           # Lottery Hub (Evergreen): Latest result, how to play
    │       ├── history/           # e.g., /usa/powerball/history
    │       │   └── page.tsx       # Historical data table
    │       └── results-[date]/    # e.g., /usa/powerball/results-2026-04-23
    │           └── page.tsx       # TARGET PAGE: Daily result with AI Content
    └── api/
        └── revalidate/            # Webhook endpoint for ISR
            └── route.ts
```

---

## 3. The Money Page: `results-[date]/page.tsx`
This is the page that ranks on Google and generates revenue. 

### Data Fetching & ISR
The page fetches the combined Raw Data + AI Content from the database. It uses `fetch` with Next.js caching.
```typescript
// Example: app/[country]/[lottery-name]/results-[date]/page.tsx
async function getLotteryData(country: string, lottery: string, date: string) {
  const res = await fetch(`https://api.our-backend.com/results/${country}/${lottery}/${date}`, {
    next: { tags: [`result-${country}-${lottery}-${date}`] } // Tag for targeted revalidation
  });
  return res.json();
}
```

### UI Component Layout
The layout must balance user intent (seeing the numbers) with monetization and SEO content.
1.  **H1 Title**: Exact match keyword (e.g., `<h1>USA Powerball Results for April 23, 2026</h1>`)
2.  **Draw Result Component**: Big, bold numbers (Instant gratification).
3.  **Ad Slot 1**: Premium AdSense placement just below the numbers.
4.  **AI Summary Section**: `<p>` tags with the `ai_summary` (e.g., "Nobody won the jackpot today...").
5.  **Prize Breakdown Table**: Traditional data table.
6.  **AI Trends/Hot & Cold Numbers**: Insightful content to keep users reading.
7.  **Ad Slot 2**: Middle of the page.
8.  **AI FAQs (Accordion)**: Crucial for SEO "People Also Ask" targeting.

---

## 4. SEO & Metadata Implementation

### A. Dynamic Meta Tags
Use Next.js `generateMetadata` to inject exact keywords into `<title>` and `<meta name="description">`.
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch data to inject into title
  return {
    title: `${params.country.toUpperCase()} ${params['lottery-name']} Results Today: ${params.date}`,
    description: `Check the latest winning numbers for ${params['lottery-name']} on ${params.date}. Read our AI analysis, prize breakdown, and jackpot trends.`,
  }
}
```

### B. Automated JSON-LD (Structured Data)
Injecting Schema markup directly into the `<head>` to win Google Rich Snippets.

**1. FAQPage Schema** (Generated from `ai_faqs`)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What were the winning numbers for Powerball on April 23?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The winning numbers were 12, 34, 45, 56, 67 with Powerball 8."
      }
    }
  ]
}
```

**2. Event/Dataset Schema** (For the draw event itself)
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Powerball Draw Results",
  "startDate": "2026-04-23T20:00:00Z",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://lottox.com/usa/powerball/results-2026-04-23"
  }
}
```

---

## 5. Automation: Webhooks & On-Demand Revalidation
When `ai-lottery-scraper` finishes generating content for a new draw, it pings the Next.js API.
`POST /api/revalidate?tag=result-usa-powerball-2026-04-23&secret=MY_TOKEN`

The API route triggers a background rebuild of that specific page:
```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const tag = request.nextUrl.searchParams.get('tag');
  revalidateTag(tag);
  return Response.json({ revalidated: true, now: Date.now() });
}
```
**Result**: The user and Google Bot get a fully rendered HTML page instantly, without waiting for the server to fetch data on the fly.

---

## 6. Monetization Strategy
*   **Google AdSense**: Use dynamic ad insertion components (`<AdSenseSlot />`) that lazy-load to protect Core Web Vitals.
*   **Affiliate CTAs**: Component `<AffiliateButton country={params.country} />` that routes users to localized ticket purchasing sites (e.g., TheLotter for UK users).
