"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";
import { formatDateDisplay } from "@/lib/utils/lotteryUtils";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/utils/lotteryUtils";

interface GlobalDraw {
  id: number;
  lotteryName: string;
  country: string;
  countryCode: string;
  date: string;
  dateDisplay: string;
  firstPrize?: string;
  data?: Record<string, unknown>;
}

interface RecentGlobalDrawsProps {
  excludeCountry?: string;
  limit?: number;
}

export function RecentGlobalDraws({
  excludeCountry,
  limit = 5,
}: RecentGlobalDrawsProps) {
  const { t, language } = useLanguage();
  const dd = t.staticParams.drawDetail;

  const [draws, setDraws] = useState<GlobalDraw[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGlobal() {
      try {
        const res = await fetch(`/api/results/global?limit=${limit + 2}`);
        const json = await res.json();
        const items: GlobalDraw[] = (json.draws || [])
          .filter(
            (d: GlobalDraw) =>
              !excludeCountry ||
              d.countryCode?.toLowerCase() !== excludeCountry.toLowerCase()
          )
          .slice(0, limit);
        setDraws(items);
      } catch {
        setDraws([]);
      } finally {
        setLoading(false);
      }
    }
    fetchGlobal();
  }, [excludeCountry, limit]);

  // Use a heuristic to extract values specifically adapted to each lottery type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getDisplayPrizes(draw: GlobalDraw, tContext: Record<string, any>) {
    const p = [];
    const c = draw.countryCode?.toLowerCase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = (draw.data as any) || {};

    if (c === "th") {
      p.push({ label: tContext.results?.prize1 || "6 Digits", value: d.first || draw.firstPrize || "-", highlight: true });
      let f3 = d.first3?.number || d.last3f || d.front3 || "-";
      if (Array.isArray(f3)) f3 = f3.join(" ");
      p.push({ label: tContext.results?.prize3Front || "3 Digits(First)", value: f3, highlight: false });
      
      let l3 = d.last3?.number || d.last3b || d.back3 || "-";
      if (Array.isArray(l3)) l3 = l3.join(" ");
      p.push({ label: tContext.results?.prize3Back || "3 Digits(Last)", value: l3, highlight: false });
      
      let l2 = d.last2?.number || d.last2 || "-";
      if (Array.isArray(l2)) l2 = l2.map(String).join(" ");
      p.push({ label: tContext.results?.prize2 || "2 Digits(Last)", value: l2, highlight: false });
      return p;
    }
    
    if (c === "la") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullData = (draw as any).fullData || {};
      const pr = fullData.prizeResult || d.prizeResult || {};
      p.push({ label: "4 Digits", value: pr.last4Prize || draw.firstPrize || d.first || d.digit4 || "-", highlight: true });
      p.push({ label: "Animal", value: pr.animalName || d.animal?.name || d.animal || "-", highlight: false });
      
      const devJSON = pr.devNumberSet?.json;
      if (devJSON || d.additional || d.development) {
        let dev = devJSON || d.additional || d.development;
        if (Array.isArray(dev)) dev = dev.join(" ");
        p.push({ label: "Development Lottery", value: dev || "00 00 00 00 00", highlight: false });
      } else {
        p.push({ label: "Development Lottery", value: "-", highlight: false });
      }
      return p;
    }

    if (d.prizes && Array.isArray(d.prizes)) {
      const sorted = [...d.prizes].sort((a: Record<string, unknown>, b: Record<string, unknown>) => ((a.order as number) || 99) - ((b.order as number) || 99));
      // Try to intelligently extract Main and Bonus
      const mainPrize = sorted.find((pr: Record<string, unknown>) => ((pr.prizeName || pr.category) as string)?.match(/winning|main|first/i)) || sorted[0];
      const bonusPrize = sorted.find((pr: Record<string, unknown>) => ((pr.prizeName || pr.category) as string)?.match(/bonus|powerball|lucky/i)) || sorted[1];
      
      if (mainPrize) {
        let nums = mainPrize.winningNumbers || mainPrize.number || [];
        if (Array.isArray(nums)) nums = nums.join(" ");
        p.push({ label: mainPrize.prizeName || mainPrize.category || "Winning Number", value: nums || "-", highlight: true });
      }
      if (bonusPrize) {
        let nums = bonusPrize.winningNumbers || bonusPrize.number || [];
        if (Array.isArray(nums)) nums = nums.join(" ");
        p.push({ label: bonusPrize.prizeName || bonusPrize.category || "Bonus", value: nums || "-", highlight: false });
      }
      if (p.length > 0) return p;
    }

    p.push({ label: "Winning Number", value: draw.firstPrize || d.first || "-", highlight: true });
    return p;
  }

  if (loading) {
    return (
      <section
        className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent p-6 shadow-sm dark:shadow-none animate-pulse"
        data-testid="recent-global-results"
      >
        <div className="h-6 w-48 rounded bg-slate-100 dark:bg-neutral-700/60 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-slate-100 dark:bg-neutral-700/60" />
          ))}
        </div>
      </section>
    );
  }

  if (draws.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent p-4 shadow-sm dark:shadow-none"
      data-testid="recent-global-results"
    >
      <div className="space-y-3">
        {draws.map((draw) => {
          const slug = slugify(draw.lotteryName);
          const href = `/${draw.countryCode?.toLowerCase()}/${slug}/${draw.date}`;
          const columns = getDisplayPrizes(draw, t);

          return (
            <Link
              key={draw.id}
              href={href}
              className="flex items-center gap-6 rounded-2xl bg-gray-50 dark:bg-[#4F4F4F] px-5 py-4 transition-colors hover:bg-gray-100 dark:hover:bg-[#5a5a5a] group"
            >
              {/* Left Identity Section */}
              <div className="w-[180px] flex-shrink-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Image
                    src={getFlagUrl(draw.countryCode || "")}
                    alt={draw.country || ""}
                    width={20}
                    height={14}
                    className="h-3.5 w-5 rounded-sm flex-shrink-0"
                  />
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate transition-colors">
                    {draw.lotteryName}
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-[#a3a3a3]">
                  {formatDateDisplay(draw.dateDisplay || draw.date, language)}
                </div>
              </div>

              {/* Dynamic Grid Results */}
              <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-2">
                {columns.map((col, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="mb-1 text-[11px] text-gray-500 dark:text-[#a3a3a3]">{col.label}</span>
                    <span className={`font-mono text-[15px] font-bold tracking-wider ${col.highlight ? "text-amber-500 dark:text-[#eab308]" : "text-gray-900 dark:text-white"}`}>
                      {col.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Right Chevron */}
              <div className="text-gray-400 dark:text-white opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0 pl-2">
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
