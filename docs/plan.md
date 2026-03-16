# Plan: CountryGrid Database Migration

## 1. Modify `CountryGrid.tsx`
- Change to an `async` Server Component.
- Import `getActiveCountries` from `src/lib/services/lotteryService.ts`.
- Fetch countries using `await getActiveCountries()`.
- Map the fetched `countries` to the format required by the UI.
  - Set `nameLocal` to `country.name` (or handle translation/mapping if needed).
  - Use `country.flag` or fallback to `getFlagUrl(country.code)`.
  - Check how many lotteries exist for the count text, or use a hardcoded value based on country code for now.
  - Set `href` dynamically based on `country.code`.

## 2. Verify
- Open the application and verify that the `CountryGrid` loads and displays countries fetched from the database correctly.
