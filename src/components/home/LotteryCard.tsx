"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";

interface LotteryCardProps {
  name: string;
  country: string;
  flag: string; // URL
  jackpot: string;
  nextDraw: string;
  gradientFrom: string;
  gradientTo: string;
  bgImage?: string;
  href?: string;
}

export function LotteryCard({
  name,
  country,
  flag,
  jackpot,
  nextDraw,
  gradientFrom,
  gradientTo,
  href = "#",
  bgImage,
  hideResults = false,
}: LotteryCardProps & { hideResults?: boolean }) {
  const { t } = useLanguage();

  const CardContent = (
    <div className="relative h-full p-6 flex flex-col justify-between z-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative h-6 w-8 overflow-hidden rounded shadow-sm">
            <Image
              src={flag}
              alt={`${country} flag`}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
            {country}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1 leading-tight">
          {name}
        </h3>
      </div>

      {/* Center Jackpot */}
      <div className="text-center py-4 flex-1 flex flex-col justify-center">
        <div className="text-sm font-semibold text-gold-400 uppercase tracking-widest mb-2 drop-shadow-sm">
          {t.hero.estimatedJackpot}
        </div>
        <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">
          {jackpot}
        </div>
      </div>

      {/* Footer information */}
      <div className="flex flex-col items-center gap-3">
        {/* Draw Date */}
        <div className="flex items-center justify-center gap-2 text-white/90 text-sm font-medium bg-navy-900/40 py-2 px-4 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
          <Clock className="w-4 h-4 text-gold-400" />
          <span>{nextDraw}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl aspect-[3/4] group cursor-pointer border border-white/10"
      >
        {/* Background Image */}
        {bgImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-navy-900/60 group-hover:bg-navy-900/40 transition-colors duration-300" />
          </div>
        )}

        {/* Background Gradient (Fallback or Overlay) */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-80 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-60`}
        />

        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-white/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

        {CardContent}
      </motion.div>
    </Link>
  );
}
