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
  limit = 4,
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

  function extractFirstPrize(draw: GlobalDraw): string {
    if (draw.firstPrize) return draw.firstPrize;
    const data = draw.data as Record<string, unknown> | undefined;
    if (!data) return "-";
    if (data.first) return String(data.first);
    if (data.firstPrize) return String(data.firstPrize);
    if (Array.isArray(data.prizes)) {
      const p = data.prizes[0] as Record<string, unknown> | undefined;
      if (p) {
        const nums = p.winningNumbers || p.number;
        if (Array.isArray(nums) && nums.length > 0) return String(nums[0]);
      }
    }
    return "-";
  }

  if (loading) {
    return (
      <section
        className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-6 shadow-sm dark:shadow-none animate-pulse"
        data-testid="recent-global-draws"
      >
        <div className="h-6 w-48 rounded bg-slate-100 dark:bg-neutral-700/60 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-neutral-700/60" />
          ))}
        </div>
      </section>
    );
  }

  if (draws.length === 0) return null;

  return (
    <section
      className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/80 p-6 shadow-sm dark:shadow-none"
      data-testid="recent-global-draws"
    >
      <h3 className="mb-4 flex items-center gap-2 text-fs-xl font-bold text-gray-900 dark:text-white">
        <Globe className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        {dd.recentGlobalDraws}
      </h3>
      <div className="space-y-2">
        {draws.map((draw) => {
          const slug = slugify(draw.lotteryName);
          const href = `/${draw.countryCode?.toLowerCase()}/${slug}/${draw.date}`;
          return (
            <Link
              key={draw.id}
              href={href}
              className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 px-4 py-3 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 group"
            >
              <Image
                src={getFlagUrl(draw.countryCode || "")}
                alt={draw.country || ""}
                width={28}
                height={20}
                className="h-5 w-7 rounded-sm shadow-sm flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-fs-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-gold-400 transition-colors">
                  {draw.lotteryName}
                </div>
                <div className="text-fs-xs text-gray-500 dark:text-gray-400">
                  {formatDateDisplay(draw.dateDisplay || draw.date, language)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-mono text-fs-sm font-bold tracking-wider text-gray-900 dark:text-white">
                  {extractFirstPrize(draw)}
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-amber-500 transition-colors">
                ›
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
