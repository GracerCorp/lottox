"use client";

import { LotteryCard } from "./LotteryCard";
import { motion } from "framer-motion";

const FEATURED_LOTTERIES = [
  {
    name: "Thai Lotto",
    country: "Thailand",
    flag: "🇹🇭",
    jackpot: "60 Million ฿",
    nextDraw: "In 2 days",
    gradientFrom: "from-blue-900",
    gradientTo: "to-red-900",
  },
  {
    name: "Powerball",
    country: "USA",
    flag: "🇺🇸",
    jackpot: "$463M",
    nextDraw: "Tonight",
    gradientFrom: "from-blue-800",
    gradientTo: "to-purple-900",
  },
  {
    name: "Mega Millions",
    country: "Global",
    flag: "🌍",
    jackpot: "€56M",
    nextDraw: "Tomorrow",
    gradientFrom: "from-yellow-700",
    gradientTo: "to-orange-900",
  },
  {
    name: "EuroMillions",
    country: "Europe",
    flag: "🇪🇺",
    jackpot: "€56M",
    nextDraw: "Friday",
    gradientFrom: "from-blue-700",
    gradientTo: "to-blue-900",
  },
  {
    name: "Lotto 6",
    country: "Japan",
    flag: "🇯🇵",
    jackpot: "¥400M",
    nextDraw: "Thursday",
    gradientFrom: "from-red-800",
    gradientTo: "to-pink-900",
  },
];

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-radial from-blue-500/10 to-transparent opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Worldwide Lottery Draws
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            The Global Platform for Verified Lottery Results - Real-Time Data
            from 50+ Countries
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {FEATURED_LOTTERIES.map((lotto, index) => (
            <motion.div
              key={lotto.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <LotteryCard {...lotto} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="bg-navy-800 hover:bg-navy-700 text-white px-8 py-3 rounded-full font-medium transition-colors border border-white/10 shadow-lg hover:shadow-gold-500/20">
            View All Global Draws
          </button>
        </div>
      </div>
    </section>
  );
}
