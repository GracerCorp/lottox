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
  name: string;
  country: string;
  flag: string;
  date: string;
  time: string;
  href: string;
  numbers: PrizeItem[];
}

export function LatestUpdateCard({
  name,
  country,
  flag,
  date,
  time,
  href,
  numbers,
}: LatestUpdateCardProps) {
  return (
    <Link href={href} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-2xl h-full">
      <div className="rounded-2xl border border-white/5 bg-[#171717] transition-all duration-300 overflow-hidden shadow-lg group-hover:bg-[#1a1a1a] group-hover:-translate-y-1 group-hover:shadow-[0_0_25px_rgba(216,176,95,0.2)] group-hover:border-[#D8B05F]/40 p-4 md:p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3">
          {/* Logo/Flag Circle */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-sm bg-neutral-900 flex items-center justify-center">
            {flag ? (
              !flag.includes("/") ? (
                <span className="text-xl leading-none">{flag}</span>
              ) : (
                <Image
                  src={flag}
                  alt={`${country} flag`}
                  fill
                  className="object-cover"
                />
              )
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white leading-tight truncate">
                {name}
              </span>
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#22c55e] fill-current opacity-90" />
            </div>
            <span className="text-xs text-gray-500 leading-none mt-1 truncate">
              {country}
            </span>
          </div>
        </div>

        {/* Data Box */}
        <div className="mt-4 flex-1 rounded-xl border border-white/5 bg-[#202020] p-4 flex flex-col">
          {/* Top Line: Time & Date */}
          <div className="text-xs text-gray-400 mb-3 font-medium">
            {time && <>{time} <span className="opacity-50 px-0.5">|</span> </>}{date}
          </div>

          {/* Values Grid */}
          <div className="flex flex-wrap gap-x-4 gap-y-3 mt-auto">
            {numbers.map((prize, idx) => (
              <div key={idx} className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 mb-1 leading-none uppercase translate-y-0.5">
                  {prize.label}
                </span>
                <div className="flex items-baseline gap-1.5 min-w-0 flex-wrap">
                  {prize.value.map((v, vi) => (
                    <span
                      key={vi}
                      className={`text-sm tracking-widest font-black ${
                        prize.isMain ? "text-gold-400" : "text-white"
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
