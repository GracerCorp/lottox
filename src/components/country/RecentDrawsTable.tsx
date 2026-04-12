"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

interface DrawResult {
  date: string;
  drawId: string;
  numbers: string[];
  topPrize: string;
}

interface RecentDrawsTableProps {
  country: string;
  draws: DrawResult[];
  countrySlug?: string;
  lotterySlug?: string;
}

export function RecentDrawsTable({
  draws,
  countrySlug,
  lotterySlug,
}: RecentDrawsTableProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-xl mt-8">
      <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {t.drawDetail.officialResults}
        </h3>
        {countrySlug && lotterySlug ? (
          <Link
            href={`/${countrySlug}/${lotterySlug}`}
            className="text-sm text-gold-600 dark:text-gold-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t.drawDetail.previousDraws}
          </Link>
        ) : (
          <button className="text-sm text-gold-600 dark:text-gold-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            {t.drawDetail.previousDraws}
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 dark:bg-neutral-950/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4">{t.common.date}</th>
              <th className="p-4">{t.common.draw} #</th>
              <th className="p-4">{t.common.winningNumbers}</th>
              <th className="p-4 text-right">{t.common.prize}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/5">
            {draws.map((draw, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-gray-700 dark:text-gray-300 font-mono text-sm">
                  {draw.date}
                </td>
                <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">
                  {draw.drawId}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {draw.numbers.map((num, i) => (
                      <span
                        key={i}
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${i === draw.numbers.length - 1 ? "bg-gold-500 text-neutral-900 shadow-md" : "bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-white shadow-inner"}`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right text-gold-600 dark:text-gold-400 font-bold">
                  {draw.topPrize}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
