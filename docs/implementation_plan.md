# Implementation Plan - LOTTOX UI Overhaul & Features

## Goal Description
Enhance the "LOTTOX" web application to achieve a premium, dark-themed global lottery platform. The focus is on implementing high-end visual effects (Cosmic Theme, Spotlight Flares), advanced animations (Framer Motion), and a responsive, data-rich dashboard.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, Custom "Navy & Gold" Palette
- **Animation**: Framer Motion (Complex transitions, Flares)
- **Icons**: Lucide React

## Implemented Components & Features

### 1. Global Layout & Theme
#### [COMPLETED] [layout.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/app/layout.tsx)
- **Background**: Deep Navy (`bg-navy-900`) with global text styles.
- **Font**: Inter (Standard).
- **Structure**: Permanent `Header` and `Footer`.

#### [COMPLETED] [Header.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/layout/Header.tsx)
- **Design**: Glassmorphism with **Blur XL** and reduced opacity (40%) for a premium "frosted glass" look.
- **Features**: 
  - Sticky positioning.
  - Logo with Gradient Gold glow.
  - Navigation links (hover effects).
  - Language & Sign In actions.

### 2. Home Page (Dashboard)
#### [MODIFY] [page.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/app/page.tsx)
- **Hero Section**:
  - **Flare Effect**: `BackgroundFlare` component (Spotlight Animation).
  - **Carousel**: `HeroCarousel` with 3D stacking effect.
  - **Action Bar**: Dual-capsule design (View All & Select Country).

#### [COMPLETED] [BackgroundFlare.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/BackgroundFlare.tsx)
- **Effect**: "Moving Spotlight" animation.
- **Implementation**: 
  - Uses `framer-motion` for smooth, continuous looping.
  - **Left Beam**: Blue/Cyan gradient sweeping left-to-right.
  - **Right Beam**: Indigo/Violet gradient sweeping right-to-left.
  - **Base Layer**: Wide moving nebula/aurora effect.
  - **Visibility**: Tuned blend modes (`screen`, `plus-lighter`) ensuring visibility against dark backgrounds.

#### [COMPLETED] [HeroCarousel.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/HeroCarousel.tsx)
- **Display**: Featured lotteries (Powerball, Thai Lotto, etc.).
- **Interaction**: Auto-playing carousel with 3D scaling for the active item.
- **Visuals**: Unique background images per lottery (USA, Japan, UK scenes).

#### [COMPLETED] [ResultsTable.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/ResultsTable.tsx)
- **Data**: Mock live results for global lotteries.
- **UI**: Clean table layout with flag icons and "View Result" buttons.

#### [COMPLETED] [CountryGrid.tsx](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/components/ui/CountryGrid.tsx)
- **Layout**: Grid of major countries with lottery counts.
- **Marketing**: "Why LOTTOX?" feature section.

### 3. Feature Pages (Planned/In Progress)
#### [TODO] [Thai Lotto Page](file:///Users/apinan/.gemini/antigravity/scratch/lotto-x/src/app/results/thai-lotto/page.tsx)
- **Latest Draw Banner**: High-visibility winning numbers.
- **Ticket Verification**: Input form.
- **Results History**: Historical table.

## Verification Plan

### Visual Verification
- **Spotlight Effect**: Verify that two distinct light beams (Blue & Purple) sweep across the Hero section.
- **Header Blur**: Scroll down and verify that content behind the header is blurred (frosted effect).
- **Responsive Design**: Check Carousel and Grid scaling on Mobile vs Desktop.
