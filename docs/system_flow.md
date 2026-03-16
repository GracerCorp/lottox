# System Flow

## News Component Architecture
1. **Frontend**: UI components (`NewsPage`, `NewsSidebar`, `NewsArticleContent`) consume data via HTTP GET to `/api/news` or `/api/news/[slug]`.
2. **API Route**: Next.js route handlers map request variables (page, limit, category) and pass them to standard Service functions.
3. **Service Layer**: `lotteryResultService.ts` provides `getNews` and `getNewsDetail` which interact cleanly with Prisma.
4. **Database**: PostgreSQL storing `articles` table. Supports title, excerpt, full_content, tags, cover_image. English/localization data will be safely mapped to the JSON `content` field or as new columns string.

Present Data Flow: Frontend falls back to `newsData.ts` if DB returns empty.
Future Data Flow: Frontend relies exclusively on DB/Service layer. `newsData.ts` is eliminated.
