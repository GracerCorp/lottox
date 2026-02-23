# Implementation Plan: Light Mode Theme Fixes

## Goal Description
The objective is to ensure all components across the LOTTOX application have high contrast and are fully usable in light mode. Currently, several components use hardcoded dark mode utility classes (e.g., `bg-navy-*`, `text-white`, `border-white/10`) without `dark:` prefixes or light mode equivalents. This causes contrast issues or leaves components looking like they are in dark mode even when the user switches to light mode.

## Proposed Changes

We will search for all instances of hardcoded dark classes and replace them with appropriate responsive classes (e.g., default light mode classes combined with `dark:` prefixed dark mode classes).

### `src/app/login/page.tsx`
- Refactor the main login card to `bg-white dark:bg-navy-800`
- Update text colors `text-white` to `text-gray-900 dark:text-white`
- Update borders `border-white/10` to `border-gray-200 dark:border-white/10`
- Update input backgrounds to `bg-gray-50 dark:bg-navy-900`
- Ensure text contrast is accessible in both modes.

### `src/components/dashboard/DashboardTable.tsx`
- Refactor the table container to use `bg-white dark:bg-navy-900`
- Update table headers, rows, and borders to support light mode (e.g., `border-gray-200 dark:border-white/10`).
- Ensure text contrast for status labels and pagination controls.

### `src/app/api-docs/page.tsx`
- Update the API documentation container to support light mode backgrounds.
- Fix hardcoded `bg-navy-950` code blocks to `bg-gray-100 dark:bg-navy-950` with proper text colors.
- Ensure the copy buttons and tabs have good contrast in light mode.

### `src/app/page.tsx` (Homepage)
- Check hero section, features section, and any cards for hardcoded dark classes and add light mode variants.
- Ensure buttons and links have hover states that are visible in light mode.

### `src/app/results/thai-lotto/ThaiLottoContent.tsx` (and similar pages)
- Replace skeleton loaders hardcoded to `bg-navy-800/50` with `bg-gray-200 dark:bg-navy-800/50`.
- Ensure any result cards within use proper light and dark mode classes.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure there are no syntax errors introduced by class changes.
- Ensure the application compiles without ESLint or TypeScript errors.

### Manual Verification
- Start the development server with `npm run dev`.
- I will ask the user to view the Login page, Dashboard, API Docs, and Thai Lotto results page in light mode to confirm that the contrast is excellent, readable, and matches the intended premium aesthetic.
