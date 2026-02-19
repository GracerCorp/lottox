import { cn } from "@/lib/utils";

interface LotteryBallProps {
  number: string | number;
  color?: "gold" | "blue" | "gray" | "emerald" | "red";
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
  const displayNum = String(number);
  const isMultiDigit = displayNum.length > 2;

  const sizeClasses = {
    sm: isMultiDigit ? "h-6 w-auto min-w-6 px-1.5 text-xs" : "w-6 h-6 text-xs",
    md: isMultiDigit ? "h-8 w-auto min-w-8 px-2 text-sm" : "w-8 h-8 text-sm",
    lg: isMultiDigit
      ? "h-10 w-auto min-w-10 px-3 text-base font-bold"
      : "w-10 h-10 text-base font-bold",
  };

  const colorClasses = {
    gold: "bg-gradient-to-br from-gold-300 to-gold-600 text-black border-gold-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]",
    blue: "bg-gradient-to-br from-blue-400 to-blue-700 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)]",
    gray: "bg-navy-700 text-white border-navy-600",
    emerald:
      "bg-gradient-to-br from-emerald-400 to-emerald-700 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    red: "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full border shadow-inner font-mono tabular-nums",
        sizeClasses[size],
        colorClasses[color as keyof typeof colorClasses],
        isBonus &&
          "ring-2 ring-offset-2 ring-offset-navy-900 ring-gold-500 animate-pulse-slow",
        className,
      )}
    >
      {number}
    </div>
  );
}
