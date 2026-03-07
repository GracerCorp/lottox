# Goal Description
The objective is to migrate `newsData.ts` (mock data) to the database using the existing `articles` table, and remove all fallback logic in the frontend so the application exclusively uses the database for news.

## Proposed Changes

### Database Seeding
#### [NEW] src/scripts/seed-news.ts
- Create a script that imports `newsArticles` from `src/lib/newsData.ts` and inserts them into `prisma.articles`.
- Since the schema's `content` field is JSON, we will store `titleEn`, `excerptEn`, `contentEn`, `categoryEn`, and `source` within this JSON object to support bilingual requirements without needing schema migrations right now.

---

### API Service
#### [MODIFY] src/lib/services/lotteryResultService.ts
- Update `getNews` to extract `titleEn`, `excerptEn`, `contentEn`, `category`, `categoryEn` from the `content` JSON if present, returning a unified response object matching the `NewsArticle` structure.
- Update `getNewsDetail` similarly to map the JSON fields correctly.

---

### Frontend Components
#### [MODIFY] src/components/ui/NewsSidebar.tsx
- Remove `fallbackNewsArticles` logic.
- Remove `hasApiData` check, simply render `data?.articles` (or empty mapping if loading).

#### [MODIFY] src/app/news/page.tsx
- Remove `fallbackNewsArticles` logic and cleanup conditions like `showFallback`.

#### [MODIFY] src/app/news/[slug]/NewsArticleContent.tsx
- Remove `fallbackNewsArticles`.
- Adjust `relatedArticles` computation to only rely on API data.

---

### Cleanup
#### [DELETE] src/lib/newsData.ts
- Delete the mock data file once everything is migrated.

## Verification Plan
### Automated Tests
- Run `bun run lint` to ensure no TypeScript or linting errors are introduced.

### Manual Verification
1. Run `bun run ./src/scripts/seed-news.ts` to verify data gets inserted into DB successfully.
2. Open the browser and navigate to the home page, verify the `NewsSidebar` correctly shows news from the database in both Thai and English.
3. Navigate to `/news`, verify the full news list loads correctly.
4. Open a specific news article (`/news/[slug]`), verify the content is formatted correctly in both languages and related articles fetch correctly.
