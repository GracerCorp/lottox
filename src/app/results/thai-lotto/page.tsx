import { LotteryBall } from "@/components/ui/LotteryBall";
import { ChevronRight, Search, ShieldCheck } from "lucide-react";

export default function ThaiLottoPage() {
  const recentResults = [
    {
      date: "16.04.24",
      draw: "Thai Lotto",
      nums: "4 3 5 5 8",
      prize: "6 Million ฿",
    },
    {
      date: "01.04.24",
      draw: "Thai Lotto",
      nums: "6 3 3 7 9",
      top3: "238",
      prize: "6 Million ฿",
    },
    {
      date: "16.03.24",
      draw: "Thai Lotto",
      nums: "2 3 6 2 8",
      top3: "79",
      prize: "6 Million ฿",
    },
    {
      date: "01.03.24",
      draw: "Thai Lotto",
      nums: "0 9 1 2 0",
      top3: "303",
      prize: "6 Million ฿",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb / Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
            <span>•</span>
            <span>🇹🇭 Thailand</span>
            <span>•</span>
            <span>GLO</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Official Lottery Results
          </h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (Results) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Latest Draw Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-gold-500/20 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-8 shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-gold-500/10 blur-3xl" />

            <div className="relative z-10 text-center">
              <div className="mb-2 text-sm uppercase tracking-widest text-gold-400">
                The Latest Draw
              </div>

              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="text-4xl">🇹🇭</span>
                <div className="text-left">
                  <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-600 drop-shadow-sm">
                    THAI LOTTO
                  </h2>
                </div>
              </div>

              <div className="mb-8 text-sm text-gray-400">
                April 16, 2024 • Draw #39/2567 • 3d ago
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {[4, 3, 5, 3, 8].map((n, i) => (
                  <LotteryBall
                    key={i}
                    number={n}
                    size="lg"
                    color="gold"
                    className="h-16 w-16 text-3xl font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  />
                ))}
                <div className="mx-2 h-12 w-px bg-white/20" />
                <LotteryBall
                  number={469}
                  size="lg"
                  color="blue"
                  className="h-16 w-auto px-4 text-2xl font-bold rounded-xl"
                  isBonus
                />
              </div>
            </div>
          </div>

          {/* Connect "Verify Your Ticket" */}
          <div className="rounded-xl border border-white/10 bg-navy-800/50 p-6 backdrop-blur-md">
            <h3 className="mb-4 text-lg font-bold text-white">
              VERIFY YOUR TICKET
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              <select className="flex-1 rounded-lg border border-white/10 bg-navy-900 px-4 py-3 text-white outline-none focus:border-gold-500">
                <option>Step 1: Thai Lotto</option>
              </select>
              <div className="flex-[2] relative">
                <input
                  type="text"
                  placeholder="99 72, 34, 58 98..."
                  className="w-full rounded-lg border border-white/10 bg-navy-900 px-4 py-3 pl-10 text-white outline-none focus:border-gold-500"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" />
              </div>
              <button className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-500">
                CHECK NOW
              </button>
            </div>
          </div>

          {/* Recent Results Table */}
          <div className="rounded-xl border border-white/10 bg-navy-900/50">
            <div className="border-b border-white/10 px-6 py-4">
              <h3 className="font-bold text-white">RECENT OFFICIAL RESULTS</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-xs uppercase text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Draw #</th>
                    <th className="px-6 py-3">6 Digit Winning Number</th>
                    <th className="px-6 py-3">Top 3</th>
                    <th className="px-6 py-3 text-right">Prize</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentResults.map((row, i) => (
                    <tr key={i} className="group hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {row.date}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span>🇹🇭</span>
                          <span className="font-medium text-white">
                            {row.draw}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-xl tracking-widest text-white">
                        {row.nums}
                      </td>
                      <td className="px-6 py-4">
                        {row.top3 && (
                          <span className="rounded bg-gold-500/20 px-2 py-0.5 text-xs text-gold-400 border border-gold-500/20">
                            {row.top3}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gold-400">
                        {row.prize}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-navy-800/30 p-6">
            <h3 className="mb-4 font-bold text-white">
              Thai Lotto - Stats Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Next Draw:</span>
                <span className="font-bold text-gold-400">May 1 - 2:30PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Odds of Winning Jackpot:</span>
                <span className="text-white">1 in 1000000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Smallest Jackpot Ever:</span>
                <span className="text-white">2 Million ฿</span>
              </div>
              <button className="mt-4 w-full rounded-lg bg-gold-500 py-3 text-sm font-bold text-black transition-transform hover:scale-105">
                View Detailed Statistics
              </button>
            </div>
          </div>

          {/* Other Lotteries */}
          <div className="rounded-xl border border-white/10 bg-navy-800/30 p-6">
            <h3 className="mb-4 font-bold text-white">
              Choose Another Lottery
            </h3>
            <div className="space-y-3">
              {[
                { name: "Mega Millions", flag: "🇺🇸", jackpot: "$202 Million" },
                { name: "USA Powerball", flag: "🇺🇸", jackpot: "$463 Million" },
                { name: "Japan Lotto 6", flag: "🇯🇵", jackpot: "¥400 Million" },
              ].map((lotto, i) => (
                <button
                  key={i}
                  className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-navy-900 p-3 transition-colors hover:border-white/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lotto.flag}</span>
                    <div className="text-left text-sm font-semibold text-white">
                      {lotto.name}
                      <div className="text-xs font-normal text-gray-500">
                        1 Lottery
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
