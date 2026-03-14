# Research: CountryGrid Database Migration
- Current Implementation: Hardcoded array of countries in `CountryGrid.tsx` with name, local name, flag URL, description (count), and link href.
- Database Schema: `countries` model exists with fields like `id`, `code`, `name`, `flag`, and relation to `lotteries`.
- Objective: Update `CountryGrid` component to dynamically fetch and display countries and their related lotteries from the database.
- Next steps: Inspect `lotteryService.ts` to check if a method to fetch countries with lotteries exists. Yes, `getActiveCountries()` returns countries and their lotteries. We can use it.
