# Plan: News Article Enhancements

## 1. Modify API & Types
- Update `/src/lib/api-types.ts`: Add `relatedLottery?: { type: string; name: string }` to the article type (or handle it dynamically).
- Update `/src/lib/services/lotteryResultService.ts`:
  - Enhance `getNewsDetail` to fetch `lottery { name, countries { code } }`.
  - Translate the country code to the uppercase `type` format (like `THAI`, `LAO`, `VIETNAM`).
  - Return `relatedLottery: { type, name }` if a lottery is associated.

## 2. Update UI (NewsArticleContent.tsx)
- Add state and functions for "Share":
  - Copy to clipboard button.
  - Facebook, Twitter, and LINE share links.
  - Render these elegantly below the content and above "Related News".
- Add "Related Lottery" fetch logic:
  - If `article.relatedLottery` is present, use `useApi` to fetch `/api/results/latest?type=\${article.relatedLottery.type}`.
  - Display the `DrawResult.tsx` component to show the latest result for that specific lottery.
  - Hide the section if no related lottery data is found or if it fails to load.

## 3. Verify Changes
- Ensure TypeScript compiles successfully.
- Ensure ESLint reports no errors.
- Test the share buttons by hovering/clicking.
- Verify the related lottery appears for articles linked to a lottery (and disappears gracefully when not linked).
