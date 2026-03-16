"use client";

import { useApi } from "@/lib/hooks/useApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { mapApiResultToRow } from "@/components/ui/ResultsTable";
import type { LatestResultsResponse } from "@/lib/api-types";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export function MarketDataTable() {
  const { t, language } = useLanguage();
  const { data, loading, error } = useApi<LatestResultsResponse>(
    "/api/results/latest",
  );

  const results =
    data?.results
      ?.map((res) => {
        const row = mapApiResultToRow(res, t, language);
        if (!row) return null;

        const mainPrize = row.numbers.find((n) => n.isMain) || row.numbers[0];
        const specialPrize = row.numbers.find((n) => !n.isMain);

        return {
          country: row.id.toUpperCase(),
          code: `${row.id.toUpperCase()}-${row.name.substring(0, 3).toUpperCase()}`,
          name: row.name,
          numbers: mainPrize?.value?.join(" ") || "-",
          special: specialPrize?.value?.join(" ") || "-",
          jackpot: mainPrize?.prize || "-",
          currency: row.id === "th" ? "THB" : row.id === "la" ? "LAK" : "VND",
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null) || [];

  return (
    <section className="py-12 bg-[#0a0f1c]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-mono uppercase tracking-widest text-green-500">
              {t.market.marketData} <span className="text-gray-600">{`//`}</span> {t.market.globalIndex}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t.market.marketOpen}
            </span>
            <span>{t.market.vol} 24.5M</span>
          </div>
        </div>

        <div className="bg-[#05080f] border border-gray-800 rounded-lg overflow-hidden font-mono text-sm relative">
          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
              <thead>
                <tr className="bg-gray-900/50 text-gray-500 text-xs border-b border-gray-800 uppercase tracking-wider">
                  <th className="p-3 font-normal w-12 text-center">{t.market.sts}</th>
                  <th className="p-3 font-normal text-cyan-500">{t.market.symbol}</th>
                  <th className="p-3 font-normal text-left">{t.market.numbers}</th>
                  <th className="p-3 font-normal text-right">{t.market.special}</th>
                  <th className="p-3 font-normal text-right">{t.market.jackpot}</th>
                  <th className="p-3 font-normal text-right w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {loading && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      {t.market.loading}
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-red-500">
                      {t.market.error} {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && results.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      {t.market.noData}
                    </td>
                  </tr>
                )}
                {!loading &&
                  !error &&
                  results.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-800/30 transition-colors group cursor-pointer text-gray-300"
                    >
                      <td className="p-3 text-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full mx-auto bg-green-500"
                        ></div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-cyan-400 group-hover:text-cyan-300">
                            {row.code}
                          </span>
                          <span className="text-[10px] text-gray-600 uppercase">
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 tracking-wider text-gray-400 group-hover:text-white transition-colors">
                        {row.numbers}
                      </td>
                      <td className="p-3 text-right text-gold-500 group-hover:text-yellow-300">
                        {row.special || "-"}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-white group-hover:text-green-400 transition-colors">
                            {row.jackpot}
                          </span>
                          <span className="text-[10px] text-gray-600">
                            {row.currency}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-right text-gray-600 group-hover:text-white">
                        <ArrowUpRight className="w-4 h-4 ml-auto" />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="p-2 border-t border-gray-800 bg-gray-900/30 flex justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
            <span>{t.market.providedBy}</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-900 rounded-full animate-ping"></span>
              {t.market.realtime}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
