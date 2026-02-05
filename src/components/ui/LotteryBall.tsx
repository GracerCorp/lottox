import { cn } from "@/lib/utils";

interface LotteryBallProps {
  number: string | number;
  color?: "gold" | "blue" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
  isBonus?: boolean;
}

export function LotteryBall({
  number,
  color = "gray",
  size = "md",
  className,
  isBonus = false,
}: LotteryBallProps) {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base font-bold",
  };

  const colorClasses = {
    gold: "bg-gradient-to-br from-gold-300 to-gold-600 text-black border-gold-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    blue: "bg-gradient-to-br from-blue-400 to-blue-700 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)]",
    gray: "bg-navy-700 text-white border-navy-600",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border shadow-inner",
        sizeClasses[size],
        colorClasses[color],
        isBonus &&
          "ring-2 ring-offset-2 ring-offset-navy-900 ring-gold-500 animate-pulse-slow",
        className,
      )}
    >
      {number}
    </div>
  );
}
