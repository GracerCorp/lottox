import { ArrowRight } from "lucide-react";
import { LotteryBall } from "@/components/ui/LotteryBall";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LotteryCardProps {
  country: string;
  flag: string;
  name: string;
  jackpot: string;
  nextDraw: string;
  balls: (string | number)[];
  bonusBall?: string | number;
  color: "gold" | "blue" | "purple";
  bgImage?: string;
  className?: string;
  href?: string;
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
}: LotteryCardProps) {
  const gradients = {
    gold: "from-navy-900 via-navy-800 to-gold-900/20 border-gold-500/30 hover:border-gold-400/60 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]",
    blue: "from-navy-900 via-navy-800 to-blue-900/20 border-blue-500/30 hover:border-blue-400/60 shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
    purple:
      "from-navy-900 via-navy-800 to-purple-900/20 border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]",
  };

  const glowColors = {
    gold: "bg-gold-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
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
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-500 hover:-translate-y-1",
        gradients[color],
        className,
      )}
    >
      {/* Custom Background Image */}
      {bgImage && (
        <div className="absolute inset-0 z-0 opacity-100">
          <img
            src={bgImage}
            alt=""
            className="h-full w-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-600/50 to-transparent" />
        </div>
      )}

      {/* Background ambient light */}
      <div
        className={cn(
          "absolute -right-10 -top-10 h-64 w-64 rounded-full opacity-10 blur-[80px] transition-all duration-500 group-hover:opacity-20",
          glowColors[color],
        )}
      />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400">
            <span className="text-lg">{flag}</span>
            <span>{country}</span>
          </div>
          <h3 className="mt-2 text-2xl font-black tracking-tight text-white group-hover:text-gold-200 transition-colors">
            {name}
          </h3>
        </div>
      </div>

      {/* Jackpot */}
      <div className="relative z-10 mt-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Esminated Jackpot
        </div>
        <div
          className={cn(
            "mt-1 text-3xl font-black tracking-tighter drop-shadow-lg",
            jackpotColors[color],
            color === "gold" && "text-glow",
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
