# System Flow: LOTTOX

## 1. User Journey

### 1.1 Home Page (Global Hub)
- **Entry Point**: User lands on `/`.
- **Actions**:
    - View featured lotteries (Hero Carousel).
    - Check latest results via ticker.
    - Select a country to view specific lotteries.
    - Navigate to Global Draws or News.

### 1.2 Country Page
- **Route**: `/[country]`
- **Description**: Displays summary of lotteries in a specific country.
- **Components**:
    - `CountryHeader`: Flag, name, jackpot info.
    - `RecentDrawsTable`: List of recent results for lotteries in that country.
    - `TicketVerifier`: To check winning numbers.
- **Data**: Fetches country-specific data (e.g., `thailand`, `usa`).

### 1.3 Lottery Detail Page (Dynamic)
- **Route**: `/[country]/[lottery]`
- **Description**: Detailed view of a specific lottery (e.g., Thai Lotto, Powerball).
- **Components**:
    - `LotteryHeader`: Name, next draw countdown.
    - `DrawResult`: Specific drawing results (balls, prizes).
    - `PrizeBreakdown`: Detailed prize table.
    - `HistoryList`: List of past draws.
- **Data**: Fetches specific lottery data based on `lottery` slug.

### 1.4 Previous Result Page (Dynamic)
- **Route**: `/[country]/[lottery]/[date]`
- **Description**: Historical result for a specific date/draw.
- **Components**:
    - `DrawResult`: The specific result.
    - `PrizeBreakdown`: Prize table for that draw.
- **Data**: Fetches historical data based on `date` and `lottery`.

## 2. API Structure

### 2.1 Internal API Routes
- `GET /api/results/[country]`: Get country overview.
- `GET /api/results/[country]/[lottery]`: Get lottery details and latest result.
- `GET /api/results/[country]/[lottery]/history`: Get historical results.
- `GET /api/results/[country]/[lottery]/[date]`: Get specific draw result.

## 3. Data Flow
1. **User Request**: User navigates to `/[country]/[lottery]`.
2. **Page Layer**: `page.tsx` receives `params` (`country`, `lottery`).
3. **Data Fetching**: Calls API endpoint or internal service to get data.
4. **Rendering**: Passes data to `LotteryDetailContent` component.
5. **Display**: Renders the UI with the fetched data.

## 4. Key Components
- `LotteryBall`: Renders a single lottery ball.
- `PrizeGrid`: Renders a grid of numbers (e.g., for 2-digit/3-digit prizes).
- `TicketVerifier`: Input form to check numbers.
