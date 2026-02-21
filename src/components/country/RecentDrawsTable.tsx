"use client";

import Link from "next/link";

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
  country,
  draws,
  countrySlug,
  lotterySlug,
}: RecentDrawsTableProps) {
  return (
    <div className="bg-navy-800 rounded-2xl border border-white/10 overflow-hidden shadow-xl mt-8">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">
          Recent Official Results
        </h3>
        {countrySlug && lotterySlug ? (
          <Link
            href={`/${countrySlug}/${lotterySlug}`}
            className="text-sm text-gold-400 hover:text-white transition-colors"
          >
            View All Archive
          </Link>
        ) : (
          <button className="text-sm text-gold-400 hover:text-white transition-colors">
            View All Archive
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-navy-950/50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="p-4">Date</th>
              <th className="p-4">Draw #</th>
              <th className="p-4">Winning Numbers</th>
              <th className="p-4 text-right">Prize</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {draws.map((draw, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-gray-300 font-mono text-sm">
                  {draw.date}
                </td>
                <td className="p-4 text-gray-400 text-sm">{draw.drawId}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {draw.numbers.map((num, i) => (
                      <span
                        key={i}
                        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${i === draw.numbers.length - 1 ? "bg-gold-500 text-navy-900 shadow-md" : "bg-navy-700 text-white shadow-inner"}`}
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right text-gold-400 font-bold">
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
