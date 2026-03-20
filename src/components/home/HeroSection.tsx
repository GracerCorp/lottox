"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LotteryCard } from "@/components/home/LotteryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface HeroItem {
  id: string;
  name: string;
  country: string;
  flag: string;
  jackpot: string;
  nextDraw: string;
  gradientFrom: string;
  gradientTo: string;
  href: string;
  bgImage: string;
  prizes?: { label: string; amount: string }[];
  drawNumbers?: string[];
  nextDrawDate?: string;
}

export function HeroSection({ items = [] }: { items?: HeroItem[] }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const displayItems =
    items.length > 0
      ? Array(Math.max(1, Math.ceil(6 / items.length)))
          .fill(items)
          .flat()
          .slice(0, Math.max(6, items.length))
      : [];

  const totalSlides = displayItems.length;

  const handlePrev = () => {
    if (totalSlides === 0) return;
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalSlides === 0) return;
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isPaused || totalSlides === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  // Progress bar percentage
  const progressPercent =
    totalSlides > 0 ? ((activeIndex + 1) / totalSlides) * 100 : 0;

  return (
    <section className="relative py-8 md:py-14 overflow-hidden">
      {/* Dynamic background image — crossfades with active card */}
      {displayItems.map(
        (item, index) =>
          item.bgImage && (
            <div
              key={`bg-${index}`}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out z-0"
              style={{ opacity: index === activeIndex ? 70 : 0 }}
            >
              <Image
                src={item.bgImage}
                alt=""
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ),
      )}

      {/* Gradient overlay on top of bg image */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-80/80 via-slate-50/90 to-slate-50 dark:from-navy-950/60 dark:via-navy-950/60 dark:to-navy-950 pointer-events-none z-[1]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side — Title + Subtitle */}
          <div className="lg:w-[35%] text-center lg:text-left space-y-4 flex-shrink-0">
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold leading-tight">
              <span className="text-gold-400">{t.hero.titleHighlight}</span>
              <br />
              <span className="text-gray-900 dark:text-white">
                {t.hero.titleSuffix}
              </span>
            </h1>
            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto lg:mx-0">
              {t.hero.subtitle ||
                "Fast, Accurate, and reliable worldwide lottery results platform"}
            </p>
          </div>

          {/* Right side — Carousel */}
          <div
            className="lg:w-[65%] relative w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Cards Track */}
            <div className="flex h-[380px] md:h-[420px] items-center justify-center w-full relative">
              {displayItems.length === 0 && (
                <div className="text-gray-500">
                  {t.common?.error || "No data"}
                </div>
              )}
              {displayItems.map((item, index) => {
                let distance = 0;
                const total = displayItems.length;
                const diff = (index - activeIndex + total) % total;
                if (diff > total / 2) {
                  distance = diff - total;
                } else {
                  distance = diff;
                }
                if (Math.abs(distance) > 2) return null;

                const isActive = distance === 0;

                return (
                  <div
                    key={index}
                    className={cn(
                      "absolute transition-all duration-700 ease-out w-[70%] max-w-[260px] md:max-w-[300px]",
                      isActive
                        ? "z-30"
                        : Math.abs(distance) === 1
                          ? "z-20"
                          : "z-10",
                    )}
                    style={{
                      transform: `translateX(${distance * 65}%) scale(${isActive ? 1.05 : 1 - Math.abs(distance) * 0.12})`,
                      opacity: isActive ? 1 : 1 - Math.abs(distance) * 0.35,
                      filter: isActive
                        ? "none"
                        : `blur(${Math.abs(distance) * 1.5}px)`,
                    }}
                  >
                    <div className="transform transition-all duration-500 origin-center relative">
                      <LotteryCard {...item} isActive={isActive} />
                      {isActive && (
                        <>
                          <div className="absolute inset-0 rounded-2xl border-2 border-gold-400/60 shadow-[0_0_25px_rgba(250,204,21,0.4)] pointer-events-none z-10" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold-400/20 blur-[50px] rounded-[100%] z-[-1]" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls — Arrows + Progress Bar + Counter */}
            <div className="flex items-center justify-center gap-4 mt-2">
              {/* Prev Arrow */}
              <button
                onClick={handlePrev}
                className="rounded-full border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-navy-900/60 p-2.5 text-gray-700 dark:text-white backdrop-blur-md transition-all hover:bg-gray-100 dark:hover:bg-navy-800 hover:scale-110 flex-shrink-0"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Next Arrow */}
              <button
                onClick={handleNext}
                className="rounded-full border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-navy-900/60 p-2.5 text-gray-700 dark:text-white backdrop-blur-md transition-all hover:bg-gray-100 dark:hover:bg-navy-800 hover:scale-110 flex-shrink-0"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Linear Progress Bar */}
              <div className="flex-1 max-w-[300px] h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden mx-2">
                <div
                  className="h-full bg-gold-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Slide counter */}
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium tabular-nums flex-shrink-0">
                {activeIndex + 1}/{totalSlides}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
