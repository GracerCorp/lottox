"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { RegionData } from "./LatestUpdateSection";

interface LatestUpdateFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  regions?: RegionData[];
}

export function LatestUpdateFilter({
  activeFilter,
  onFilterChange,
  regions,
}: LatestUpdateFilterProps) {
  const { t } = useLanguage();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  const tabs = [
    { id: "trending", label: tAny.selector?.trending || "Trending" },
    ...(regions || []).map((r) => ({
      id: r.id,
      label: r.name,
    })),
  ];

  return (
    <div className="flex w-full overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex flex-nowrap items-center gap-3 w-max mx-auto md:mx-0">
        <Link
          href="/global-results"
          className="flex shrink-0 items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 border border-neutral-200 dark:border-white/20 bg-transparent text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10"
        >
          <Compass className="h-4 w-4 shrink-0" />
          <span>{tAny.common?.exploreGlobalResults || "Explore Global Results"}</span>
        </Link>
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 px-5 py-2 rounded-full text-sm transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                isActive
                  ? "border-[rgba(212,175,55,0.4)] text-[#D4AF37] bg-[rgba(212,175,55,0.05)]"
                  : "text-neutral-900 dark:text-white border-neutral-200 dark:border-white/20 bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10 hover:border-neutral-300 dark:hover:border-white/30",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
