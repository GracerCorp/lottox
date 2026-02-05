"use client";

import { Filter, Clock, ChevronDown } from "lucide-react";

export function DashboardTable() {
  const draws = [
    {
      time: "10:59 PM",
      country: "USA",
      name: "USA Powerball",
      numbers: "05 12 34 41 58",
      special: "09",
      jackpot: "$463 Million",
      status: "high",
    },
    {
      time: "03:00 PM",
      country: "EUR",
      name: "EuroJackpot",
      numbers: "14 30 32 44 49",
      special: "04",
      jackpot: "€61 Million",
      status: "med",
    },
    {
      time: "02:30 PM",
      country: "THA",
      name: "Thai Lotto",
      numbers: "435398",
      special: "469",
      jackpot: "6 Million ฿",
      status: "none",
    },
    {
      time: "02:30 PM",
      country: "CAN",
      name: "Canada Lotto 6/49",
      numbers: "15 20 23 25 44",
      special: "50",
      jackpot: "CN$5 Million",
      status: "med",
    },
    {
      time: "02:30 PM",
      country: "ITA",
      name: "Italy SuperEnalotto",
      numbers: "29 47 57 58 79",
      special: "89",
      jackpot: "€79 Million",
      status: "med",
    },
  ];

  return (
    <div className="bg-navy-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Controls Header */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-navy-800/50">
        <div className="flex gap-2">
          {["All Results", "7 Days", "30 Days", "Countries"].map(
            (filter, i) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-navy-600 text-white" : "text-gray-400 hover:text-white hover:bg-navy-700"}`}
              >
                {filter}
              </button>
            ),
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" /> 016:52:13
          </span>
          <div className="h-6 w-px bg-white/10 mx-2"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase">
              High Intensity
            </span>
            <div className="flex gap-0.5">
              <div className="w-1 h-3 bg-gold-500 rounded-full"></div>
              <div className="w-1 h-3 bg-gold-500 rounded-full"></div>
              <div className="w-1 h-3 bg-gold-500/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-navy-950/80 text-gray-500 text-xs uppercase font-medium tracking-wider">
        <div className="col-span-2">Time</div>
        <div className="col-span-4">Lottery</div>
        <div className="col-span-4">Winning Numbers</div>
        <div className="col-span-2 text-right">Jackpot</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-white/5">
        {draws.map((draw, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group"
          >
            <div className="col-span-2 text-gold-400 font-mono text-sm">
              {draw.time}
            </div>
            <div className="col-span-4 flex items-center gap-3">
              <span className="text-xs bg-navy-700 text-gray-300 px-1.5 py-0.5 rounded">
                {draw.country}
              </span>
              <span className="text-white font-medium group-hover:text-gold-400 transition-colors">
                {draw.name}
              </span>
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <span className="text-white font-mono tracking-wide">
                {draw.numbers}
              </span>
              {draw.special && (
                <span className="bg-gold-500 text-navy-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {draw.special}
                </span>
              )}
            </div>
            <div className="col-span-2 text-right text-white font-bold">
              {draw.jackpot}
            </div>
          </div>
        ))}
        {/* Date Separator Example */}
        <div className="px-6 py-2 bg-navy-950/30 text-gray-500 text-xs font-bold uppercase mt-4">
          Apr 19, 2024
        </div>
        {draws.slice(0, 3).map((draw, idx) => (
          <div
            key={`dup-${idx}`}
            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group opacity-70"
          >
            <div className="col-span-2 text-gold-400/70 font-mono text-sm">
              {draw.time}
            </div>
            <div className="col-span-4 flex items-center gap-3">
              <span className="text-xs bg-navy-700 text-gray-300 px-1.5 py-0.5 rounded">
                {draw.country}
              </span>
              <span className="text-white font-medium">{draw.name}</span>
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <span className="text-white font-mono tracking-wide">
                {draw.numbers}
              </span>
              {draw.special && (
                <span className="bg-gold-500/70 text-navy-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {draw.special}
                </span>
              )}
            </div>
            <div className="col-span-2 text-right text-white font-bold">
              {draw.jackpot}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
