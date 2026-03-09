# Research: News Article Enhancements

## Share Buttons
- Need a way to share the article to social networks (Facebook, Twitter, LINE) and copy link.
- Will use standard share URLs:
  - LINE: `https://social-plugins.line.me/lineit/share?url={url}`
  - Facebook: `https://www.facebook.com/sharer/sharer.php?u={url}`
  - Twitter/X: `https://twitter.com/intent/tweet?url={url}&text={title}`
- Needs to look clean and modern using `lucide-react` icons.

## Related Lottery Section
- `articles` table in database has a `lottery_id` relation to `lotteries` table.
- Currently, `getNewsDetail` in `lotteryResultService.ts` does not fetch or return this lottery info.
- We need to:
  1. Update `getNewsDetail` to `include` the `lottery` and its `countries.code`.
  2. Map the `countries.code` to an API type (e.g. `th` -> `THAI`).
  3. Return `relatedLottery: { type, name }` to the frontend.
  4. In `NewsArticleContent.tsx`, if `relatedLottery` exists, fetch the latest draw result using `/api/results/latest?type={type}`.
  5. Display it using the `DrawResult` component, similar to how `LotteryDetail.tsx` does.
