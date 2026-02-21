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

interface DrawResultProps {
  country?: string;
  lotteryName?: string;
  date: string;
  drawId: string;
  firstPrize: string;
  firstPrizeAmount: string;
  prizes?: Prize[];
  // For Thai Lotto specific
  front3?: string[];
  front3Amount?: string;
  back3?: string[];
  back3Amount?: string;
  last2?: string;
  last2Amount?: string;
  adjacent?: string[];
  adjacentAmount?: string;
}

export function DrawResult({
  country,
  lotteryName,
  date,
  drawId,
  firstPrize,
  firstPrizeAmount,
  prizes = [],
  front3 = [],
  front3Amount,
  back3 = [],
  back3Amount,
  last2,
  last2Amount,
  adjacent = [],
  adjacentAmount,
}: DrawResultProps) {
  const { t } = useLanguage();

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
        {(country || lotteryName) && (
          <div className="mb-4 flex flex-col items-center justify-center gap-2">
            <h2 className="bg-gradient-to-r from-gold-300 to-gold-600 bg-clip-text text-4xl font-black tracking-tight text-transparent drop-shadow-sm sm:text-5xl text-center leading-tight">
              {lotteryName}
            </h2>
          </div>
        )}

        <div className="mb-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t.common.date} {date} | {drawId}
        </div>

        {/* 1st Prize */}
        <div className="mb-8">
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/15 px-5 py-2 text-sm font-bold uppercase tracking-wider text-gold-400">
              <Trophy className="h-4 w-4" />
              {t.results.prize1} ({t.common.perPrize}{" "}
              <span className="text-gray-900 dark:text-white ml-1">
                {firstPrizeAmount} {t.common.baht})
              </span>
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {firstPrize.split("").map((n, i) => (
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

        {/* Thai Lotto Specific: 3-digit / 2-digit / adjacent */}
        {(front3.length > 0 ||
          back3.length > 0 ||
          last2 ||
          adjacent.length > 0) && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {front3.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/60 p-5 text-center transition-transform hover:scale-105 shadow-sm">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t.results.prize3Front}
                </div>
                <div className="flex flex-col items-center gap-2">
                  {front3.map((num, i) => (
                    <span
                      key={i}
                      className="font-mono text-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                    >
                      {num}
                    </span>
                  ))}
                  {front3Amount && (
                    <span className="mt-1 text-[10px] text-gold-600 dark:text-gold-400">
                      {front3Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              </div>
            )}

            {back3.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/60 p-5 text-center transition-transform hover:scale-105 shadow-sm">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t.results.prize3Back}
                </div>
                <div className="flex flex-col items-center gap-2">
                  {back3.map((num, i) => (
                    <span
                      key={i}
                      className="font-mono text-2xl font-bold tracking-widest text-gray-900 dark:text-white"
                    >
                      {num}
                    </span>
                  ))}
                  {back3Amount && (
                    <span className="mt-1 text-[10px] text-gold-600 dark:text-gold-400">
                      {back3Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              </div>
            )}

            {last2 && (
              <div className="rounded-xl border border-gold-500/20 bg-white dark:bg-navy-800/60 p-5 text-center transition-transform hover:scale-105 shadow-sm">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400">
                  {t.results.prize2}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="font-mono text-4xl font-bold tracking-widest text-gold-600 dark:text-gold-400">
                    {last2}
                  </span>
                  {last2Amount && (
                    <span className="mt-1 text-[10px] text-gray-900 dark:text-white">
                      {last2Amount} {t.common.baht}
                    </span>
                  )}
                </div>
              </div>
            )}

            {adjacent.length > 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/60 p-5 text-center transition-transform hover:scale-105 shadow-sm">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t.common.adjacent}
                </div>
                <div className="flex flex-col items-center gap-2">
                  {adjacent.map((num, i) => (
                    <span
                      key={i}
                      className="font-mono text-lg font-bold tracking-widest text-gray-900 dark:text-white sm:text-lg"
                    >
                      {num}
                    </span>
                  ))}
                  {adjacentAmount && (
                    <span className="mt-1 text-[10px] text-gold-600 dark:text-gold-400">
                      {adjacentAmount} {t.common.baht}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
