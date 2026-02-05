import { LotteryBall } from "@/components/ui/LotteryBall";
import { cn } from "@/lib/utils";

interface ResultRow {
  time: string;
  flag: string;
  country: string;
  name: string;
  balls: (string | number)[];
  bonusBall?: string | number;
  jackpot: string;
  currency: string;
}

export function ResultsTable() {
  const results: ResultRow[] = [
    {
      time: "10:59 PM",
      flag: "🇺🇸",
      country: "USA",
      name: "Powerball",
      balls: ["05", "12", "34", "41", "58"],
      bonusBall: "09",
      jackpot: "$463 Million",
      currency: "$",
    },
    {
      time: "07:30 PM",
      flag: "🇬🇧",
      country: "UK",
      name: "National Lottery",
      balls: ["14", "30", "32", "44", "49"],
      bonusBall: "04",
      jackpot: "£9.5 Million",
      currency: "£",
    },
    {
      time: "02:30 PM",
      flag: "🇹🇭",
      country: "Thailand",
      name: "Thai Lotto",
      balls: ["4", "3", "5", "3", "9", "8"],
      bonusBall: "469",
      jackpot: "6 Million ฿",
      currency: "฿",
    },
    {
      time: "06:30 PM",
      flag: "🇯🇵",
      country: "Japan",
      name: "Lotto 6",
      balls: ["01", "05", "06", "13", "23"],
      bonusBall: "25",
      jackpot: "¥400 Million",
      currency: "¥",
    },
    {
      time: "08:45 PM",
      flag: "🇦🇺",
      country: "Australia",
      name: "Powerball",
      balls: ["01", "02", "07", "50", "57"],
      bonusBall: "17",
      jackpot: "AU$30 Million",
      currency: "AU$",
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-navy-900/50 backdrop-blur-md bg-gradient-to-b">
      {/* Table Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">
            Latest Global Results
          </h2>
          <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            LIVE
          </span>
        </div>
        <div className="text-sm text-gray-400">Updated: 3 min ago</div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Lottery</th>
              <th className="px-6 py-3 font-medium">Winning Numbers</th>
              <th className="px-6 py-3 font-medium text-right">Jackpot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {results.map((item, index) => (
              <tr
                key={index}
                className="group transition-colors hover:bg-white/5"
              >
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-400">
                  {item.time}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.flag}</span>
                    <span className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                      {item.country} {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {item.balls.map((ball, i) => (
                      <LotteryBall
                        key={i}
                        number={ball}
                        size="sm"
                        className="h-7 w-7 border-0 bg-navy-800 text-xs font-semibold text-white"
                      />
                    ))}
                    {item.bonusBall && (
                      <LotteryBall
                        number={item.bonusBall}
                        size="sm"
                        color="gold"
                        className="h-7 w-7 text-xs font-bold"
                        isBonus
                      />
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <span className="font-bold text-gold-400">
                    {item.jackpot}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-white/10 px-6 py-4 text-center">
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          View All Results
        </button>
      </div>
    </div>
  );
}
