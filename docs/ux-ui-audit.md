# LOTTOX — UX/UI Audit Report

> Updated: April 2026

---

## ✅ What's Good

| Area | Details |
|------|---------|
| **Design System** | Comprehensive `design-guidelines.md` with 11 sections covering tokens, cards, typography, spacing |
| **Dual Theme** | Dark/light mode fully implemented with consistent CSS custom properties |
| **Fluid Typography** | `clamp()`-based scaling system (`text-fs-*`) — responsive without breakpoints |
| **Semantic Typography** | `typographyUtils.ts` provides preset classes (pageTitle, sectionTitle, body, label, prizeMain) |
| **Loading States** | Skeleton (`animate-pulse`) loaders on cards, tables, sidebar, plus root `loading.tsx` |
| **SEO Foundation** | Metadata, Open Graph, Twitter cards, JSON-LD, dynamic sitemap, robots.txt |
| **i18n** | EN/TH split dictionaries, `HtmlLangSync` for dynamic `<html lang>`, Noto Sans Thai loaded |
| **PWA** | Web manifest, service worker (Serwist), theme-color meta tags |
| **Cookie Consent** | GDPR-compliant consent banner implemented |
| **Scroll to Top** | Floating button for long pages — good for mobile UX |
| **Skip to Content** | `SkipToContent.tsx` — keyboard users can bypass header navigation |
| **Error Handling** | `error.tsx`, `global-error.tsx`, `not-found.tsx`, `ErrorBoundary` component |
| **Breadcrumbs** | `Breadcrumb.tsx` for navigation context on deep pages |
| **Card Design** | Consistent `rounded-2xl`, `shadow-sm`, glassmorphic dark mode — premium feel |
| **Color Palette** | Navy/gold brand is distinctive and lottery-appropriate |
| **Custom 404** | Branded not-found page with navigation links |
| **Rate Protection** | API endpoints protected against abuse (100/300/10 req/min tiers) |

---

## ❌ Needs Fixing

### High Priority

| Issue | Impact | Location |
|-------|--------|----------|
| **`maximumScale: 1`** may block pinch-to-zoom | WCAG 1.4.4 — users with low vision can't zoom | `layout.tsx` viewport config |
| **No `focus-visible` styles** | Keyboard users see no focus indicator on interactive elements | Global styles needed |
| **No `prefers-reduced-motion`** | Users with vestibular disorders see all animations (confetti, bouncing, pulse) | All animated components |
| **Confetti particles (500)** fire unconditionally | Performance hit on low-end mobile, no opt-out for motion-sensitive users | `ResultStates.tsx` |

### Medium Priority

| Issue | Impact | Location |
|-------|--------|----------|
| Some hardcoded Thai in `InteractiveTicketVerifier` result messages | Inconsistent i18n for EN users | `InteractiveTicketVerifier.tsx` |
| `text-sm`/`text-xs` still used in some components alongside `text-fs-*` | Inconsistent scaling | Various components |
| No `aria-live` regions for dynamic lottery check results | Screen readers don't announce results | `CheckLotteryWidget.tsx` |
| No `<time>` tags on date displays | Screen readers can't interpret dates semantically | Multiple components |

### Low Priority

| Issue | Impact |
|-------|--------|
| No `alt` text on some decorative SVG icons (only `aria-hidden` on some) | Screen reader noise |
| CookieConsent close label is Thai-only — should match current language | Inconsistent i18n |

---

## 🚫 What's Missing

### Accessibility (A11Y)

| Feature | Status | WCAG |
|---------|--------|------|
| Skip-to-content link | ✅ Done | 2.4.1 |
| Focus indicators (`focus-visible`) | ❌ Missing | 2.4.7 |
| `prefers-reduced-motion` respect | ❌ Missing | 2.3.3 |
| Zoom: `maximumScale` should be ≥ 5 | ⚠️ Check | 1.4.4 |
| `aria-live` for dynamic results | ❌ Missing | 4.1.3 |
| Dynamic `lang` attribute | ✅ Done (`HtmlLangSync`) | 3.1.1 |
| Landmark roles (`<nav>`, `<aside>`) | ⚠️ Partial | 1.3.1 |
| Color contrast for `text-fs-badge` (9px) | ⚠️ Check | 1.4.3 |
| Form error announcements | ❌ Missing | 3.3.1 |

### GEO / SEO

| Feature | Status |
|---------|--------|
| `hreflang` tags for TH/EN language alternates | ❌ Missing |
| JSON-LD `LotteryResult` schema on draw pages | ❌ Missing |
| JSON-LD breadcrumb on deep pages | ❌ Missing |
| Schema.org `FAQPage` on `/faq` | ❌ Missing |
| Per-page `<title>` on country and draw pages | ✅ Done |
| Dynamic sitemap | ✅ Done |
| Robots.txt | ✅ Done |
| JSON-LD on homepage + news | ✅ Done |
| Per-lottery OG images | ❌ Uses single `og-image.png` |

### UX Features

| Feature | Status |
|---------|--------|
| Breadcrumb navigation | ✅ Done |
| Custom 404 page | ✅ Done |
| Number search on homepage | ✅ Exposed in `CheckLotteryWidget` |
| Cookie consent | ✅ Done |
| Scroll to top | ✅ Done |
| Result notification / push alerts | ❌ No web push |
| Print-friendly result view | ❌ Missing |
| Share to LINE app (popular in TH) | ❌ Only FB/Twitter |
| Keyboard shortcuts (e.g., `/` to search) | ❌ Missing |
| Offline result caching (SW) | ⚠️ SW registered, limited caching strategy |

---

## 💡 Prioritized Recommendations

### 🔴 P0 — Do Now (Accessibility)

1. **Check `maximumScale`** → set to `5` or remove entirely
2. **Add `focus-visible` ring** → global style: `*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }`
3. **Add `prefers-reduced-motion`** → wrap confetti, bouncing icons, and pulse in `motion-safe:`

### 🟡 P1 — High Impact UX

4. **Share to LINE** → add LINE share button (dominant messaging app in TH/JP/LA markets)
5. **`aria-live="polite"` region** for lottery check results → screen readers announce results
6. **`hreflang` tags** → `<link rel="alternate" hreflang="th" href="..." />`
7. **JSON-LD `LotteryResult`** schema on draw result pages

### 🟢 P2 — Nice to Have

8. **Keyboard shortcut** → `/` to focus search, `Esc` to close modal
9. **Print stylesheet** → `@media print` for clean result printing
10. **Per-lottery OG images** → dynamic OG image per country flag + lottery name
11. **Offline caching** → cache recent results in service worker
12. **`<time datetime="...">` tags** on all date displays

---

## 📊 Audit Score Summary

| Category | Score | Notes |
|----------|-------|-------|
| Visual Design | **8/10** | Premium feel, good dark mode, consistent tokens |
| Accessibility | **5/10** | Skip-to-content + lang sync done; focus/motion gaps remain |
| SEO / GEO | **7/10** | Good foundation with sitemap, robots, JSON-LD; missing hreflang + breadcrumb LD |
| Performance | **7/10** | ISR, fluid type, loading states; confetti is heavy |
| i18n | **8/10** | Split dictionaries, dynamic lang; some hardcoded Thai in verifier |
| Mobile UX | **7/10** | Responsive layout, breadcrumbs; check zoom + touch affordances |
| Error Handling | **8/10** | error.tsx, global-error, ErrorBoundary, notFound — solid coverage |

**Overall: 7.1/10** — Significant improvements since initial audit (was 6.0). Main gaps are accessibility (focus/motion) and advanced SEO (hreflang, structured data).
