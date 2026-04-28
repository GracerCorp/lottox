"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { LotteryCardV2 } from "./LotteryCardV2";
import { Compass } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { HeroItem } from "./HeroSection";
import { CheckLotteryWidget, type LotteryGroup } from "./CheckLotteryWidget";

// Helper for scrolling columns
const ScrollingColumn = ({ colItems, speedStr, className = "", isHoverable = false, priorityCount = 0 }: { colItems: HeroItem[], speedStr: string, className?: string, isHoverable?: boolean, priorityCount?: number }) => {
  // Duplicate the items for seamless infinite scrolling
  const doubleItems = [...colItems, ...colItems];

  return (
    <div className={`relative flex flex-col gap-4 md:gap-6 overflow-hidden h-full ${className}`} style={{ paddingBottom: "24px" }}>
      <div 
        className="flex flex-col gap-4 md:gap-6 w-full scroll-animate will-change-transform"
        style={{
          animation: `scrollUp ${speedStr} linear infinite`,
        }}
      >
        {doubleItems.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="w-full flex-shrink-0">
            <LotteryCardV2 {...item} isHoverable={isHoverable} imgPriority={idx < priorityCount} />
          </div>
        ))}
      </div>
    </div>
  );
};

export function HeroSectionV3({ items = [], lotteryGroups = [] }: { items?: HeroItem[], lotteryGroups?: LotteryGroup[] }) {
  const { t } = useLanguage();
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => {
        if (data.regions) setRegions(data.regions);
      })
      .catch((err) => console.error("Failed to load regions:", err));
  }, []);

  // Ensure we have enough items to display a full grid
  const minimumItems = 12;
  const loopCount = Math.max(1, Math.ceil(minimumItems / Math.max(1, items.length)));
  let displayItems = Array(loopCount).fill(items).flat();
  // Cap at 32 for performance when duplicating components heavily
  if (displayItems.length > 32) {
    displayItems = displayItems.slice(0, 32); 
  }

  // Split into 4 columns
  const col1 = displayItems.filter((_, i) => i % 4 === 0);
  const col2 = displayItems.filter((_, i) => i % 4 === 1);
  const col3 = displayItems.filter((_, i) => i % 4 === 2);
  const col4 = displayItems.filter((_, i) => i % 4 === 3);

  const actionChips = [
    { label: t.regions?.trending || "Trending", href: "?tab=trending#latest-results" },
    ...regions.map(r => ({ label: r.name, href: `?tab=${r.id}#latest-results` }))
  ];

  return (
    <section className="group relative z-20 w-full h-[100svh] min-h-[600px] bg-neutral-80 dark:bg-neutral-650 transition-all duration-700 hover:shadow-[inset_0_0_100px_rgba(216,176,95,0.03)]">
      {/* Required Keyframes for scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollUp {
          /* Starts at 0, moves up by exactly half its total height (which is exactly one set of items) */
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 0.5rem)); } /* Accounting for gap */
        }
      `}} />

      {/* Masonry Background layer*/}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="container mx-auto px-4 h-full relative">
          {/* Top mask */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-900/95 via-neutral-80/20 dark:from-neutral-650/80 dark:via-neutral-650/30 to-transparent z-10 pointer-events-none" />

          {/* Ambient Golden Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-new/20 via-transparent to-transparent mix-blend-screen opacity-50 dark:opacity-100" />

          {/* Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-full items-start opacity-40 dark:opacity-60 transition-opacity duration-700 group-hover:opacity-60 dark:group-hover:opacity-80">
            {/* Mobile single column (combination of col1 and col2 for reasonable loop length) */}
            <ScrollingColumn colItems={[...col1, ...col2]} speedStr="100s" className="mt-4 md:hidden" isHoverable={true} priorityCount={2} />
            {/* Desktop columns */}
            <ScrollingColumn colItems={col1} speedStr="45s" className="mt-8 hidden md:flex" isHoverable={true} priorityCount={1} />
            <ScrollingColumn colItems={col2} speedStr="55s" className="-mt-12 hidden md:flex" isHoverable={true} priorityCount={1} />
            <ScrollingColumn colItems={col3} speedStr="65s" className="mt-4 hidden md:flex" isHoverable={true} />
            <ScrollingColumn colItems={col4} speedStr="50s" className="mt-16 hidden md:flex" isHoverable={true} />
          </div>
        </div>
      </div>

      {/* Bottom text overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/95 via-white/40 dark:from-[#111111]/60 dark:via-[#111111]/10 to-transparent flex flex-col justify-end pointer-events-none">
        <div className="container mx-auto px-4 pb-8 md:pb-16 pointer-events-auto">
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-6">
            
            <div className="space-y-4">
              <h1 className="text-2xl md:text-5xl lg:text-[54px] font-bold leading-[1.1] tracking-tight drop-shadow-md text-gold-new transition-all duration-500 group-hover:scale-[1.01]">
                <span>
                  {t.hero?.titleHighlight || "Worldwide"}
                </span>{" "}
                <span>
                  {t.hero?.titleSuffix || "Lottery Result"}
                </span>
              </h1>
              <p className="text-sm md:text-lg text-neutral-800 dark:text-white max-w-2xl mx-auto font-bold tracking-wide drop-shadow-sm">
                {t.hero?.subtitle || "Fast, Accurate, and reliable worldwide lottery results platform"}
              </p>
            </div>

            <div className="w-full max-w-2xl mx-auto pt-2 pb-4">
              <CheckLotteryWidget lotteryGroups={lotteryGroups} variant="hero" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pb-8">
              <Link 
                href="/global_results"
                className="flex items-center gap-2 px-6 py-[10px] rounded-[100px] border border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:bg-transparent dark:text-white dark:hover:bg-transparent dark:hover:border-gold-new hover:shadow-[0_0_15px_rgba(216,176,95,0.5)] transition-all duration-300 backdrop-blur-md font-medium text-[15px] group/btn"
              >
                <Compass className="w-4 h-4 text-current transition-transform duration-300 group-hover/btn:rotate-45" strokeWidth={2.5}/>
                <span>{t.hero?.exploreGlobalResults || "Explore Global Results"}</span>
              </Link>
              
              {actionChips.map((chip, idx) => (
                <Link
                  key={idx}
                  href={chip.href}
                  className="px-6 py-[10px] rounded-[100px] border border-neutral-200 bg-transparent text-neutral-700 hover:bg-neutral-100 dark:border-white/20 dark:bg-transparent dark:text-white/80 dark:hover:bg-transparent dark:hover:border-gold-new dark:hover:text-white hover:shadow-[0_0_10px_rgba(216,176,95,0.4)] transition-all duration-300 backdrop-blur-md font-medium text-[15px]"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
