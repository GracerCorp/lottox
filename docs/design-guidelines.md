# LOTTOX Design Guidelines

> **Source of truth** for all UI decisions. Update here first, then propagate to components.

---

## 1. Design Tokens (`src/app/globals.css`)

| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#f8fafc` (slate-50) | `#0a0f1d` (navy-950) |
| `--card` | `#ffffff` | `#10162f` (navy-900) |
| `--border` | `#e2e8f0` (slate-200) | `rgba(255,255,255,0.10)` |
| `--muted` | `#f1f5f9` (slate-100) | `#1a2242` (navy-800) |
| `--muted-foreground` | `#64748b` (slate-500) | `#94a3b8` (slate-400) |
| `--primary` | `#f59e0b` (gold-500) | `#f59e0b` |

---

## 2. Backgrounds

```
Page bg      bg-transparent (inherits CSS var --background)
Card bg      bg-white dark:bg-navy-900/80
Sub-surface  bg-slate-50 dark:bg-navy-800/60
Skeleton     bg-slate-100 dark:bg-navy-700/60
```

---

## 3. Borders

```
Card border        border border-slate-200 dark:border-white/10
Sub-card border    border border-slate-200 dark:border-white/5
Row divider        border-b border-slate-100 dark:border-white/5
```

---

## 4. Typography

| Role | Light | Dark |
|------|-------|------|
| Heading H1 | `text-gray-900` | `dark:text-white` |
| Heading H2 | `text-gray-800` | `dark:text-white` |
| Body | `text-gray-700` | `dark:text-gray-100` |
| Muted / label | `text-gray-500` | `dark:text-gray-400` |
| Amber accent | `text-amber-600` | `dark:text-amber-400` |
| Error | `text-red-500` | `dark:text-red-400` |
| Prize numbers | `text-gray-900 font-bold` | `dark:text-white font-bold` |

### Dynamic Typography Scale (clamp-based fluid sizing)

Sizes scale **fluidly** with viewport — no breakpoint jumps. Defined as CSS custom properties in `globals.css`.

| Token | Class | Range | Use |
|-------|-------|-------|-----|
| `--fs-xs` | `text-fs-xs` | 10→12px | Muted text, secondary info |
| `--fs-sm` | `text-fs-sm` | 12→14px | Body text, descriptions |
| `--fs-base` | `text-fs-base` | 14→16px | Card titles, form inputs |
| `--fs-lg` | `text-fs-lg` | 16→18px | Sub headings, sub prizes |
| `--fs-xl` | `text-fs-xl` | 18→20px | Section titles |
| `--fs-2xl` | `text-fs-2xl` | 20→24px | Large headings |
| `--fs-3xl` | `text-fs-3xl` | 24→30px | Page header names |
| `--fs-4xl` | `text-fs-4xl` | 30→36px | Hero featured data |
| `--fs-5xl` | `text-fs-5xl` | 36→48px | Page hero titles |
| `--fs-prize` | `text-fs-prize` | 24→32px | Prize numbers (hero) |
| `--fs-badge` | `text-fs-badge` | 9→11px | Badges, labels, captions |

### Semantic Utility Map (`typographyUtils.ts`)

Import and use semantic class presets for consistency:

```tsx
import { typography } from "@/lib/utils/typographyUtils";

<h1 className={typography.pageTitle}>Title</h1>     // text-fs-5xl font-bold
<h2 className={typography.sectionTitle}>Section</h2> // text-fs-2xl font-bold
<p className={typography.body}>Text</p>              // text-fs-sm
<span className={typography.label}>LABEL</span>      // text-fs-badge uppercase tracking-wide
<span className={typography.prizeMain}>757563</span> // text-fs-prize font-black
```

> ⚠️ **Never use** arbitrary `text-[Npx]` values. Always use `text-fs-*` classes.

---

## 5. Cards

All cards follow this structure:

```tsx
<div className="bg-white dark:bg-navy-900/80
                border border-slate-200 dark:border-white/10
                rounded-2xl p-5
                shadow-sm dark:shadow-none">
  {/* card header — slightly highlighted */}
  <div className="bg-slate-50 dark:bg-navy-800/60
                  border-b border-slate-200 dark:border-white/5
                  rounded-t-2xl px-4 py-3">
    ...
  </div>
</div>
```

---

## 6. Interactive Elements

### Buttons — Primary
```tsx
className="bg-amber-400 hover:bg-amber-300 text-navy-950 font-bold rounded-xl px-4 py-2 transition-colors"
```

### Buttons — Ghost / icon
```tsx
className="text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded transition-colors"
```

### Tabs — Active
```tsx
className="bg-amber-400 text-navy-950 border-amber-400"
```

### Tabs — Inactive
```tsx
className="text-gray-500 dark:text-gray-400
           border-slate-300 dark:border-white/10
           hover:border-slate-400 dark:hover:border-white/30
           hover:text-gray-900 dark:hover:text-white"
```

### Pagination buttons
```tsx
className="border border-slate-200 dark:border-white/10
           text-gray-500 dark:text-gray-400
           hover:text-gray-900 dark:hover:text-white
           hover:border-slate-400 dark:hover:border-white/30
           disabled:opacity-30"
```

---

## 7. Colors (Custom Palette)

```
navy-950  #0a0f1d   ← page dark bg
navy-900  #10162f   ← card dark bg
navy-800  #1a2242   ← sub-surface dark
navy-700  #252e55
navy-600  #323d6a

gold-300  #fcd34d
gold-400  #fbbf24
gold-500  #f59e0b   ← primary
gold-600  #d97706
```

---

## 8. Elevation / Shadows

```
Card (light)    shadow-sm
Card (dark)     shadow-none (depth comes from bg color contrast)
Lottery ball    shadow-md
Hover lift      hover:-translate-y-1 transition-all duration-300
```

---

## 9. Spacing & Radius

```
Page section gap   gap-6 (24px)
Card padding       p-5 (20px) or p-6
Card border radius rounded-2xl (16px)
Pill / badge       rounded-full
Inner card item    rounded-xl (12px)
```

---

## 10. Page Background

Both light and dark use a radial gradient injected in the page layout — **not** background classes on `<body>`:

```tsx
{/* Light mode */}
<div className="pointer-events-none fixed inset-0 -z-10 block dark:hidden"
     style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #bfdbfe 0%, #e0f2fe 40%, #f8fafc 100%)" }} />

{/* Dark mode */}
<div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
     style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, #1e40af 0%, #0f172a 60%, #020617 100%)" }} />
```

---

## 11. Quick Reference — "Light or Dark" Cheatsheet

| Wrong (dark-only) | Correct (dual-theme) |
|-------------------|----------------------|
| `bg-navy-800/60` | `bg-white dark:bg-navy-900/80` |
| `border-white/10` | `border-slate-200 dark:border-white/10` |
| `text-white` | `text-gray-900 dark:text-white` |
| `text-gray-400` | `text-gray-500 dark:text-gray-400` |
| `text-amber-400` | `text-amber-600 dark:text-amber-400` |
| `text-red-400` | `text-red-500 dark:text-red-400` |
| `bg-navy-700/60` (skeleton) | `bg-slate-100 dark:bg-navy-700/60` |
| `hover:text-white` | `hover:text-gray-900 dark:hover:text-white` |
