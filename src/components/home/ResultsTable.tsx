"use client";

import { ArrowUpRight, TrendingUp, MoreHorizontal } from "lucide-react";

export function ResultsTable() {
  const results = [
    {
      country: "USA",
      code: "US-PB",
      name: "Powerball",
      numbers: "12 34 45 55 58",
      special: "20",
      jackpot: "463.00 M",
      currency: "USD",
      change: "+2.4%",
      trend: "up",
    },
    {
      country: "EUR",
      code: "EU-EM",
      name: "EuroMillions",
      numbers: "02 10 26 32 45",
      special: "05",
      jackpot: "56.00 M",
      currency: "EUR",
      change: "+1.1%",
      trend: "up",
    },
    {
      country: "VNM",
      code: "VN-HN",
      name: "Hanoi Lotto",
      numbers: "8825 825 25",
      special: "5",
      jackpot: "x850",
      currency: "VND",
      change: "+0.5%",
      trend: "up",
    },
    {
      country: "USA",
      code: "US-MM",
      name: "Mega Millions",
      numbers: "05 13 24 31 58",
      special: "17",
      jackpot: "202.00 M",
      currency: "USD",
      change: "+5.8%",
      trend: "up",
    },
    {
      country: "JPN",
      code: "JP-L6",
      name: "Lotto 6",
      numbers: "01 05 06 13 23 29",
      special: "25",
      jackpot: "400.00 M",
      currency: "JPY",
      change: "+0.5%",
      trend: "up",
    },
    {
      country: "CAN",
      code: "CA-649",
      name: "Lotto 6/49",
      numbers: "04 19 22 27 29 40",
      special: "25",
      jackpot: "10.00 M",
      currency: "CAD",
      change: "-1.2%",
      trend: "down",
    },
    {
      country: "UK",
      code: "UK-NL",
      name: "National Lottery",
      numbers: "11 14 25 34 44",
      special: "21",
      jackpot: "9.50 M",
      currency: "GBP",
      change: "+0.8%",
      trend: "up",
    },
    {
      country: "BRA",
      code: "BR-MS",
      name: "Mega Sena",
      numbers: "05 22 29 32 55 48",
      special: null,
      jackpot: "8.00 M",
      currency: "BRL",
      change: "0.0%",
      trend: "neutral",
    },
    {
      country: "AUS",
      code: "AU-PB",
      name: "Powerball",
      numbers: "01 02 07 50 57 58",
      special: "17",
      jackpot: "30.00 M",
      currency: "AUD",
      change: "+3.2%",
      trend: "up",
    },
  ];

  return (
    <section className="py-12 bg-[#0a0f1c]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-mono uppercase tracking-widest text-green-500">
              Market Data <span className="text-gray-600">//</span> Global
              Lottery Index
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              MARKET OPEN
            </span>
            <span>VOL: 24.5M</span>
          </div>
        </div>

        <div className="bg-[#05080f] border border-gray-800 rounded-lg overflow-hidden font-mono text-sm relative">
          {/* Scanline effect overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20"></div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-500 text-xs border-b border-gray-800 uppercase tracking-wider">
                  <th className="p-3 font-normal w-12 text-center">STS</th>
                  <th className="p-3 font-normal text-cyan-500">Symbol</th>
                  <th className="p-3 font-normal w-48">Numbers</th>
                  <th className="p-3 font-normal text-right w-24">Special</th>
                  <th className="p-3 font-normal text-right">Jackpot</th>
                  <th className="p-3 font-normal text-right w-24">Chg%</th>
                  <th className="p-3 font-normal text-right w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {results.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-800/30 transition-colors group cursor-pointer text-gray-300"
                  >
                    <td className="p-3 text-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mx-auto ${row.trend === "up" ? "bg-green-500" : row.trend === "down" ? "bg-red-500" : "bg-gray-500"}`}
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
                    <td
                      className={`p-3 text-right ${row.change.startsWith("+") ? "text-green-500" : row.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}
                    >
                      {row.change}
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
            <span>Data provided by LottoX Financial</span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-900 rounded-full animate-ping"></span>
              Realtime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
