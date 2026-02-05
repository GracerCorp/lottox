# Implementation Plan - LOTTOX UI Overhaul & Features

## Goal Description
Revise the `src/app` and creating components to match the "LOTTOX" design: a premium, dark-themed global lottery platform. The design emphasizes a "Navy & Gold" color palette, glassmorphism, and a clean, data-rich interface for lottery results.

## User Review Required
> [!IMPORTANT]
> This plan involves a complete rewrite of `src/app/page.tsx`. Current content will be replaced with the new dashboard.
> I will assume standard "Inter" font and use the custom Tailwind configuration (`navy`, `gold`, `neon`) we just fixed.

## Proposed Changes

### Layout & Global
#### [MODIFY] [layout.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/app/layout.tsx)
- Ensure background is set to `bg-navy-950` or `bg-navy-900`.
- Add `Header` and `Footer` components permanently.
- Add global "Cosmic" background effects (Nebula, Star field).

#### [NEW] [Header.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/layout/Header.tsx)
- Navigation: Global Draws, Results, Statistics, News.
- Actions: Language selector (EN), Sign In button.

#### [NEW] [Footer.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/layout/Footer.tsx)
- Links: World Dashboard, About, FAQ, Contact, Disclaimer, Terms, Privacy, API.
- Copyright & Disclaimer text.

### Home Page (Dashboard)
#### [MODIFY] [page.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/app/page.tsx)
- **Hero Section**:
    - "Worldwide Lottery Draws" title with gradient text.
    - **Action Bar**: Dual-capsule design (View All & Select Country).
- **Featured Lotteries**: Carousel/grid of `LotteryCard` components.
- **Results Feed**: `ResultsTable` displaying live global results.
- **Country Selection**: `CountryGrid` section at the bottom.

### Feature Pages
#### [NEW] [Thai Lotto Page](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/app/results/thai-lotto/page.tsx)
- **Latest Draw Banner**: High-visibility winning numbers.
- **Ticket Verification**: Interactive form for checking tickets.
- **Results History**: Table of past draw results.
- **Statistics Widget**: Next draw countdown and jackpot odds.

### Components
#### [NEW] [LotteryCard.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/LotteryCard.tsx)
- Card component for featured lotteries (Name, Jackpot, "View Details" button).
- Styling: Glassmorphism, Premium Gradients (Gold, Blue, Purple), Hover Glows.

#### [NEW] [ResultsTable.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/ResultsTable.tsx)
- Rows displaying: Flag, Lottery Name, Winning Numbers (balls), Jackpot Amount.
- "Live" indicator.

#### [NEW] [LotteryBall.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/LotteryBall.tsx)
- Reusable component for drawing the numbered balls (Gold, Blue, plain styles).
- 3D effects with shadows and shines.

#### [NEW] [CountryGrid.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/CountryGrid.tsx)
- Grid of country flags with lottery counts.
- "Why LOTTOX?" feature banner.

## Verification Plan

### Manual Verification
- **Visual Check**: Run `bun dev` and open `http://localhost:3000`.
- **Theme Check**: Verify `bg-navy-950` is active and text is readable (white/gold).
- **Responsiveness**: Resize browser to check mobile view (cards stacking).
- **Navigation**: Click nav items (Thai Lotto card -> Detail Page).

### Automated Tests
- None planned for this visual overhaul.
