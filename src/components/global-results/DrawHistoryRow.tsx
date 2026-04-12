"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface DrawHistoryRowProps {
  drawTime: string;
  drawDate: string;
  results: {
    label: string;
    value: string;
    main?: boolean;
  }[];
  href?: string;
}

export function DrawHistoryRow({
  drawTime,
  drawDate,
  results,
  href,
}: DrawHistoryRowProps) {
  const content = (
    <div
      className={`flex items-center justify-between py-3 px-4 mx-4 mt-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-neutral-800/40 transition-all duration-300 ${
        href ? 'group-hover:border-gold-500/50 group-hover:shadow-[0_0_15px_rgba(216,176,95,0.2)] dark:group-hover:shadow-[0_0_15px_rgba(216,176,95,0.15)] bg-white dark:bg-[#1a1a1a]' : ''
      }`}
      data-testid="draw-history-row"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 w-full">
        {/* Date + time */}
        <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0 font-medium">
          {drawTime && <>{drawTime} | </>}
          {drawDate}
        </span>

        {/* Prize columns */}
        {results.map((col, i) => (
          <div key={`${col.label}-${i}`} className="shrink-0">
            <span className="block text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-none mb-1">
              {col.label}
            </span>
            <span
              className={
                col.main
                  ? "text-lg font-black text-amber-500 dark:text-amber-400 tracking-wider tabular-nums"
                  : "text-base font-bold text-red-500 dark:text-red-400 tracking-wide tabular-nums"
              }
            >
              {col.value || "–"}
            </span>
          </div>
        ))}
      </div>
      
      {/* Chevron at the end */}
      {href && (
        <div className="pl-2 flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gold-500 transition-colors" />
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group mb-3 last:mb-0">
        {content}
      </Link>
    );
  }

  return (
    <div className="mb-3 last:mb-0">
      {content}
    </div>
  );
}
