"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { formatDateDisplay } from "@/lib/utils/lotteryUtils";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

interface PreviousDrawsSidebarProps {
  countryCode: string;
  lotterySlug: string;
  historyItems: { date: string; dateDisplay?: string }[];
  maxItems?: number;
}

export function PreviousDrawsSidebar({
  countryCode,
  lotterySlug,
  historyItems,
  maxItems = 5,
}: PreviousDrawsSidebarProps) {
  const { t, language } = useLanguage();
  const dd = t.staticParams.drawDetail;

  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-6 shadow-sm dark:shadow-none"
      data-testid="previous-draws-sidebar"
    >
      <h3 className="mb-4 flex items-center gap-2 text-fs-lg font-bold text-gray-900 dark:text-white">
        <CalendarDays className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        {dd.previousDraws}
      </h3>
      {historyItems.length === 0 ? (
        <p className="text-fs-sm text-gray-500 dark:text-gray-400">—</p>
      ) : (
        <div className="space-y-2">
          {historyItems.slice(0, maxItems).map((item, i) => (
            <Link
              key={i}
              href={`/${countryCode}/${lotterySlug}/${item.date}`}
              className="block rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2 text-fs-sm text-gray-600 dark:text-gray-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-amber-600 dark:hover:text-gold-400"
            >
              {dd.drawPrefix}{" "}
              {formatDateDisplay(item.dateDisplay || item.date, language)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
