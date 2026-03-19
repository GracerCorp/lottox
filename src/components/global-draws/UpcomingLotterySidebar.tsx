"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import { getFlagUrl } from "@/lib/flags";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import type { UpcomingDrawsResponse } from "@/app/api/results/upcoming/route";

export function UpcomingLotterySidebar() {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;
  const { data, loading, error } = useApi<UpcomingDrawsResponse>(
    "/api/results/upcoming?limit=3",
  );

  return (
    <div
      className="bg-white dark:bg-navy-900/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-sm dark:shadow-none"
      data-testid="upcoming-lottery-sidebar"
    >
      <h2 className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wider">
        {gd.upcomingLottery}
      </h2>

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse" data-testid="upcoming-loading">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-slate-100 dark:bg-navy-700/60"
            />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="text-red-500 dark:text-red-400 text-xs" data-testid="upcoming-error">
          {gd.errorLoading}
        </p>
      )}

      {!loading && !error && data?.upcoming.length === 0 && (
        <p className="text-gray-500 text-xs">{gd.noUpcoming}</p>
      )}

      {!loading && !error && data?.upcoming && (
        <div className="flex flex-col gap-3">
          {data.upcoming.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-slate-50 dark:bg-navy-800/60 rounded-xl px-4 py-3 border border-slate-200 dark:border-white/5"
              data-testid="upcoming-item"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="relative h-4 w-6 shrink-0 overflow-hidden rounded shadow">
                  <Image
                    src={getFlagUrl(item.countryCode)}
                    alt={item.countryCode}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-900 dark:text-white text-sm font-semibold truncate">
                  {item.name}
                </span>
              </div>
              <CountdownTimer
                targetDate={item.nextDrawAt}
                className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums shrink-0 ml-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
