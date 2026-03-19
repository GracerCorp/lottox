/**
 * Typography Scaling System
 *
 * Semantic class maps for consistent, responsive font sizing across the app.
 * Backed by CSS custom properties with clamp() in globals.css.
 *
 * Usage:
 *   import { typography } from "@/lib/utils/typographyUtils";
 *   <h1 className={typography.pageTitle}>Title</h1>
 */

export const typography = {
  /** Page H1 — 36→48px fluid */
  pageTitle: "text-fs-5xl font-bold",

  /** Section H2 — 20→24px fluid */
  sectionTitle: "text-fs-2xl font-bold",

  /** Card/widget title — 14→16px fluid bold */
  cardTitle: "text-fs-base font-bold",

  /** Body text — 12→14px fluid */
  body: "text-fs-sm",

  /** Labels, badges, captions — 9→11px fluid uppercase */
  label: "text-fs-badge uppercase tracking-wide font-medium",

  /** Muted/secondary text — 10→12px fluid */
  muted: "text-fs-xs",

  /** Large prize numbers (hero) — 24→32px fluid */
  prizeMain: "text-fs-prize font-black",

  /** Sub prize numbers — 16→18px fluid */
  prizeSub: "text-fs-lg font-bold",

  /** History table numbers */
  tableNumber: "text-fs-lg font-bold tracking-widest font-mono",

  /** Small accent text for amounts */
  prizeAmount: "text-fs-xs",
} as const;

/** All available fluid font-size utility classes */
export const fontSizeScale = {
  xs: "text-fs-xs",
  sm: "text-fs-sm",
  base: "text-fs-base",
  lg: "text-fs-lg",
  xl: "text-fs-xl",
  "2xl": "text-fs-2xl",
  "3xl": "text-fs-3xl",
  "4xl": "text-fs-4xl",
  "5xl": "text-fs-5xl",
  prize: "text-fs-prize",
  badge: "text-fs-badge",
} as const;

export type TypographyRole = keyof typeof typography;
export type FontSizeKey = keyof typeof fontSizeScale;
