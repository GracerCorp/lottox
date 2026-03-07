"use client";
import React from "react";
import { LotteryBall } from "@/components/ui/LotteryBall";
import { Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Prize {
  name: string;
  amount: string;
  numbers: string[];
}

interface DynamicPrize {
  prizeName: string;
  prizeAmount: number;
  winningNumbers: string[];
  order?: number;
  category?: string;
  prizeCount?: number;
}

interface DrawResultProps {
  country?: string;
  lotteryName?: string;
  date: string;
  firstPrize: string;
  firstPrizeAmount: string;
  prizes?: Prize[];
  dynamicPrizes?: DynamicPrize[];
  // For Thai Lotto specific
  front3?: string[];
  front3Amount?: string;
  back3?: string[];
  back3Amount?: string;
  last2?: string;
  last2Amount?: string;
  adjacent?: string[];
  adjacentAmount?: string;
  currency?: string;
}

export function DrawResult({
  country,
  lotteryName,
  date,
  firstPrize,
  firstPrizeAmount,
  dynamicPrizes = [],
  front3 = [],
  front3Amount,
  back3 = [],
  back3Amount,
  last2,
  last2Amount,
  adjacent = [],
  adjacentAmount,
  currency,
}: DrawResultProps) {
  const { t } = useLanguage();
  const displayCurrency = currency || t.common.currency;

  // Determine if we should use dynamic rendering (non-Thai lotteries)
  const useDynamic = dynamicPrizes.length > 0;

  // Helper to get localized prize names based on category or raw prize name
  const getPrizeName = (prize: DynamicPrize) => {
    const cat = prize.category || "";
    const name = prize.prizeName || "";

    // Lao mappings
    if (cat === "prize_2_digits" || name === "prize_2_digits")
      return t.results.prize_2_digits;
    if (cat === "prize_3_digits" || name === "prize_3_digits")
      return t.results.prize_3_digits;
    if (cat === "prize_4_digits" || name === "prize_4_digits")
      return t.results.prize_4_digits;
    if (cat === "prize_modern_5" || name === "prize_modern_5")
      return t.results.prize_modern_5;

    // Thai mappings
    if (cat === "prize_1" || name === "prize_1") return t.results.prize_1_thai;
    if (cat === "prize_2" || name === "prize_2") return t.results.prize2rank;
    if (cat === "prize_3" || name === "prize_3") return t.results.prize3rank;
    if (cat === "prize_4" || name === "prize_4") return t.results.prize4rank;
    if (cat === "prize_5" || name === "prize_5") return t.results.prize5rank;
    if (
      cat === "running_number_front_3" ||
      name === "running_number_front_3" ||
      name === "3 Front"
    )
      return t.results.running_number_front_3;
    if (
      cat === "running_number_back_3" ||
      name === "running_number_back_3" ||
      name === "3 Back"
    )
      return t.results.running_number_back_3;
    if (
      cat === "running_number_back_2" ||
      name === "running_number_back_2" ||
      name === "2 Back"
    )
      return t.results.running_number_back_2;
    if (cat === "nearby_prize_1" || name === "nearby_prize_1")
      return t.results.nearby_prize_1;

    return name;
  };

  // For dynamic: separate the first prize from the rest
  const sortedDynamic = [...dynamicPrizes].sort((a, b) => {
    const oa = a.order ?? 99;
    const ob = b.order ?? 99;
    return oa - ob;
  });
  const dynamicFirst = sortedDynamic[0];
  const dynamicRest = sortedDynamic.slice(1);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-white via-gray-50 to-white dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 shadow-2xl">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-neon-blue/10 blur-3xl" />

      <div className="relative z-10 p-6 sm:p-8">
        {(country || lotteryName) && (
          <div className="mb-2 text-center text-sm uppercase tracking-widest text-gold-400">
            {country}
          </div>
        )}

        <div className="mb-4 flex flex-col items-center justify-center gap-2">
          {lotteryName && (
            <h2 className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-5xl text-center leading-tight">
              {lotteryName}
            </h2>
          )}

          <div className="mt-2 inline-flex flex-col items-center justify-center rounded-2xl border border-gold-500/20 bg-white/50 px-6 py-3 shadow-[0_8px_30px_rgb(245,158,11,0.06)] backdrop-blur-sm sm:flex-row sm:gap-4 dark:bg-navy-900/50">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl dark:from-white dark:to-gray-300">
              {date}
            </span>
          </div>
        </div>

        {/* 1st Prize */}
        <div className="mb-8">
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-gold-400">
              <Trophy className="h-4 w-4" />
              {useDynamic ? getPrizeName(dynamicFirst!) : t.results.prize1} (
              {t.common.perPrize}{" "}
              <span className="text-gray-900 dark:text-white ml-1">
                {useDynamic
                  ? `${dynamicFirst?.prizeAmount?.toLocaleString() || firstPrizeAmount}`
                  : firstPrizeAmount}{" "}
                {displayCurrency})
              </span>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {(useDynamic
              ? dynamicFirst?.winningNumbers?.[0] || firstPrize
              : firstPrize
            )
              .split("")
              .map((n, i) => (
                <LotteryBall
                  key={i}
                  number={n}
                  size="lg"
                  color="gold"
                  className="h-16 w-16 text-4xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] sm:h-20 sm:w-20 sm:text-5xl"
                />
              ))}
          </div>
        </div>

        {/* Dynamic prizes rendering (for non-Thai lotteries like Lao, Vietnam) */}
        {useDynamic && dynamicRest.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-white/10 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/60 shadow-sm">
            {dynamicRest.map((prize, idx) => (
              <div
                key={idx}
                className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-navy-800/80"
              >
                <div className="mb-2 text-md font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {getPrizeName(prize)}
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  {prize.winningNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="font-mono text-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                    >
                      {num}
                    </span>
                  ))}
                </div>
                {prize.prizeAmount > 0 && (
                  <span className="mt-1 block text-md text-gold-600 dark:text-gold-400">
                    {prize.prizeAmount.toLocaleString()} {displayCurrency}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Thai Lotto Specific: 3-digit / 2-digit / adjacent (fallback when NOT using dynamic) */}
        {!useDynamic &&
          (front3.length > 0 ||
            back3.length > 0 ||
            last2 ||
            adjacent.length > 0) && (
            <div className="mt-8 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-white/10 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/60 shadow-sm">
              {front3.length > 0 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-navy-800/80">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t.results.prize3Front}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {front3.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {front3Amount && (
                    <span className="mt-1 block text-[10px] text-gold-600 dark:text-gold-400">
                      {front3Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}

              {back3.length > 0 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-navy-800/80">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t.results.prize3Back}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {back3.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {back3Amount && (
                    <span className="mt-1 block text-[10px] text-gold-600 dark:text-gold-400">
                      {back3Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}

              {last2 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-navy-800/80">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                    {t.results.prize2}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    <span className="font-mono text-4xl font-bold tracking-widest text-gold-600 dark:text-gold-400">
                      {last2}
                    </span>
                  </div>
                  {last2Amount && (
                    <span className="mt-1 block text-[10px] text-gray-900 dark:text-white">
                      {last2Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}

              {adjacent.length > 0 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-navy-800/80">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t.common.adjacent}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {adjacent.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-lg font-bold tracking-widest text-gray-900 dark:text-white sm:text-lg"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {adjacentAmount && (
                    <span className="mt-1 block text-[10px] text-gold-600 dark:text-gold-400">
                      {adjacentAmount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
      </div>
    </section>
  );
}
