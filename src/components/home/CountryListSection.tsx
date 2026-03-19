"use client";

import Link from "next/link";
import Image from "next/image";
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
    <section className="container mx-auto px-4 py-10 relative z-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.countryList.title}
        </h2>
        <p className="text-sm text-gray-400">
          {t.countryList.subtitle || t.countryList.seeAll}
        </p>
      </div>

      {/* Country Pills */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
        {countries.map((country) => {
          const localizedName =
            t.countryList?.countries?.[
              country.id as keyof typeof t.countryList.countries
            ] || country.name;

          return (
            <Link
              key={country.id}
              href={`/${country.id}`}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-navy-900/60 hover:bg-gray-50 dark:hover:bg-navy-800/80 hover:border-gold-500/30 backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <div className="relative w-8 h-5 flex-shrink-0 overflow-hidden rounded shadow-sm">
                <Image
                  src={getFlagUrl(country.flag)}
                  alt={localizedName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-gold-400 transition-colors">
                  {localizedName}
                </span>
                <span className="text-fs-badge text-gray-500">
                  {country.count} {t.countryList?.lotteries || "lottery"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
