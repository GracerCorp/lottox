"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const POPULAR_LOTTERIES = [
  { label: "Thai Government Lottery", href: "/th/government-lottery-glo" },
  { label: "Lao Lottery", href: "/la/lao-lottery" },
  { label: "Japan Loto 6", href: "/jp/loto-6" },
  { label: "Australia Powerball", href: "/au/powerball" },
];

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Logo */}
      <div className="relative h-16 w-16 mb-6 rounded-full overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.4)]">
        <Image src="/logo.png" alt="LOTTOX" fill className="object-cover" />
      </div>

      {/* 404 */}
      <h1 className="text-fs-5xl font-black text-gray-200 dark:text-neutral-700 mb-2">
        404
      </h1>
      <h2 className="text-fs-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t.common?.pageNotFound ?? "Page Not Found"}
      </h2>
      <p className="text-fs-sm text-gray-500 dark:text-gray-400 max-w-md mb-8">
        {t.common?.pageNotFoundDesc ?? "The page you're looking for doesn't exist or has been moved."}
      </p>

      {/* Go Home */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition-colors shadow-lg mb-10"
      >
        <Home className="w-5 h-5" />
        {t.common?.goHome ?? "Go Home"}
      </Link>

      {/* Popular lotteries */}
      <div className="w-full max-w-md">
        <h3 className="text-fs-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Popular Lotteries
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {POPULAR_LOTTERIES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 hover:border-gold-400 dark:hover:border-gold-500/30 transition-colors group"
            >
              <span className="text-fs-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                {item.label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gold-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
