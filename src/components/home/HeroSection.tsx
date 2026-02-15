"use client";

import { useState, useEffect, useRef } from "react";
import { LotteryCard } from "@/components/home/LotteryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export function HeroSection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Define lotteries
  const THAI_LOTTO = {
    name: t.lottery.thai.subName,
    country: t.lottery.thai.country,
    flag: "https://flagcdn.com/w80/th.png",
    jackpot: "6,000,000 ฿",
    nextDraw: "19/02/2026 16:00",
    gradientFrom: "from-blue-900",
    gradientTo: "to-red-900",
    href: "/results/thai-lotto",
    bgImage: "https://images.unsplash.com/photo-1668107710159-10fbbab2a9dd?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  const LAO_LOTTO = {
    name: t.lottery.lao.subName,
    country: t.lottery.lao.country,
    flag: "https://flagcdn.com/w80/la.png",
    jackpot: "x6,000", // Multiplier
    nextDraw: "19/02/2026 15:00",
    gradientFrom: "from-blue-800",
    gradientTo: "to-purple-900",
    href: "/results/lao-lotto",
    bgImage: "https://images.unsplash.com/photo-1725017766702-2a2eff1228cd?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  // Duplicate to create enough items for the carousel effect (6 items for 2-1-2 layout)
  const items = [
    THAI_LOTTO,
    LAO_LOTTO,
    THAI_LOTTO,
    LAO_LOTTO,
    THAI_LOTTO,
    LAO_LOTTO,
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
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
            className="text-4xl md:text-6xl font-normal text-gray-50/80 mb-4 tracking-tight"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
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
            className="absolute left-2 md:left-10 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/10 bg-navy-900/50 p-3 text-white backdrop-blur-md transition-all hover:bg-navy-800 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-10 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/10 bg-navy-900/50 p-3 text-white backdrop-blur-md transition-all hover:bg-navy-800 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Track */}
          <div className="flex h-[450px] items-center justify-center w-full">
            {items.map((item, index) => {
              let distance = 0;
              const total = items.length;
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
                    <LotteryCard {...item} hideResults={true} />
                    {distance === 0 && (
                      <>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gold-500/20 blur-[50px] rounded-full z-[-1] animate-pulse" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-600/10 blur-[80px] rounded-full z-[-2]" />
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-gold-500/15 blur-[40px] rounded-[100%] z-[-1]" />
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
