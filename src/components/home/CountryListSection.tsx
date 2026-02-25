"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFlagUrl } from "@/lib/flags";

export interface CountryListItem {
  id: string;
  name: string;
  count: number;
  flag: string;
}

export function CountryListSection({
  countries = [],
}: {
  countries?: CountryListItem[];
}) {
  const { t } = useLanguage();

  return (
    <section className="container mx-auto px-4 mb-20 relative z-10 w-full max-w-8xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t.countryList.title}
        </h2>
        <Link
          href="/global-draws"
          className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-navy-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 bg-white/50 dark:bg-navy-900/50 backdrop-blur-sm"
        >
          {t.countryList.seeAll}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {countries.map((country) => (
          <Link
            key={country.id}
            href={`/${country.id}`}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-1 border-gray-300 dark:border-gold-500/10 bg-white/90 dark:bg-gray-50 backdrop-blur-md hover:bg-gray-50 dark:hover:bg-gray-50/80 hover:border-gold-500 dark:hover:border-gold-500/20 transition-all shadow-sm hover:shadow group"
          >
            <div className="relative w-10 h-7 md:w-12 md:h-8 flex-shrink-0 overflow-hidden rounded shadow-sm border border-gold-100 dark:border-gold-500/5">
              <Image
                src={getFlagUrl(country.flag)}
                alt={
                  t.countryList.countries[
                    country.id as keyof typeof t.countryList.countries
                  ] || country.id
                }
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm md:text-base text-gray-900 dark:text-gray-800 truncate">
                {t.countryList.countries[
                  country.id as keyof typeof t.countryList.countries
                ] || country.name}
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 dark:text-gray-800 truncate">
                {country.count} {t.countryList.lotteries}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
