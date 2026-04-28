# Lottox: AI & AdSense Technical Debt Resolution

This document outlines the remaining tasks required to resolve technical debt and finalize the integration of AI-generated content and Google AdSense into the Lottox platform. The work is broken down into structured phases.

## Phase 1: Environment & AdSense Configuration

**Goal:** Securely configure Google AdSense for production and clean up development placeholders.

- [ ] **Define Environment Variables**: Add `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (and any slot-specific IDs) to your `.env.local` and production environment configuration.
- [ ] **Update `AdSenseSlot.tsx`**: Modify the component to pull `adClient` and `adSlot` values from the new environment variables rather than using hardcoded `ca-pub-0000000000000000` placeholders.
- [ ] **Remove Development Backgrounds**: Remove the `bg-gray-50 dark:bg-gray-800/50` styling from the `AdSenseSlot` container. The `min-h` classes will remain to prevent Cumulative Layout Shift (CLS), but the slot should be transparent so it's invisible if an ad is blocked or fails to load.

## Phase 2: API Data Integration

**Goal:** Connect the frontend pages to the real database/backend to serve actual AI-generated content instead of mock data.

- [ ] **Implement Fetch Logic**: Update your data fetching utilities (e.g., in `src/lib/` or within server components) to query the Supabase database/backend API for the AI Summary, Trends, and FAQs for a given lottery draw.
- [ ] **Remove Mock Data**: In `src/app/[country]/[lottery]/page.tsx` and `src/app/[country]/[lottery]/[date]/page.tsx`, remove the import and usage of `mockAiContent`.
- [ ] **Wire Real Data**: Inject the newly fetched, real `aiContent` payload into the `LotteryDetail` component. 
- [ ] **Error Handling**: Add fallbacks so that if the AI content hasn't been generated for a specific draw yet, the page still loads gracefully without throwing errors (the AI components should just hide themselves).

## Phase 3: SEO Validation & UI Polish

**Goal:** Ensure search engines are correctly interpreting the new content and that the user experience is flawless.

- [x] **Validate JSON-LD Schema**: Deploy a staging URL (or use a local tunneling tool like Ngrok) and run the lottery pages through the [Google Rich Results Test](https://search.google.com/test/rich-results) tool. Verify that the `FAQPage` schema injected by `FAQJsonLd.tsx` is valid and contains no warnings.
- [x] **Lighthouse Performance Audit**: Run a Lighthouse audit to confirm that the `min-h` classes on the `AdSenseSlot` are successfully preventing Cumulative Layout Shift (CLS).
- [x] **Implement Loading Skeletons (Optional)**: If you transition to fetching AI content on the client-side (via SWR or React Query), implement skeleton loaders that match the approximate height of the AI text blocks to prevent "pop-in" layout shifts.
