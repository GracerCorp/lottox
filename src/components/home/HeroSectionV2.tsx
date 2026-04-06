"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { LotteryCardV2 } from "./LotteryCardV2";
import { Compass } from "lucide-react";
import Link from "next/link";
import { HeroItem } from "./HeroSection";

export function HeroSectionV2({ items = [] }: { items?: HeroItem[] }) {
  const { t } = useLanguage();

  // Ensure we have enough items to display a full grid
  // We want at least 12 items to make the columns look full before duplicating.
  const minimumItems = 12;
  const loopCount = Math.max(1, Math.ceil(minimumItems / Math.max(1, items.length)));
  const displayItems = Array(loopCount).fill(items).flat();

  // Split into 4 columns
  const col1 = displayItems.filter((_, i) => i % 4 === 0);
  const col2 = displayItems.filter((_, i) => i % 4 === 1);
  const col3 = displayItems.filter((_, i) => i % 4 === 2);
  const col4 = displayItems.filter((_, i) => i % 4 === 3);

  // Helper for scrolling columns
  const ScrollingColumn = ({ colItems, speedStr, reverse = false, className = "", isHoverable = false }: { colItems: HeroItem[], speedStr: string, reverse?: boolean, className?: string, isHoverable?: boolean }) => {
    // Duplicate the items for seamless infinite scrolling
    const doubleItems = [...colItems, ...colItems];

    return (
      <div className={`relative flex flex-col gap-4 md:gap-6 overflow-hidden ${className}`} style={{ height: "100%", paddingBottom: "24px" }}>
        <div 
          className="flex flex-col gap-4 md:gap-6 w-full scroll-animate"
          style={{
            animation: `${reverse ? "scrollDown" : "scrollUp"} ${speedStr} linear infinite`,
          }}
        >
          {doubleItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="w-full flex-shrink-0">
              <LotteryCardV2 {...item} isHoverable={isHoverable} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const actionChips = [
    { label: "Trending", href: "?tab=trending#latest-results" },
    { label: "Southeast Asia", href: "?tab=southeast-asia#latest-results" },
    { label: "Asia", href: "?tab=asia#latest-results" },
    { label: "Europe", href: "?tab=europe#latest-results" },
    { label: "America", href: "?tab=america#latest-results" },
    { label: "Oceania", href: "?tab=oceania#latest-results" },
  ];

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Required Keyframes for scrolling */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollUp {
          /* Starts at 0, moves up by exactly half its total height (which is exactly one set of items) */
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(-50% - 0.5rem)); } /* Accounting for gap */
        }
        @keyframes scrollDown {
          /* Starts offset by half (showing the second set), moves down to 0 */
          0% { transform: translateY(calc(-50% - 0.5rem)); }
          100% { transform: translateY(0); }
        }
      `}} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Side: Headlines & Chips */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col gap-8 flex-shrink-0 z-20">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.1]">
                <span className="text-gold-new">Worldwide</span>
                <br className="hidden md:block"/>
                <span className="text-gold-new"> Lottery Result</span>
              </h1>
              <p className="text-base md:text-lg text-white/70 max-w-lg mx-auto lg:mx-0">
                {t.hero?.subtitle || "Fast, Accurate, and reliable worldwide lottery results platform"}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link 
                href="/global-draws"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors shadow-sm backdrop-blur-md font-medium text-sm"
              >
                <Compass className="w-4 h-4 text-gold-new" strokeWidth={2.5}/>
                <span>Explore Global Results</span>
              </Link>
              
              {actionChips.map((chip, idx) => (
                <Link
                  key={idx}
                  href={chip.href}
                  className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white transition-colors shadow-sm backdrop-blur-md font-medium text-sm"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side: The Masonry Scroll */}
          <div className="w-full lg:w-[55%] xl:w-[60%] relative h-[600px] md:h-[700px] rounded-3xl overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-b before:from-neutral-950 before:to-transparent before:z-10 after:absolute after:inset-x-0 after:bottom-0 after:h-24 after:bg-gradient-to-t after:from-neutral-950 after:to-transparent after:z-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            
            {/* The Grid */}
            <div className="hero-masonry-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-full items-start">
              <ScrollingColumn colItems={col1} speedStr="45s" className="mt-8" />
              <ScrollingColumn colItems={col2} speedStr="55s" reverse={true} className="-mt-12" isHoverable={true} />
              <ScrollingColumn colItems={col3} speedStr="65s" className="mt-4" isHoverable={true} />
              <ScrollingColumn colItems={col4} speedStr="50s" reverse={true} className="mt-16 hidden md:flex" />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
