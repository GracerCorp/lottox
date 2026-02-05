"use client";

import { ChevronRight } from "lucide-react";

export function ResultsTable() {
  const results = [
    {
      country: "USA",
      flag: "🇺🇸",
      name: "USA Powerball",
      numbers: ["12", "34", "45", "55", "58"],
      special: "20",
      jackpot: "$463M",
      next: "$08 Million",
    },
    {
      country: "Europe",
      flag: "🇪🇺",
      name: "EuroMillions",
      numbers: ["02", "10", "26", "32", "45"],
      special: "05",
      jackpot: "€56M",
      next: "€64 Million",
    },
    {
      country: "USA",
      flag: "🇺🇸",
      name: "Mega Millions",
      numbers: ["05", "13", "24", "31", "58"],
      special: "17",
      jackpot: "$202M",
      next: "$83 Million",
    },
    {
      country: "Japan",
      flag: "🇯🇵",
      name: "Japan Lotto 6",
      numbers: ["01", "05", "06", "13", "23", "29"],
      special: "25",
      jackpot: "¥400M",
      next: "¥30 Million",
    },
    {
      country: "Canada",
      flag: "🇨🇦",
      name: "Canada Lotto 6/49",
      numbers: ["04", "19", "22", "27", "29", "40"],
      special: "25",
      jackpot: "CA$10M",
      next: "CA$38 Million",
    },
    {
      country: "UK",
      flag: "🇬🇧",
      name: "UK National Lottery",
      numbers: ["11", "14", "25", "34", "44"],
      special: "21",
      jackpot: "£9.5M",
      next: "£83 Million",
    },
    {
      country: "Brazil",
      flag: "🇧🇷",
      name: "Brazil Mega Sena",
      numbers: ["05", "22", "29", "32", "55", "48"],
      special: "",
      jackpot: "R$8M",
      next: "-",
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      name: "Australia Powerball",
      numbers: ["01", "02", "07", "50", "57", "58"],
      special: "17",
      jackpot: "AU$30M",
      next: "$48 Million",
    },
  ];

  return (
    <section className="py-12 bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Latest Global Results{" "}
            <span className="text-green-500 text-xs bg-green-500/10 px-2 py-0.5 rounded animate-pulse">
              ● LIVE
            </span>
          </h2>
          <button className="text-sm text-gold-400 hover:text-white transition-colors flex items-center gap-1">
            World Dashboard <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-navy-800 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-navy-950/50 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Lottery</th>
                  <th className="p-4 font-medium">Winning Numbers</th>
                  <th className="p-4 font-medium text-right">Jackpot</th>
                  <th className="p-4 font-medium text-right hidden md:table-cell">
                    Next Jackpot
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{row.flag}</span>
                        <span className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {row.numbers.map((num, i) => (
                          <span
                            key={i}
                            className="w-8 h-8 flex items-center justify-center bg-navy-700 rounded-full font-mono text-white text-sm shadow-inner group-hover:bg-white group-hover:text-navy-900 transition-colors"
                          >
                            {num}
                          </span>
                        ))}
                        {row.special && (
                          <span className="w-8 h-8 flex items-center justify-center bg-gold-500/20 text-gold-400 border border-gold-500/30 rounded-full font-mono text-sm shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                            {row.special}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-gold-400 font-bold text-lg">
                        {row.jackpot}
                      </span>
                    </td>
                    <td className="p-4 text-right hidden md:table-cell text-gray-400 text-sm">
                      {row.next}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
