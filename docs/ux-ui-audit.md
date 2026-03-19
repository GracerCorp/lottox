# LOTTOX — UX/UI Audit Report

> Senior UX/UI review · March 2026

---

## ✅ What's Good

| Area | Details |
|------|---------|
| **Design System** | Solid [design-guidelines.md](file:///Users/kvivek/Documents/lottox/docs/design-guidelines.md) with 11 sections covering tokens, cards, typography, spacing |
| **Dual Theme** | Dark/light mode fully implemented with consistent token mapping |
| **Fluid Typography** | `clamp()`-based scaling system (`text-fs-*`) — responsive without breakpoints |
| **Loading States** | Skeleton (`animate-pulse`) loaders on cards, tables, and sidebar — good perceived perf |
| **SEO Foundation** | Metadata, Open Graph, Twitter cards, JSON-LD on homepage + news, sitemap.xml, robots.txt |
| **i18n** | EN/TH dictionaries, no hardcoded strings in components, Noto Sans Thai loaded |
| **PWA** | Web manifest present, service worker registered, theme-color meta tags |
| **Cookie Consent** | GDPR-compliant consent banner implemented |
| **Scroll to Top** | Floating button for long pages — good for mobile UX |
| **Error Handling** | [error.tsx](file:///Users/kvivek/Documents/lottox/src/app/error.tsx), [global-error.tsx](file:///Users/kvivek/Documents/lottox/src/app/global-error.tsx), `notFound()` calls on invalid routes |
| **Card Design** | Consistent `rounded-2xl`, `shadow-sm`, glassmorphic dark mode — premium feel |
| **Color Palette** | Navy/gold brand is distinctive and lottery-appropriate |

---

## ❌ What's Bad / Needs Fixing

### Critical

| Issue | Impact | Location |
|-------|--------|----------|
| **`maximumScale: 1`** blocks pinch-to-zoom | WCAG 1.4.4 failure — users with low vision can't zoom | `layout.tsx:100` |
| **`lang="en"` hardcoded** | Screen readers and search engines see Thai content as English | `layout.tsx:110` |
| **No skip-to-content link** | Keyboard users must tab through entire header on every page | [layout.tsx](file:///Users/kvivek/Documents/lottox/src/app/layout.tsx) |
| **Only 1 `sr-only` usage** across entire codebase | Screen reader support is minimal | `ThemeToggle.tsx` only |
| **No `focus-visible` styles** | Keyboard users see no focus indicator on interactive elements | All components |
| **No `prefers-reduced-motion`** | Users with vestibular disorders see all animations (confetti, bouncing, pulse) | All animated components |

### Major

| Issue | Impact | Location |
|-------|--------|----------|
| **No breadcrumbs** | Users lose context in `/th/government-lottery-glo/2025-03-16` deep pages | Country/lottery/date pages |
| **No custom 404 page** | Users hitting bad URLs see Next.js default — no brand, no navigation | Missing `not-found.tsx` |
| **No error boundaries** in components | One broken card crashes the whole page instead of degrading gracefully | All component groups |
| **Confetti particles (500)** fire unconditionally | Performance hit on low-end mobile, no opt-out for motion-sensitive users | [ResultStates.tsx](file:///Users/kvivek/Documents/lottox/src/components/home/ResultStates.tsx) |
| **share URLs hardcoded** to `https://lottox.today` before hydration | OG share previews may use wrong URL during SSR | [ResultStates.tsx](file:///Users/kvivek/Documents/lottox/src/components/home/ResultStates.tsx) |

### Minor

| Issue | Impact |
|-------|--------|
| No `alt` text on decorative SVG icons (only `aria-hidden` on some) | Screen reader noise |
| No `<time>` tags on dates | Screen readers can't interpret dates semantically |
| CookieConsent `aria-label="ปิด"` is Thai-only — should match current language | Inconsistent i18n |
| `text-sm`/`text-xs` still used alongside `text-fs-*` in some components | Inconsistent scaling |

---

## 🚫 What's Missing

### Accessibility (A11Y)

| Feature | Status | WCAG |
|---------|--------|------|
| Skip-to-content link | ❌ Missing | 2.4.1 |
| Focus indicators (`focus-visible`) | ❌ Missing | 2.4.7 |
| `prefers-reduced-motion` respect | ❌ Missing | 2.3.3 |
| Zoom: `maximumScale` must be ≥ 5 | ❌ Blocked at 1 | 1.4.4 |
| `aria-live` for dynamic results | ❌ Missing | 4.1.3 |
| Landmark roles (`<nav>`, `<aside>`) on sidebar/nav | ⚠️ Partial | 1.3.1 |
| Color contrast for `text-fs-badge` (9px) | ⚠️ Check | 1.4.3 |
| Form error announcements | ❌ Missing | 3.3.1 |
| Dynamic `lang` attribute based on selected language | ❌ Hardcoded [en](file:///Users/kvivek/Documents/lottox/src/lib/i18n.ts#8-9) | 3.1.1 |

### GEO / SEO

| Feature | Status |
|---------|--------|
| `hreflang` tags for TH/EN language alternates | ❌ Missing |
| JSON-LD structured data for lottery results (LotteryResult schema) | ❌ Missing |
| JSON-LD breadcrumb on deep pages | ❌ Missing |
| Per-page `<title>` on country and draw pages | ⚠️ Check template |
| Schema.org `FAQPage` on `/faq` | ❌ Missing |
| Google Search Console verification | ❌ Commented out |
| Geo-meta tags (`geo.region`, `geo.placename`) | ❌ Missing |
| Open Graph images per country/lottery | ❌ Uses single `og-image.png` |

### UX Features

| Feature | Status |
|---------|--------|
| Breadcrumb navigation | ❌ Missing |
| Custom 404 page with search + suggested links | ❌ Missing |
| Number search on homepage (exposed) | ⚠️ Hidden in widget |
| Result notification / push alerts | ❌ No web push |
| Print-friendly result view | ❌ Missing |
| Share to Line app (popular in TH) | ❌ Only FB/Twitter |
| Keyboard shortcuts (e.g., `/` to search) | ❌ Missing |
| Offline result caching (SW) | ⚠️ SW registered, no caching strategy |

---

## 💡 Prioritized Recommendations

### 🔴 P0 — Do Now (Accessibility + Legal)

1. **Remove `maximumScale: 1`** → set to `5` or remove entirely
2. **Add skip-to-content** → `<a href="#main" className="sr-only focus:not-sr-only ...">Skip to content</a>` + `<main id="main">`
3. **Dynamic `lang`** → read from [LanguageContext](file:///Users/kvivek/Documents/lottox/src/contexts/LanguageContext.tsx#12-18) and set `<html lang={language}>`
4. **Add `focus-visible` ring** → global style: `*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }`
5. **Add `prefers-reduced-motion`** → wrap confetti, bouncing icons, and pulse in `motion-safe:`

### 🟡 P1 — High Impact UX

6. **Breadcrumb component** → `Home > Thailand > Government Lottery > 16 Mar 2025` with JSON-LD
7. **Custom 404 page** → brand-themed with search bar and popular lottery links
8. **Share to Line** → add LINE share button (dominant messaging app in TH/JP/LA markets)
9. **`aria-live="polite"` region** for lottery check results → screen readers announce results
10. **`hreflang` tags** → `<link rel="alternate" hreflang="th" href="..." />`

### 🟢 P2 — Nice to Have

11. **Keyboard shortcut** → `/` to focus search, `Esc` to close modal
12. **Print stylesheet** → `@media print` to show clean results for users who print winning numbers
13. **Per-lottery OG images** → dynamic OG image per country flag + lottery name
14. **JSON-LD [LotteryResult](file:///Users/kvivek/Documents/lottox/src/lib/services/lotteryResultService.ts#21-50)** schema on draw result pages
15. **Offline caching** → cache recent results in service worker for offline viewing
16. **Error boundary wrapper** → `ErrorBoundary` component around each card section
17. **`<time datetime="...">` tags** on all date displays for semantic HTML

---

## 📊 Audit Score Summary

| Category | Score | Notes |
|----------|-------|-------|
| Visual Design | **8/10** | Premium feel, good dark mode, consistent tokens |
| Accessibility | **3/10** | Critical gaps in keyboard nav, zoom, screen readers |
| SEO / GEO | **6/10** | Good foundation but missing structured data + hreflang |
| Performance | **7/10** | Good loading states, fluid type; confetti is heavy |
| i18n | **7/10** | Dictionaries work well, but `lang` tag is wrong |
| Mobile UX | **6/10** | Responsive layout, but zoom blocked + no touch affordances |
| Error Handling | **5/10** | `notFound()` works, but no graceful degradation in components |

**Overall: 6.0/10** — Strong visual design, but accessibility is the biggest gap.
