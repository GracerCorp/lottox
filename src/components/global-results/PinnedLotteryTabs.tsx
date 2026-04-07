"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import type { PinnedLottery } from "./AddLotteryModal";

interface PinnedLotteryTabsProps {
  pinned: PinnedLottery[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function PinnedLotteryTabs({
  pinned,
  activeIndex,
  onSelect,
}: PinnedLotteryTabsProps) {
  const { t } = useLanguage();
  const mb = t.staticParams.myBoard;

  if (pinned.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4" data-testid="no-pinned-text">
        {mb.noLotteryPinned}
      </p>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label={mb.title}
      data-testid="pinned-tabs"
    >
      {pinned.map((item, i) => (
        <button
          key={item.lotteryId}
          role="tab"
          aria-selected={i === activeIndex}
          onClick={() => onSelect(i)}
          className={[
            "flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
            i === activeIndex
              ? "bg-amber-400 text-neutral-950 border-amber-400"
              : "bg-transparent text-gray-500 dark:text-gray-400 border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:text-gray-900 dark:hover:text-white",
          ].join(" ")}
          data-testid={`tab-${item.countryCode}`}
        >
          {item.logo && (
            <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0">
              <Image
                src={item.logo}
                alt={item.lotteryName}
                fill
                className="object-cover"
              />
            </div>
          )}
          {item.lotteryName}
        </button>
      ))}
    </div>
  );
}
