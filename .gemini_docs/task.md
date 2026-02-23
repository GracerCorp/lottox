# Light Mode Theme Contrast Fixes

- [x] Identify all components using explicit dark aesthetics without `dark:` prefixes.
- [x] Review `src/app` page components for correct light/dark combinations.
- [x] Review `src/components` UI components for consistent themes.
- [x] Refactor explicit colors like `text-white`, `text-gray-800` into `text-foreground`, `text-muted-foreground` or use `dark:` prefix appropriately.
- [x] Refactor explicit backgrounds like `bg-navy-900` into `bg-background` or provide a light mode equivalent.
- [x] Check borders and shadows for good contrast in light mode.
- [x] Test the application across major views.
