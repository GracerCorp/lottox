import { cn } from "@/lib/utils";

interface LotteryBallProps {
  number: string | number;
  color?: "gold" | "blue" | "gray" | "dark-gray" | "emerald" | "red";
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "squircle";
  className?: string;
  isBonus?: boolean;
}

export function LotteryBall({
  number,
  color = "gray",
  size = "md",
  shape = "squircle",
  className,
  isBonus = false,
}: LotteryBallProps) {
  const displayNum = String(number);
  const isMultiDigit = displayNum.length > 2;

  const sizeClasses = {
    sm: isMultiDigit ? "h-6 w-auto min-w-6 px-1.5 text-xs" : "w-6 h-6 text-xs",
    md: isMultiDigit ? "h-8 w-auto min-w-[2rem] px-2 text-sm" : "w-8 h-8 text-sm",
    lg: isMultiDigit
      ? "h-10 w-auto min-w-[2.5rem] px-3 text-base font-bold"
      : "w-10 h-10 text-base font-bold",
    xl: "w-[4.5rem] h-[5rem] text-4xl font-bold sm:w-[5.5rem] sm:h-[6rem] sm:text-5xl",
  };

  const colorClasses = {
    gold: "bg-gradient-to-b from-[#E6CA8D] to-[#DFB971] text-neutral-900 border-[#D4A559] shadow-sm",
    blue: "bg-gradient-to-br from-blue-400 to-blue-700 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.4)]",
    gray: "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-white border-gray-300 dark:border-neutral-600",
    "dark-gray": "bg-[#5D5D5D] border-[#4A4A4A] text-white shadow-inner",
    emerald:
      "bg-gradient-to-br from-emerald-400 to-emerald-700 text-white border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
    red: "bg-gradient-to-br from-red-500 to-red-700 text-white border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center border shadow-inner font-mono tabular-nums",
        shape === "squircle" ? "rounded-xl sm:rounded-2xl" : "rounded-full",
        sizeClasses[size],
        colorClasses[color as keyof typeof colorClasses],
        isBonus &&
          "ring-2 ring-offset-2 ring-offset-neutral-900 ring-gold-500 animate-pulse-slow",
        className,
      )}
    >
      {number}
    </div>
  );
}
