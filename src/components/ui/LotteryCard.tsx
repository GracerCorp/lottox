import { ArrowRight } from "lucide-react";
import { LotteryBall } from "@/components/ui/LotteryBall";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface LotteryCardProps {
  country: string;
  flag: string; // This will now be a URL
  name: string;
  jackpot: string;
  nextDraw: string;
  balls: (string | number)[];
  bonusBall?: string | number;
  color: "gold" | "blue" | "purple";
  bgImage?: string;
  className?: string;
  href?: string;
  isActive?: boolean;
}

export function LotteryCard({
  country,
  flag,
  name,
  jackpot,
  nextDraw,
  balls,
  bonusBall,
  color,
  bgImage,
  className,
  href = "#",
  isActive = false,
}: LotteryCardProps) {
  const gradients = {
    gold: "from-navy-900 via-navy-800 to-gold-900/20 border-gold-500/50 hover:border-gold-400 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_0_rgba(245,158,11,0.5)]",
    blue: "from-navy-900 via-navy-800 to-blue-900/20 border-blue-500/50 hover:border-blue-400 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_0_rgba(59,130,246,0.5)]",
    purple:
      "from-navy-900 via-navy-800 to-purple-900/20 border-purple-500/50 hover:border-purple-400 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_0_rgba(139,92,246,0.5)]",
  };

  const glowColors = {
    gold: "bg-gold-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };

  const auraColors = {
    gold: "shadow-[0_0_15px_0_rgba(245,158,11,0.5),0_0_50px_10px_rgba(245,158,11,0.2)] border-gold-400/80 ring-1 ring-gold-300/50 z-20",
    blue: "shadow-[0_0_15px_0_rgba(59,130,246,0.5),0_0_50px_10px_rgba(59,130,246,0.2)] border-blue-400/80 ring-1 ring-blue-300/50 z-20",
    purple:
      "shadow-[0_0_15px_0_rgba(139,92,246,0.5),0_0_50px_10px_rgba(139,92,246,0.2)] border-purple-400/80 ring-1 ring-purple-300/50 z-20",
  };

  const spotlightColors = {
    gold: "from-gold-500/20",
    blue: "from-blue-500/20",
    purple: "from-purple-500/20",
  };

  const jackpotColors = {
    gold: "text-gradient-gold",
    blue: "text-blue-200",
    purple: "text-purple-200",
  };

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-6 transition-all duration-500 hover:-translate-y-1",
        gradients[color],
        isActive && auraColors[color],
        className,
      )}
    >
      {/* Active Spotlight Effect */}
      {isActive && (
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent opacity-100 transition-all duration-500",
            spotlightColors[color],
          )}
        />
      )}
      {/* Custom Background Image */}
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-100">
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-600/50 to-transparent" />
        </div>
      )}

      {/* Background ambient light */}
      <div
        className={cn(
          "absolute -right-10 -top-10 h-64 w-64 rounded-full blur-[80px] transition-all duration-500 group-hover:opacity-60",
          isActive ? "opacity-20" : "opacity-10",
          glowColors[color],
        )}
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-200 group-hover:text-gray-100">
            <div className="relative h-5 w-8 overflow-hidden rounded shadow-sm">
              <Image
                src={flag}
                alt={`${country} flag`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span>{country}</span>
          </div>
          <h3
            className={cn(
              "mt-2 text-2xl font-black tracking-tight transition-colors",
              isActive
                ? "text-gold-200"
                : "text-white group-hover:text-gold-200",
            )}
          >
            {name}
          </h3>
        </div>
      </div>

      {/* Jackpot */}
      <div className="relative z-10 mt-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-300">
          Esminated Jackpot
        </div>
        <div
          className={cn(
            "mt-1 text-3xl font-black tracking-tighter drop-shadow-lg transition-all duration-500",
            jackpotColors[color],
            color === "gold" && "text-glow",
            isActive &&
              "drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105 origin-left",
          )}
        >
          {jackpot}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          {nextDraw}
        </div>
      </div>

      {/* Balls */}
      <div className="relative z-10 mt-8 flex flex-wrap gap-2">
        {balls.slice(0, 5).map((num, i) => (
          <LotteryBall
            key={i}
            number={num}
            size="sm"
            color="gray"
            className="border-white/10 bg-navy-950/50"
          />
        ))}
        {bonusBall && (
          <LotteryBall
            number={bonusBall}
            size="sm"
            color={color === "purple" ? "blue" : "gold"}
            isBonus
          />
        )}
      </div>

      {/* Action */}
      <div className="relative z-10 mt-8 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
          <span>View Details</span>
          <ArrowRight className="h-4 w-4 text-gold-500 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
