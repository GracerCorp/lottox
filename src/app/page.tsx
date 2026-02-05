import { LotteryCard } from "@/components/ui/LotteryCard";
import { HeroCarousel } from "@/components/ui/HeroCarousel";
import { ResultsTable } from "@/components/ui/ResultsTable";
import { CountryGrid } from "@/components/ui/CountryGrid";
import { ChevronRight, Globe, Search } from "lucide-react";

export default function Home() {
  const featuredLotteries = [
    {
      country: "Thailand",
      flag: "🇹🇭",
      name: "Thai Lotto",
      jackpot: "30 Million ฿",
      nextDraw: "View Latest Draws",
      balls: [4, 3, 5, 3, 8],
      bonusBall: 469,
      color: "gold" as const,
      href: "/results/thai-lotto",
      bgImage:
        "https://images.unsplash.com/photo-1598970605070-a38a6ccd3a2d?q=80&w=1335&auto=format&fit=crop", // Temp Thai Temple/Gold
    },
    {
      country: "USA",
      flag: "🇺🇸",
      name: "Powerball",
      jackpot: "$463 Million",
      nextDraw: "Next draw: 2 days",
      balls: [5, 12, 34, 41, 58],
      bonusBall: 9,
      color: "blue" as const,
      bgImage:
        "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=600&auto=format&fit=crop", // USA City/Night
    },
    {
      country: "Japan",
      flag: "🇯🇵",
      name: "Lotto 6",
      jackpot: "¥400 Million",
      nextDraw: "Next draw: Today",
      balls: [7, 11, 15, 31, 32],
      bonusBall: 35,
      color: "gold" as const,
      bgImage:
        "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop", // Japan
    },
    {
      country: "UK",
      flag: "🇬🇧",
      name: "UK National",
      jackpot: "£9.5M",
      nextDraw: "Next draw: 3 days",
      balls: [11, 14, 25, 34, 44],
      bonusBall: 21,
      color: "blue" as const,
      bgImage:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600&auto=format&fit=crop", // UK
    },
    {
      country: "Australia",
      flag: "🇦🇺",
      name: "Powerball",
      jackpot: "AU$30 Million",
      nextDraw: "Next draw: 4 days",
      balls: [5, 18, 29, 32, 55],
      bonusBall: 48,
      color: "gold" as const,
      bgImage:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop", // Australia
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative px-4 pt-12 md:pt-20">
        {/* Advanced Cosmic Background */}
        <div className="absolute inset-x-0 -top-40 z-0 h-[800px] w-full bg-nebula opacity-80 blur-3xl pointer-events-none mix-blend-screen" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent blur-[100px] z-0 pointer-events-none" />

        <div className="container relative z-10 mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl lg:text-6xl font-medium">
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                Worldwide Lottery Draws
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-blue-200/80 tracking-wide">
              The Global Platform for Verified Lottery Results - Real-Time Data
            </p>
          </div>

          {/* New Hero Carousel */}
          <HeroCarousel items={featuredLotteries} />

          {/* Interactive Action Bar - 100% Match */}
          <div className="mx-auto mt-14 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            {/* Left Button: View All Global Draws */}
            <button className="group relative flex h-16 w-full max-w-xs items-center justify-between overflow-hidden rounded-full bg-gradient-to-b from-blue-800 to-navy-900 px-8 shadow-lg transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.8)] md:w-auto md:min-w-[300px]">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
              <span className="relative z-10 text-lg font-bold text-white text-shadow-sm">
                View All <span className="text-green-400">●</span> Global Draws
              </span>
              <div className="relative z-10 flex h-8 w-8 ml-2 items-center justify-center rounded-full bg-blue-500/20 text-white backdrop-blur-sm">
                <ChevronRight className="h-5 w-5" />
              </div>
            </button>

            {/* Right Bar: Select Your Country */}
            <div className="relative flex h-16 w-full max-w-md items-center justify-between overflow-hidden rounded-full bg-gradient-to-b from-gray-100 via-gray-200 to-gray-400 px-3 py-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] md:w-auto">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/80 to-transparent" />

              <div className="relative z-10 flex w-full items-center justify-between px-4 gap-2">
                <span className="text-sm font-bold text-navy-900">
                  Select Your Country
                </span>
                <div className="flex items-center gap-2 border-l border-gray-300 pl-2">
                  {[
                    { flag: "��", code: "th" },
                    { flag: "🇬🇧", code: "uk" },
                    { flag: "��", code: "us" },
                    { flag: "🇯🇵", code: "jp" },
                    { flag: "��", code: "au" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="flex h-8 w-8 items-center justify-center transition-transform hover:scale-110 hover:shadow-md"
                      title={item.code}
                    >
                      <span className="text-base leading-none text-xl">
                        {item.flag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Feed */}
      <section className="container mx-auto px-4">
        <ResultsTable />
      </section>

      {/* Choose Country Section */}
      <section className="container mx-auto px-4">
        <CountryGrid />
      </section>
    </div>
  );
}
