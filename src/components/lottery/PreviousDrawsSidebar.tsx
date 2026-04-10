"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Coins } from "lucide-react";

interface PreviousDrawsSidebarProps {
  countryCode: string;
  lotterySlug: string;
  historyItems: { date: string; dateDisplay?: string }[];
  recentResults?: {
    date: string;
    firstPrize: string;
    last3f: string;
    last3b: string;
    last2: string;
  }[];
  prizeLabels?: {
    firstPrize?: string;
    last3f?: string;
    last3b?: string;
    last2?: string;
  };
  maxItems?: number;
}

export function PreviousDrawsSidebar({
  countryCode,
  lotterySlug,
  historyItems,
  recentResults,
  prizeLabels,
  maxItems = 5,
}: PreviousDrawsSidebarProps) {
  const { t } = useLanguage();
  const dd = t.staticParams.drawDetail;

  const isNonThai = countryCode !== "th";
  
  // Use recentResults if provided, otherwise fallback to historyItems dates
  const displayItems = recentResults?.slice(0, maxItems) || historyItems.slice(0, maxItems).map(item => ({
    date: item.dateDisplay || item.date,
    firstPrize: "-", last3f: "-", last3b: "-", last2: "-"
  }));

  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-[#1a1a1a] p-6 shadow-sm dark:shadow-none"
      data-testid="previous-draws-sidebar"
    >
      <h3 className="mb-4 flex items-center gap-2 text-fs-lg font-bold text-gray-900 dark:text-white">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#2a2418] text-amber-500">
          <Coins className="h-4 w-4" />
        </div>
        {dd.previousDraws}
      </h3>
      
      {displayItems.length === 0 ? (
        <p className="text-fs-sm text-gray-500 dark:text-gray-400">—</p>
      ) : (
        <div className="space-y-3">
          {displayItems.map((item, i) => (
            <Link
              key={i}
              href={`/${countryCode}/${lotterySlug}/${historyItems[i]?.date || ""}`}
              className="block rounded-xl border border-white/10 bg-[#222222] p-4 transition-colors hover:bg-white/5"
            >
              <div className="mb-3 text-sm text-gray-400">
                {item.date}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {/* First Prize */}
                <div className="flex flex-col">
                  <span className="mb-1 text-[10px] text-gray-400">{prizeLabels?.firstPrize || t.results.prize1}</span>
                  <span className="font-mono text-base font-bold tracking-wider text-gold-400">{item.firstPrize}</span>
                </div>
                
                {/* Other Prizes: Show for Thai format */}
                {!isNonThai && (
                  <>
                    <div className="flex flex-col">
                      <span className="mb-1 text-[10px] text-gray-400">{prizeLabels?.last3f || t.results.prize3Front}</span>
                      <span className="font-mono text-base font-bold tracking-wider text-white">{item.last3f}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 text-[10px] text-gray-400">{prizeLabels?.last3b || t.results.prize3Back}</span>
                      <span className="font-mono text-base font-bold tracking-wider text-white">{item.last3b}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 text-[10px] text-gray-400">{prizeLabels?.last2 || t.results.prize2}</span>
                      <span className="font-mono text-base font-bold tracking-wider text-white">{item.last2}</span>
                    </div>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
