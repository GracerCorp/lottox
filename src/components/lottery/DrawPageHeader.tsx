"use client";

import { SubscribeButton } from "@/components/ui/SubscribeButton";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";
import Image from "next/image";

interface DrawPageHeaderProps {
  country: string;
  countryCode: string;
  lotteryName: string;
  lotteryId: number;
  logo?: string | null;
}

export function DrawPageHeader({
  country,
  countryCode,
  lotteryName,
  lotteryId,
  logo,
}: DrawPageHeaderProps) {
  const { t } = useLanguage();

  return (
    <header
      className="mb-8 flex flex-col gap-4 border-b border-slate-200 dark:border-white/10 pb-6 md:flex-row md:items-end md:justify-between"
      data-testid="draw-page-header"
    >
      <div>
        <div className="flex items-center gap-2 text-fs-sm">
          <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-green-600 dark:text-green-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" /> {t.header.verified}
          </span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600 dark:text-gray-400 flex items-center">
            <Image
              src={getFlagUrl(countryCode)}
              alt={`${country} flag`}
              width={24}
              height={16}
              className="mr-1.5 inline-block h-4 w-6 rounded-sm shadow-sm"
            />
            {country}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {logo ? (
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-white/10 shadow-sm bg-white dark:bg-navy-900">
              <Image
                src={logo}
                alt={`${lotteryName} logo`}
                fill
                className="object-contain p-1.5"
              />
            </div>
          ) : (
            <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-gold-500/20 text-gold-500 font-bold border border-gold-500/30 text-lg shadow-sm">
              {lotteryName.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-fs-3xl font-bold text-gray-900 dark:text-white">
              {lotteryName}
            </h1>
            <p className="text-fs-xs text-gray-500 dark:text-gray-400">
              {t.staticParams.drawDetail.officialResults}
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-20">
        <SubscribeButton lotteryId={lotteryId} lotteryName={lotteryName} />
      </div>
    </header>
  );
}
