"use client";

import { useState, useEffect, useRef } from "react";
import { LotteryCard } from "@/components/home/LotteryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

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
}

export function HeroSection({ items = [] }: { items?: HeroItem[] }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate to create enough items for the carousel effect (6 items for 2-1-2 layout)
  const displayItems =
    items.length > 0
      ? Array(Math.max(1, Math.ceil(6 / items.length)))
          .fill(items)
          .flat()
          .slice(0, Math.max(6, items.length))
      : [];

  const handlePrev = () => {
    if (displayItems.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? displayItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (displayItems.length === 0) return;
    setActiveIndex((prev) => (prev === displayItems.length - 1 ? 0 : prev + 1));
  };

  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        handleNext();
      }
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  });

  const onMouseEnter = () => setIsPaused(true);
  const onMouseLeave = () => setIsPaused(false);

  return (
    <section className="relative py-12 md:py-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-blue-500/10 to-transparent opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-normal text-gray-900 dark:text-gray-50/80 mb-4 tracking-tight"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>

        {/* Carousel */}
        <div
          className="relative w-full py-10"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-10 top-1/2 z-40 -translate-y-1/2 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-navy-900/50 p-3 text-gray-900 dark:text-white backdrop-blur-md transition-all hover:bg-white dark:hover:bg-navy-800 hover:scale-110 shadow-sm"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-10 top-1/2 z-40 -translate-y-1/2 rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-navy-900/50 p-3 text-gray-900 dark:text-white backdrop-blur-md transition-all hover:bg-white dark:hover:bg-navy-800 hover:scale-110 shadow-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Track */}
          <div className="flex h-[450px] items-center justify-center w-full">
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

              let zIndex = "z-0";
              if (distance === 0) zIndex = "z-30";
              else if (Math.abs(distance) === 1) zIndex = "z-20";
              else zIndex = "z-10";

              return (
                <div
                  key={index}
                  className={cn(
                    "absolute transition-all duration-700 ease-out w-[85%] max-w-[300px] md:max-w-[350px]",
                    zIndex,
                  )}
                  style={{
                    transform: `translateX(${distance * 70}%) scale(${distance === 0 ? 1.05 : 1 - Math.abs(distance) * 0.15})`,
                    opacity: distance === 0 ? 1 : 1 - Math.abs(distance) * 0.3,
                    filter:
                      distance === 0
                        ? "none"
                        : `blur(${Math.abs(distance) * 2}px)`,
                    zIndex: 30 - Math.abs(distance) * 10,
                  }}
                >
                  <div className="transform transition-all duration-500 origin-center relative">
                    <LotteryCard {...item} />
                    {distance === 0 && (
                      <>
                        {/* Aura Border */}
                        <div className="absolute inset-x-0 inset-y-0 rounded-2xl border-2 border-gold-400/80 shadow-[0_0_20px_rgba(250,204,21,0.6),inset_0_0_20px_rgba(250,204,21,0.4)] pointer-events-none z-10" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-gold-400/40 dark:bg-gold-500/30 blur-[60px] rounded-[100%] z-[-1] animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gold-500/20 dark:bg-gold-600/20 blur-[100px] rounded-[100%] z-[-2]" />
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[100%] h-32 bg-gold-400/40 dark:bg-gold-500/30 blur-[50px] rounded-[100%] z-[-1]" />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
