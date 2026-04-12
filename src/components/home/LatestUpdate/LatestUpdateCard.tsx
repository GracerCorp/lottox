import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface PrizeItem {
  label: string;
  value: string[];
  prize: string;
  isMain?: boolean;
}

export interface LatestUpdateCardProps {
  id: string;
  country: string;
  flag: string;
  logo?: string | null;
  date: string;
  time: string;
  href: string;
  name?: string;
  numbers: PrizeItem[];
}

export function LatestUpdateCard({
  name,
  country,
  flag,
  logo,
  date,
  time,
  href,
  numbers,
}: LatestUpdateCardProps) {
  return (
    <Link href={href} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-2xl h-full">
      <div className="rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-[#171717] transition-all duration-300 overflow-hidden shadow-lg group-hover:bg-neutral-50 dark:group-hover:bg-[#1a1a1a] group-hover:-translate-y-1 group-hover:shadow-[0_0_25px_rgba(216,176,95,0.2)] group-hover:border-[#D8B05F]/40 p-4 md:p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3">
          {/* Logo/Flag Circle */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-200 dark:border-white/10 shadow-sm bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-1">
            {logo || flag ? (
              <Image
                src={logo || flag}
                alt={`${name || country} logo`}
                fill
                className="object-contain rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight truncate">
                {name}
              </span>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-white fill-[#22c55e] opacity-90 rounded-full" />
            </div>
            <span className="text-xs text-neutral-500 dark:text-gray-500 leading-none mt-1 truncate">
              {country}
            </span>
          </div>
        </div>

        {/* Data Box */}
        <div className="mt-4 flex-1 rounded-xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-[#202020] p-4 flex flex-col">
          {/* Top Line: Time & Date */}
          <div className="text-xs text-neutral-500 dark:text-gray-400 mb-3 font-medium">
            {time && <>{time} <span className="opacity-50 px-0.5">|</span> </>}{date}
          </div>

          {/* Values Grid */}
          <div className="flex flex-wrap gap-x-4 gap-y-3 mt-1">
            {numbers.map((prize, idx) => (
              <div key={idx} className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 dark:text-gray-400 mb-1 leading-none uppercase translate-y-0.5">
                  {prize.label}
                </span>
                <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                  {prize.value.map((v, vi) => (
                    <span
                      key={vi}
                      className={`text-sm tracking-widest font-black ${
                        prize.isMain ? "text-gold-400" : "text-neutral-900 dark:text-white"
                      }`}
                    >
                      {v.replace(/ /g, "\u00A0")}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
