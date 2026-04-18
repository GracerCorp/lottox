"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { useApi } from "@/lib/hooks/useApi";
import { getFlagUrl } from "@/lib/flags";
import { slugify } from "@/lib/utils/lotteryUtils";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import type { UpcomingDrawsResponse } from "@/app/api/results/upcoming/route";

export function UpcomingLotterySidebar() {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;
  const { data, loading, error } = useApi<UpcomingDrawsResponse>(
    "/api/results/upcoming?limit=3",
  );

  return (
    <div className="flex flex-col gap-6 w-full h-full" data-testid="upcoming-lottery-sidebar">
      {loading && (
        <div className="flex flex-col gap-6 animate-pulse" data-testid="upcoming-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-gray-100 dark:bg-[#242424]" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="text-red-500 text-xs text-center" data-testid="upcoming-error">
          {gd.errorLoading}
        </p>
      )}

      {!loading && !error && data?.upcoming.length === 0 && (
        <p className="text-gray-500 text-xs text-center">{gd.noUpcoming}</p>
      )}

      {!loading && !error && data?.upcoming && data.upcoming.map((item, i) => (
        <Link
          key={i}
          href={`/${item.countryCode.toLowerCase()}/${slugify(item.name)}`}
          className="bg-white dark:bg-[#242424] border border-gray-100 dark:border-transparent rounded-2xl p-6 flex flex-col gap-5 shadow-lg w-full flex-1 justify-center hover:ring-2 hover:ring-gold-500/50 transition-all cursor-pointer group"
          data-testid="upcoming-item"
        >
          {/* Header Row */}
          <div className="flex items-center gap-3">
            {item.logo ? (
              <div className="relative h-10 w-12 shrink-0 flex items-center justify-center">
                <Image
                  src={item.logo}
                  alt={`${item.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="relative h-10 w-10 overflow-hidden rounded-full shrink-0 flex items-center justify-center bg-white/5 border border-neutral-200 dark:border-white/10 shadow-sm">
                <Image
                  src={getFlagUrl(item.countryCode)}
                  alt={item.countryCode}
                  fill
                  className="object-cover scale-110"
                />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-900 dark:text-white font-semibold text-lg">{item.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#22c55e" stroke="currentColor" className="text-white" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                  {(t.countryList?.countries as Record<string, string>)?.[item.countryCode.toLowerCase()] || item.countryCode.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Winning Prize Area */}
          {item.expectedPrize && (
            <div className="flex justify-between items-center px-1 py-2 border-b border-gray-100 dark:border-[#333] border-dashed">
              <span className="text-sm text-gray-500 dark:text-gray-400">{'Winning Prize'}</span>
              <span className="text-[#e2c179] font-bold text-lg">{item.currency}{item.expectedPrize}</span>
            </div>
          )}

          {/* Countdown Area */}
          <div className="bg-gray-50 dark:bg-[#1f1f1f] rounded-full border border-gray-200 dark:border-[#333] px-6 py-3.5 flex flex-col items-center justify-center w-full mt-2">
            <CountdownTimer
              targetDate={item.nextDrawAt}
              className="text-gray-900 dark:text-white text-2xl font-bold tracking-[0.1em] tabular-nums mb-0.5"
            />
            <div className="flex justify-between w-[200px] text-[10px] uppercase text-gray-500 font-bold tracking-widest mt-1">
              <span>day</span>
              <span>hr</span>
              <span>min</span>
              <span>sec</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
