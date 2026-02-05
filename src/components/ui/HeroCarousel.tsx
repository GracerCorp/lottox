"use client";

import { useState, useEffect, useRef } from "react";
import { LotteryCard } from "@/components/ui/LotteryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lottery {
  country: string;
  flag: string;
  name: string;
  jackpot: string;
  nextDraw: string;
  balls: (string | number)[];
  bonusBall?: string | number;
  color: "gold" | "blue" | "purple";
  href?: string;
  bgImage?: string;
}

interface HeroCarouselProps {
  items: Lottery[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [activeIndex, isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // Pause on hover
  const onMouseEnter = () => setIsPaused(true);
  const onMouseLeave = () => setIsPaused(false);

  return (
    <div
      className="relative w-full py-10 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Navigation - Absolute Center Vertical */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-10 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/10 bg-navy-900/50 p-3 text-white backdrop-blur-md transition-all hover:bg-navy-800 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-10 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/10 bg-navy-900/50 p-3 text-white backdrop-blur-md transition-all hover:bg-navy-800 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Carousel Track */}
      <div className="flex h-[500px] items-center justify-center w-full">
        {items.map((item, index) => {
          // Calculate distance from active index, handling wrap-around
          let distance = 0;
          const total = items.length;

          // Find shortest distance in circular array
          const diff = (index - activeIndex + total) % total;
          if (diff > total / 2) {
            distance = diff - total; // Distance is negative (item is to the left)
          } else {
            distance = diff; // Distance is positive (item is to the right)
          }

          // We want to show 5 items: -2, -1, 0, 1, 2
          if (Math.abs(distance) > 2) return null;

          let scale = "scale-75 opacity-30 blur-[2px] z-0";
          let translateX = "translate-x-0";
          let zIndex = "z-0";

          if (distance === 0) {
            // Active Center
            scale =
              "scale-100 opacity-100 blur-0 shadow-2xl ring-2 ring-gold-500/20 z-30";
            translateX = "translate-x-0";
            zIndex = "z-30";
          } else if (Math.abs(distance) === 1) {
            // Immediate Neighbors (-1, 1)
            scale = "scale-90 opacity-70 blur-0 z-20";
            translateX =
              distance > 0 ? "translate-x-[60%]" : "-translate-x-[60%]";
            zIndex = "z-20";
          } else if (Math.abs(distance) === 2) {
            // Outer Neighbors (-2, 2)
            scale = "scale-[0.8] opacity-40 blur-[1px] z-10";
            translateX =
              distance > 0 ? "translate-x-[110%]" : "-translate-x-[110%]";
            zIndex = "z-10";
          }

          return (
            <div
              key={index}
              className={cn(
                "absolute transition-all duration-700 ease-out w-[90%] max-w-[320px] md:max-w-[400px]",
                zIndex,
              )}
              style={{
                transform: `translateX(${distance * 105}%) scale(${distance === 0 ? 1.1 : 1 - Math.abs(distance) * 0.15})`,
                opacity: distance === 0 ? 1 : 1 - Math.abs(distance) * 0.3,
                filter:
                  distance === 0 ? "none" : `blur(${Math.abs(distance)}px)`,
                zIndex: 30 - Math.abs(distance) * 10,
              }}
            >
              <div
                className={cn(
                  "transform transition-all duration-500 origin-center",
                )}
              >
                <LotteryCard
                  {...item}
                  className="h-[430px] w-full shadow-2xl"
                />
                {distance === 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full h-20 bg-gold-500/20 blur-[50px] rounded-full z-[-1]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
