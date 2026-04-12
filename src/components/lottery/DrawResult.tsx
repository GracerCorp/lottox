"use client";
import React from "react";
import { LotteryBall } from "@/components/ui/LotteryBall";
import { Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getBalls = (numbersStrOrArr: string[] | string): string[] => {
  if (!numbersStrOrArr) return [];
  if (Array.isArray(numbersStrOrArr)) {
    if (numbersStrOrArr.length > 1) return numbersStrOrArr;
    if (numbersStrOrArr.length === 1) {
      const item = String(numbersStrOrArr[0]);
      if (item.includes(",")) return item.split(",").map(s => s.trim()).filter(Boolean);
      if (item.includes(" ")) return item.split(" ").map(s => s.trim()).filter(Boolean);
      if (item.includes("-")) return item.split("-").map(s => s.trim()).filter(Boolean);
      return item.split("");
    }
    return [];
  }
  const s = String(numbersStrOrArr || "");
  if (s.includes(",")) return s.split(",").map(x => x.trim()).filter(Boolean);
  if (s.includes(" ")) return s.split(" ").map(x => x.trim()).filter(Boolean);
  if (s.includes("-")) return s.split("-").map(x => x.trim()).filter(Boolean);
  return s.split("");
};

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
  prizeLabels?: {
    firstPrize?: string;
    last3f?: string;
    last3b?: string;
    last2?: string;
  };
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
  prizeLabels,
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

  const isAustraliaUI = country?.toLowerCase().includes("australia") || lotteryName?.toLowerCase().includes("australia") || lotteryName?.toLowerCase().includes("powerball") || lotteryName?.toLowerCase().includes("oz lotto");

  if (isAustraliaUI) {
    return (
      <section className="relative overflow-hidden rounded-[1.5rem] bg-gray-50 dark:bg-[#1d1d1d] border border-gray-200 dark:border-white/5 shadow-2xl p-6 sm:p-8">
        {/* Date Pill */}
        <div className="flex justify-center mb-8">
          <div className="border border-gold-500/50 dark:border-[#786134] rounded-full px-6 py-2 text-gold-600 dark:text-[#C0A062] text-sm font-medium tracking-wide">
            {date}
          </div>
        </div>

        {/* Labels Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-3 bg-gold-50/50 dark:bg-[#382b13]/40 rounded-xl px-5 py-3 border border-gold-200 dark:border-[#6b5526]/30">
            <Trophy className="w-6 h-6 text-gold-500 dark:text-[#DFC38E]" />
            <span className="text-gold-600 dark:text-[#DFC38E] font-bold text-lg tracking-wide">{t.common.winningNumbers}</span>
          </div>
          <div className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
            {t.lotteryCard.firstPrize} - <span className="text-gold-600 dark:text-[#DFC38E] font-bold">{(useDynamic ? dynamicFirst?.prizeAmount?.toLocaleString() : firstPrizeAmount) || 0} {displayCurrency}</span>
          </div>
        </div>

        {/* Main Balls */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-4">
          {getBalls(useDynamic ? dynamicFirst?.winningNumbers || [] : [firstPrize]).map((n, i) => (
            <LotteryBall
              key={i}
              number={n}
              size="xl"
              shape="squircle"
              color="gold"
              className="!bg-gradient-to-b !from-gold-300 !to-gold-500 dark:!from-[#ECD299] dark:!to-[#D5AB63] !text-gray-900 dark:!text-[#181818] shadow-[0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-none"
            />
          ))}
        </div>

        {/* Bonus Section inside the hero */}
        {useDynamic && dynamicRest.length > 0 && (
          <div className="flex justify-center mt-10">
            <div className="border border-gray-200 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] rounded-2xl px-12 py-6">
              <div className="text-center text-gray-900 dark:text-white font-bold text-base mb-5 tracking-wide">{t.results.bonusNumber}</div>
              <div className="flex flex-row justify-center gap-4">
                {dynamicRest.map((prize) => getBalls(prize.winningNumbers).map((num, i) => (
                  <LotteryBall
                    key={`${prize.prizeName}-${i}`}
                    number={num}
                    size="lg"
                    shape="squircle"
                    color="dark-gray"
                    className="!w-[3.5rem] !h-[3rem] sm:!w-[4.25rem] sm:!h-[3.5rem] !bg-gray-100 dark:!bg-[#535353] !border-gray-300 dark:!border-[#666] !rounded-2xl !text-xl !text-gray-800 dark:!text-white"
                  />
                )))}
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-white via-gray-50 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 shadow-2xl">
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-48 w-48 rounded-full bg-neon-blue/10 blur-3xl" />

      <div className="relative z-10 p-6 sm:p-8">
        {(country || lotteryName) && (
          <div className="mb-2 text-center text-fs-sm uppercase tracking-widest text-gold-400">
            {country}
          </div>
        )}

        <div className="mb-4 flex flex-col items-center justify-center gap-2">
          {lotteryName && (
            <h2 className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-fs-5xl font-black tracking-tight text-transparent drop-shadow-sm text-center leading-tight">
              {lotteryName}
            </h2>
          )}

          <div className="mt-2 inline-flex flex-col items-center justify-center rounded-2xl border border-gold-500/20 bg-white/50 px-6 py-3 shadow-[0_8px_30px_rgb(245,158,11,0.06)] backdrop-blur-sm sm:flex-row sm:gap-4 dark:bg-neutral-900/50">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-fs-2xl font-bold text-transparent dark:from-white dark:to-gray-300">
              {date}
            </span>
          </div>
        </div>

        {/* 1st Prize */}
        <div className="mb-8">
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 text-fs-sm font-bold uppercase tracking-wider text-gold-400">
              <Trophy className="h-4 w-4" />
              {useDynamic ? getPrizeName(dynamicFirst!) : (prizeLabels?.firstPrize || t.results.prize1)} (
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
            {getBalls(
              useDynamic
                ? dynamicFirst?.winningNumbers || []
                : [firstPrize]
            ).map((n, i) => (
                <LotteryBall
                  key={i}
                  number={n}
                  size="lg"
                  color="gold"
                  className="h-12 w-12 text-3xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] sm:h-16 sm:w-16 sm:text-4xl md:h-20 md:w-20 md:text-5xl"
                />
              ))}
          </div>
        </div>

        {/* Dynamic prizes rendering (for non-Thai lotteries like Lao, Vietnam) */}
        {useDynamic && dynamicRest.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-white/10 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800/60 shadow-sm">
            {dynamicRest.map((prize, idx) => (
              <div
                key={idx}
                className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/80"
              >
                <div className="mb-2 text-fs-badge font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {getPrizeName(prize)}
                </div>
                <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                  {getBalls(prize.winningNumbers).map((num, i) => {
                    const isSpecial = prize.prizeName?.toLowerCase().includes("power") || prize.prizeName?.toLowerCase().includes("mega") || prize.prizeName?.toLowerCase().includes("bonus");
                    return (
                      <LotteryBall
                        key={i}
                        number={num}
                        size="md"
                        color={isSpecial ? "blue" : "gray"}
                        isBonus={isSpecial}
                        className="h-10 w-10 text-xl font-bold sm:h-12 sm:w-12 sm:text-2xl"
                      />
                    );
                  })}
                </div>
                {prize.prizeAmount > 0 && (
                  <span className="mt-1 block text-fs-badge text-gold-600 dark:text-gold-400">
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
            <div className="mt-8 flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-white/10 overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800/60 shadow-sm">
              {front3.length > 0 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/80">
                  <div className="mb-2 text-fs-badge font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {prizeLabels?.last3f || t.results.prize3Front}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {front3.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-fs-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {front3Amount && (
                    <span className="mt-1 block text-fs-badge text-gold-600 dark:text-gold-400">
                      {front3Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}

              {back3.length > 0 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/80">
                  <div className="mb-2 text-fs-badge font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {prizeLabels?.last3b || t.results.prize3Back}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {back3.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-fs-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {back3Amount && (
                    <span className="mt-1 block text-fs-badge text-gold-600 dark:text-gold-400">
                      {back3Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}

              {last2 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/80">
                  <div className="mb-2 text-fs-badge font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                    {t.results.prize2}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    <span className="font-mono text-fs-4xl font-bold tracking-widest text-gold-600 dark:text-gold-400">
                      {last2}
                    </span>
                  </div>
                  {last2Amount && (
                    <span className="mt-1 block text-fs-badge text-gray-900 dark:text-white">
                      {last2Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              )}

              {adjacent.length > 0 && (
                <div className="flex-1 p-5 text-center transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/80">
                  <div className="mb-2 text-fs-badge font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t.common.adjacent}
                  </div>
                  <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {adjacent.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-fs-lg font-bold tracking-widest text-gray-900 dark:text-white"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                  {adjacentAmount && (
                    <span className="mt-1 block text-fs-badge text-gold-600 dark:text-gold-400">
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
