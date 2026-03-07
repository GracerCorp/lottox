# Plan: News Data Migration

1. Write `src/scripts/seed-news.ts` to migrate data from `src/lib/newsData.ts` into the Prisma `articles` table.
2. Store `titleEn`, `excerptEn`, `contentEn`, `categoryEn`, and `source` in the `articles.content` JSON field (since there are no dedicated En columns to prevent doing unnecessary database schema migrations, though we can migrate schema if requested).
3. Update `lotteryResultService.ts`:
   - `getNews()`: extract English text from the `content` JSON to return exactly what UI expects.
   - `getNewsDetail()`: extract English text from the `content` JSON to return exactly what UI expects.
4. Refactor Frontend:
   - `NewsSidebar.tsx`
   - `NewsPage.tsx`
   - `NewsArticleContent.tsx`
   - Remove fallbacks to `fallbackNewsArticles`.
5. Remove `src/lib/newsData.ts`.
6. Run the seed script to verify data is in DB.
7. Run the Next.js dev server and check if the pages load successfully.
8. Resolve lint issues.
