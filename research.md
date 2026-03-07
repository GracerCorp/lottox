# Research: News Data Migration

## Current State
- `src/lib/newsData.ts` contains 6 mock news articles with bilingual content (`title`, `titleEn`, `content`, `contentEn`, etc.).
- UI components `NewsSidebar`, `NewsPage`, `NewsArticleContent` fetch from `/api/news` but fallback to `newsData.ts` if the API data is empty.
- `/api/news` connects to `lotteryResultService.getNews`, querying `prisma.articles`.
- The database `articles` table currently lacks explicit columns for English content (`titleEn`, `excerptEn`, `contentEn`), but has a generic `content` field of type `Json` which can be utilized.

## Objective
Migrate the mock data to the database, remove the fallback logic from the frontend, and ensure bilingual data is supported effectively.

## Proposed Strategy
1. **Seed Script**: Create `src/scripts/seed-news.ts` to insert the 6 mock articles into the database. We will store English fields and `source` inside the `content` JSON column of `articles`.
2. **Service Update**: Update `getNews` and `getNewsDetail` in `lotteryResultService.ts` to unpack the `content` JSON and send `titleEn`, `excerptEn`, `contentEn`, `categoryEn` back to the UI.
3. **UI Refactor**: Remove imports of `newsData.ts` in `NewsSidebar.tsx`, `NewsPage.tsx`, and `NewsArticleContent.tsx`. 
4. **Clean up**: Delete `src/lib/newsData.ts`.
