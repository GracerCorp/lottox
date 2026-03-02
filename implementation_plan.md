# Implementation Plan: LOTTOX System Updates

Based on `plan.md` and `research.md`.

## User Review Required

> [!IMPORTANT]
> This plan covers all the 10 points requested in your `plan.md`. Please review this plan, and if everything looks correct, let me know so I can start implementing!

## Proposed Changes

### 1. Fix Build Errors & Data Fetching (Database/API Integration)

- **Problem**: API and build errors using `draw_date`, `draw_period`, `full_data` incorrectly. Old logic uses `lottery_results.full_data`.
- **Solution**: Refactor `src/app/api/results/[type]/[date]/route.ts` and `src/lib/services/lotteryResultService.ts` (formerly `api-client.ts`) to fetch data strictly from `result_verifications.chosen_data`. Update mapping logic to use `chosen_data` correctly instead of `full_data`.

### 2. Manage Prize Display with `showing_prize`

- **Problem**: Tables show all prizes including irrelevant ones.
- **Solution**: Update `src/lib/services/lotteryService.ts` (or equivalent) to fetch the `showing_prize` field from the `lotteries` table. Update `src/components/ui/ResultsTable.tsx`, `src/app/global-draws/page.tsx` to filter the rendered prizes based on the `showing_prize` configuration.

### 3. Fix Linter Errors

- **Problem**: Variables declared with `let` but never reassigned in `src/components/ui/ResultsTable.tsx`.
- **Solution**: Change `let` to `const` for `countryId`, `lottoHref`, and `flagCode`. Ensure `bun run lint` passes without warnings.

### 4. Dynamic Hero Banners

- **Problem**: Hero section uses hardcoded banners.
- **Solution**: In `src/app/page.tsx` or `src/components/home/HeroSection.tsx`, implement server-side fetching from the `banners` table using Prisma. Render banners dynamically.

### 5. Improve Light Mode UI

- **Problem**: Light mode aesthetics are lagging behind dark mode.
- **Solution**: Review Tailwind classes in core components (ResultTable, LotteryCard, Navbar) and apply proper depth, shadow, and color scaling for Light Mode so it looks equally premium.

### 6 & 9. Redesign Lottery Display for Better UX

- **Problem**: Table formats are confusing and hard to read.
- **Solution**: Redesign `ResultsTable` and `LotteryDetail` components inspired by Sanook Lotto, simplifying the layout, prioritizing the main prize numbers, and making the data hierarchy clearer.

### 7. Client-Side Lottery Checking System with UI Feedback

- **Problem**: Current checking might rely on manual reading or poor user feedback.
- **Solution**: Implement client-side logic in a checking component. When users input a number and hit "Check", perform validation against the current draw data and show a fun/exciting visual feedback (e.g., using Framer Motion) depending on the win/lose result.

### 8. Translate Prize Names using `category` key in `chosen_data`

- **Problem**: `prizeName` in `chosen_data` is language-dependent and causes translation issues.
- **Solution**: Use `category` as the key for translations in `chosen_data`  I'll add the necessary Thai/English keys (`prize_1`, `prize_2_digits`, `prize_modern_5`, etc.) mapped properly to the front-end components for Lao and Thai lotteries update to `src/lib/i18n.ts`..

### 10. Fix Subscribe Button API Integration

- **Problem**: Subscribe button is not working.
- **Solution**: Connect the subscribe form/button to ping `https://lotto-x-cms.vercel.app/api/subscribe` (this url can change from .env later) with a POST request carrying `email` and `lotteryId`. Add loading states and success/error toasts.

## Verification Plan

### Automated Tests

- Run `bun run lint` and `bun run build` to ensure the build completes without errors.

### Manual Verification

- Test local dev server (`bun dev`) and navigate through:
  - Homepage Hero Banners.
  - Results Table data mapping and UX.
  - Test Dark/Light mode toggles.
  - Try checking a lottery ticket.
  - Click Subscribe.
