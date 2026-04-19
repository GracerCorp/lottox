"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface LotteryCardV2Props {
  name: string;
  country: string;
  flag: string;
  jackpot: string;
  nextDraw: string;
  gradientFrom: string;
  gradientTo: string;
  bgImage?: string;
  href?: string;
  prizes?: { label: string; amount: string }[];
  isHoverable?: boolean;
  imgPriority?: boolean;
}

export function LotteryCardV2({
  name,
  country,
  flag,
  jackpot,
  nextDraw,
  href = "#",
  bgImage,
  prizes,
  isHoverable = false,
  imgPriority = false,
}: LotteryCardV2Props) {
  const { t } = useLanguage();
  const fallbackLabel = t.lotteryCard.firstPrize;
  const displayPrizes = prizes || [{ label: fallbackLabel, amount: jackpot }];

  const firstPrize = displayPrizes[0];
  const pairPrizes = displayPrizes.slice(1, 3);

  return (
    <Link href={href} className={cn("block group/card w-full mb-4 md:mb-6", isHoverable && "hover-enabled")}>
      <div className={cn(
        "relative overflow-hidden rounded-[24px] aspect-square bg-neutral-900 border border-gray-200 dark:border-white/5 shadow-2xl transition-all duration-300",
        isHoverable && "group-hover/card:scale-[1.02] group-hover/card:ring-1 group-hover/card:ring-gold-new/50 group-hover/card:shadow-[0_0_20px_rgba(216,176,95,0.4)]"
      )}>
        
        {/* Background Image & Gradient */}
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt={name}
              fill
              className="object-cover opacity-60 mix-blend-luminosity"
              priority={imgPriority}
              sizes="(max-width: 768px) 90vw, 25vw"
            />
          </div>
        )}
        
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/80 to-neutral-950/40" />

        <div className="relative z-10 flex flex-col h-full p-4 sm:p-5">
          {/* Top: Flag + Country + Lottery Name */}
          <div className="mb-auto text-center flex flex-col justify-center items-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {!flag.includes("/") ? (
                <div className="relative h-5 w-7 shrink-0 flex items-center justify-center">
                  <span className="text-sm leading-none">{flag}</span>
                </div>
              ) : flag.includes("flag") ? (
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white/5">
                  <Image src={flag} alt={`${country} flag`} fill className="object-cover scale-110" />
                </div>
              ) : (
                <div className="relative h-5 w-7 shrink-0 flex items-center justify-center">
                  <Image src={flag} alt={`${country} flag`} fill className="object-cover" />
                </div>
              )}
              <span className="text-[13px] font-semibold text-white/90 uppercase tracking-wider truncate">
                {country}
              </span>
            </div>
            <h3 className="text-[13px] font-medium text-white/60 leading-tight line-clamp-1 w-full truncate">
              {name}
            </h3>
          </div>

          {/* Middle: Prizes */}
          <div className="flex flex-col flex-1 justify-center items-center py-4 space-y-4">
            {firstPrize && (
              <div className="text-center w-full">
                <span className="block text-[11px] font-medium text-white/50 mb-1 tracking-widest uppercase">
                  {firstPrize.label}
                </span>
                <span className="block text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                  {firstPrize.amount}
                </span>
              </div>
            )}
            
            {pairPrizes.length > 0 && (
              <div className="flex w-full justify-center gap-6">
                {pairPrizes.map((prize, idx) => (
                  <div key={idx} className="text-center relative">
                    <span className="block text-[10px] text-white/50 mb-0.5 tracking-wider uppercase">
                      {prize.label}
                    </span>
                    <span className="block text-[13px] font-semibold text-white/90">
                      {prize.amount}
                    </span>
                    {idx === 0 && pairPrizes.length > 1 && (
                      <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-px h-6 bg-white/10" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom: Draw Info Pill */}
          <div className="mt-auto pt-2 flex justify-center">
            <div className="bg-neutral-950/70 backdrop-blur-md rounded-2xl border border-white/5 px-4 py-2.5 text-center w-full">
              <span className="block text-[10px] text-white/40 uppercase tracking-widest mb-0.5">
                {t.common.drawOn}
              </span>
              <span className="block text-[13px] font-semibold text-gold-new">
                {nextDraw}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
