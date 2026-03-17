"use client";

import { useApi } from "@/lib/hooks/useApi";
import type { LatestResultsResponse } from "@/lib/api-types";

export function LiveTicker() {
  const { data } = useApi<LatestResultsResponse>("/api/results/latest");

  const tickerItems =
    data?.results?.map((r) => ({
      name: r.lotteryName || r.type,
      type: r.type,
    })) || [];

  // Create enough duplicates for smooth infinite scroll
  const displayItems =
    tickerItems.length > 0
      ? [...tickerItems, ...tickerItems, ...tickerItems]
      : [];

  if (displayItems.length === 0) return null;

  return (
    <div className="w-full bg-gray-50/80 dark:bg-navy-950/80 border-y border-gray-200 dark:border-white/5 py-3 overflow-hidden">
      <div className="flex items-center">
        <div className="relative flex overflow-hidden w-full">
          <div
            className="flex gap-3 whitespace-nowrap animate-ticker"
            style={{
              animation: "ticker 40s linear infinite",
            }}
          >
            {displayItems.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-navy-800/80 border border-gray-200 dark:border-white/5 px-4 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700/80 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Inline keyframes for ticker animation */}
      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}
