"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

interface LotteryCardProps {
  name: string;
  country: string;
  flag: string;
  jackpot: string;
  nextDraw: string;
  gradientFrom: string;
  gradientTo: string;
}

export function LotteryCard({
  name,
  country,
  flag,
  jackpot,
  nextDraw,
  gradientFrom,
  gradientTo,
}: LotteryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl aspect-[3/4] group cursor-pointer"
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

      <div className="relative h-full p-6 flex flex-col justify-between z-10">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{flag}</span>
            <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
              {country}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
            {name}
          </h3>
        </div>

        {/* Center Jackpot */}
        <div className="text-center py-4">
          <div className="text-xs text-white/70 uppercase tracking-widest mb-1">
            Current Jackpot
          </div>
          <div className="text-4xl font-black text-white drop-shadow-md">
            {jackpot}
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-white/80 text-xs bg-black/20 py-1.5 px-3 rounded-full backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            <span>Next: {nextDraw}</span>
          </div>

          <button className="w-full py-3 bg-white text-navy-900 font-bold rounded-xl transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
            View Details <ArrowRight className="w-4 h-4" />
          </button>

          {/* Fallback button state for touch devices or before hover */}
          <div className="w-full py-3 text-center text-white/60 text-sm group-hover:hidden">
            Tap to explore
          </div>
        </div>
      </div>
    </motion.div>
  );
}
