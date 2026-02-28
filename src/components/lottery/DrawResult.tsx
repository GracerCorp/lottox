"use client";
import React from "react";
import { LotteryBall } from "@/components/ui/LotteryBall";
import { Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiPrize {
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
  drawId: string;
  prizes: ApiPrize[];
  /** Currency label for display (default: "บาท" / "Baht") */
  currency?: string;
}

export function DrawResult({
  country,
  lotteryName,
  date,
  drawId,
  prizes = [],
  currency,
}: DrawResultProps) {
  const { t } = useLanguage();
  const currencyLabel = currency || t.common.baht;

  // Sort prizes by order
  const sorted = [...prizes].sort((a, b) => {
    const oa = a.order ?? 99;
    const ob = b.order ?? 99;
    return oa - ob;
  });

  // First prize is the hero display
  const heroPrize = sorted[0];
  const restPrizes = sorted.slice(1);

  // For the hero, take only the first winning number (the main number)
  const heroNumber = heroPrize?.winningNumbers?.[0] || "-";
  const heroLabel = heroPrize?.prizeName || t.results.prize1;
  const heroAmount = heroPrize?.prizeAmount
    ? Number(heroPrize.prizeAmount).toLocaleString()
    : "-";

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
            {drawId && drawId !== "-" && (
              <>
                <span className="hidden h-6 w-px bg-gold-500/30 sm:block" />
                <span className="text-sm font-semibold tracking-wider text-gold-500 sm:text-base">
                  {t.common.draw || "DRAW"} #{drawId}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Hero Prize */}
        {heroPrize && (
          <div className="mb-8">
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-gold-400">
                <Trophy className="h-4 w-4" />
                {heroLabel} ({t.common.perPrize}{" "}
                <span className="text-gray-900 dark:text-white ml-1">
                  {heroAmount} {currencyLabel})
                </span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {heroNumber.split("").map((n, i) => (
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
        )}

        {/* Rest of the prizes in a grid */}
        {restPrizes.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {restPrizes.map((prize, idx) => {
              const isLast2 =
                prize.category === "running_number_back_2" ||
                prize.category === "prize_2_digits";
              return (
                <div
                  key={idx}
                  className={`rounded-xl border ${isLast2 ? "border-gold-500/20" : "border-gray-200 dark:border-white/10"} bg-white dark:bg-navy-800/60 p-5 text-center transition-transform hover:scale-105 shadow-sm`}
                >
                  <div
                    className={`mb-2 text-[11px] font-bold uppercase tracking-wider ${isLast2 ? "text-gold-600 dark:text-gold-400" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {prize.prizeName}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {prize.winningNumbers.map((num, i) => (
                      <span
                        key={i}
                        className={`font-mono ${isLast2 ? "text-4xl text-gold-600 dark:text-gold-400" : "text-2xl text-gray-900 dark:text-white"} font-bold tracking-widest`}
                      >
                        {num}
                      </span>
                    ))}
                    {prize.prizeAmount > 0 && (
                      <span
                        className={`mt-1 text-[10px] ${isLast2 ? "text-gray-900 dark:text-white" : "text-gold-600 dark:text-gold-400"}`}
                      >
                        {Number(prize.prizeAmount).toLocaleString()}{" "}
                        {currencyLabel}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
