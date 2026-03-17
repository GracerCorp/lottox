"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface LotteryCardProps {
  name: string;
  country: string;
  flag: string;
  jackpot: string;
  nextDraw: string;
  gradientFrom: string;
  gradientTo: string;
  bgImage?: string;
  href?: string;
  isActive?: boolean;
  prizes?: { label: string; amount: string }[];
  drawNumbers?: string[];
  nextDrawDate?: string; // ISO date for countdown
}

/* ---------- Countdown hook ---------- */
function useCountdown(targetDate?: string) {
  const calcRemaining = useCallback(() => {
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
    };
  }, [targetDate]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  return remaining;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function LotteryCard({
  name,
  country,
  flag,
  jackpot,
  nextDraw,
  gradientFrom,
  gradientTo,
  href = "#",
  bgImage,
  isActive = false,
  prizes,
  nextDrawDate,
}: LotteryCardProps) {
  const [hovered, setHovered] = useState(false);
  const countdown = useCountdown(nextDrawDate);

  // Default prizes if none provided
  const displayPrizes = prizes || [{ label: "1st Prize", amount: jackpot }];

  // Split prizes: 1st is hero, rest are pairs
  const firstPrize = displayPrizes[0];
  const pairPrizes = displayPrizes.slice(1);
  // Group pairs: [[2nd, 3rd], [4th, 5th], ...]
  const prizePairs: { label: string; amount: string }[][] = [];
  for (let i = 0; i < pairPrizes.length; i += 2) {
    prizePairs.push(pairPrizes.slice(i, i + 2));
  }

  return (
    <Link
      href={href}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl aspect-[3/4] group cursor-pointer border transition-all duration-500",
          isActive
            ? "border-gold-400/40 shadow-2xl"
            : "border-white/10 shadow-lg",
        )}
      >
        {/* Background Image */}
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-navy-950/75 group-hover:bg-navy-950/65 transition-colors duration-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-70 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-50",
            isActive
              ? "from-amber-700 to-amber-900"
              : `${gradientFrom} ${gradientTo}`,
          )}
        />

        {/* Active card — golden glow */}
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/25 via-yellow-500/15 to-orange-600/25 z-[1]" />
        )}

        {/* Content */}
        <div className="relative h-full p-5 flex flex-col z-10">
          {/* Header — Flag + Country + Name */}
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative h-4 w-6 overflow-hidden rounded shadow-sm flex-shrink-0">
                <Image
                  src={flag}
                  alt={`${country} flag`}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider truncate">
                {country}
              </span>
            </div>
            <h3 className="text-base md:text-lg font-bold text-white leading-tight truncate">
              {name}
            </h3>
          </div>

          {/* Prize breakdown — centered layout */}
          <div className="flex-1 flex flex-col justify-center py-2">
            {/* 1st Prize — centered, large */}
            {firstPrize && (
              <div className="text-center mb-3">
                <span className="block text-[10px] font-medium text-white/50 uppercase tracking-widest mb-0.5">
                  {firstPrize.label}
                </span>
                <span className="block text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
                  {firstPrize.amount}
                </span>
              </div>
            )}

            {/* Paired prizes — 2 per row, right-aligned amounts */}
            {prizePairs.map((pair, rowIdx) => (
              <div
                key={rowIdx}
                className={cn(
                  "grid gap-x-4 gap-y-0.5",
                  pair.length === 2 ? "grid-cols-2" : "grid-cols-1",
                )}
              >
                {pair.map((prize, idx) => (
                  <div key={idx} className="text-center">
                    <span className="block text-[9px] font-medium text-white/40 uppercase tracking-wide">
                      {prize.label}
                    </span>
                    <span className="block text-sm md:text-base font-bold text-white/80 tracking-tight">
                      {prize.amount}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom — Countdown timer + Hover arrow */}
          <div className="flex items-center gap-2 mt-auto">
            {/* Timer bar */}
            <div className="flex-1 flex items-center justify-center gap-1 bg-navy-900/70 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
              {[
                { val: pad(countdown.days), label: "day" },
                { val: pad(countdown.hours), label: "hr" },
                { val: pad(countdown.minutes), label: "min" },
                { val: pad(countdown.seconds), label: "sec" },
              ].map((unit, i, arr) => (
                <span key={i} className="flex items-center gap-0.5">
                  <span className="flex flex-col items-center">
                    <span className="text-sm md:text-base font-bold text-white tracking-wider tabular-nums">
                      {unit.val}
                    </span>
                    <span className="text-[7px] text-white/30 uppercase tracking-wider leading-none">
                      {unit.label}
                    </span>
                  </span>
                  {i < arr.length - 1 && (
                    <span className="text-white/30 text-xs font-light mx-0.5">
                      :
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Hover arrow button — only on active + hovered */}
            <div
              className={cn(
                "flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gold-400 text-navy-950 shadow-lg transition-all duration-300",
                isActive && hovered
                  ? "opacity-100 translate-x-0 scale-100"
                  : "opacity-0 translate-x-2 scale-75 pointer-events-none",
              )}
            >
              <ArrowUpRight className="w-5 h-5" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
