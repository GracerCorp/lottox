"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PrizeTierSectionProps {
  title: string;
  count: number;
  amount: string;
  currency?: string;
  numbers: string[];
  columns?: number;
}

function PrizeGrid({
  numbers,
  columns = 5,
}: {
  numbers: string[];
  columns?: number;
}) {
  return (
    <div
      className={cn(
        "grid gap-px",
        columns === 5
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          : undefined
      )}
      style={
        columns !== 5
          ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
          : undefined
      }
      data-testid="prize-grid"
    >
      {numbers.map((num, i) => {
        const rowIndex = Math.floor(i / columns);
        const isZebraRow = rowIndex % 2 === 1;
        return (
          <div
            key={i}
            className={cn(
              "px-1 sm:px-2 py-2 sm:py-3 text-center font-mono text-fs-lg tabular-nums tracking-widest",
              "text-gray-800 dark:text-gray-200 transition-colors",
              "hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-300",
              isZebraRow && "bg-slate-50 dark:bg-white/[0.03]"
            )}
            style={{ fontWeight: 600 }}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}

export function PrizeTierSection({
  title,
  count,
  amount,
  currency,
  numbers,
  columns = 5,
}: PrizeTierSectionProps) {
  const { t } = useLanguage();
  const displayCurrency = currency || t.common.currency;

  if (!numbers) return null;

  return (
    <section
      className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-neutral-900/50 shadow-sm dark:shadow-none"
      data-testid="prize-tier-section"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-2 border-b border-gold-500/20 bg-gradient-to-r from-gold-500/10 to-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-fs-xl font-bold text-amber-600 dark:text-gold-400">
          {title}
        </h3>
        <div className="text-fs-sm text-gray-500 dark:text-gray-400">
          {count > 0 && `${count} ${t.common.perPrize} `}
          <span className="font-bold text-amber-600 dark:text-gold-300">
            {amount} {displayCurrency}
          </span>
        </div>
      </div>
      {/* Number Grid */}
      {numbers.length > 0 && <PrizeGrid numbers={numbers} columns={columns} />}
    </section>
  );
}
