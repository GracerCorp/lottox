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

export function CountryMarqueeSection({
  countries = [],
}: {
  countries?: CountryListItem[];
}) {
  const { t } = useLanguage();

  if (!countries || countries.length === 0) return null;

  // Split countries into two rows
  const midPoint = Math.ceil(countries.length / 2);
  const row1Items = countries.slice(0, midPoint);
  const row2Items = countries.slice(midPoint);

  // We duplicate items exactly once to make the infinite scroll work precisely with the 50% transform
  const row1 = [...row1Items, ...row1Items];
  const row2 = [...row2Items, ...row2Items];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Chip = ({ country, index }: { country: CountryListItem; index: number }) => {
    const localizedName =
      t.countryList?.countries?.[
        country.id as keyof typeof t.countryList.countries
      ] || country.name;

    return (
      <Link
        href={`/country/${country.id}`}
        className="marquee-item group flex items-center gap-4 px-5 py-3.5 rounded-2xl border border-white/10 bg-[#1A1A1A] hover:bg-[#262626] hover:border-gold-500/50 transition-all duration-300 hover:scale-[1.02] shadow-sm flex-shrink-0"
      >
        <div className="relative w-10 h-6 flex-shrink-0 overflow-hidden rounded shadow-sm">
          <Image
            src={getFlagUrl(country.flag)}
            alt={localizedName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-[8rem]">
          <span className="font-bold text-base text-neutral-900 dark:text-white tracking-wide truncate group-hover:text-gold-500 dark:group-hover:text-gold-400 transition-colors">
            {localizedName}
          </span>
          <span className="text-xs text-neutral-500 dark:text-gray-400">
            {country.count} {t.countryList?.lotteries || "lottery"}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <section className="bg-transparent py-16 relative z-10 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {t.countryList?.title || "Lottery By Country"}
        </h2>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {t.countryList?.subtitle || "Browse available lotteries by country and explore their latest results."}
        </p>
      </div>

      {/* Marquee Track Container */}
      <div className="country-marquee-container flex flex-col gap-4 relative">
        {/* Left/Right Fading Overlays */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[var(--background)] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[var(--background)] to-transparent z-10" />

        {/* Row 1: Scrolling Left */}
        {row1Items.length > 0 && (
          <div className="flex w-max gap-3 animate-marquee-left">
            {row1.map((country, idx) => (
              <Chip key={`row1-${country.id}-${idx}`} country={country} index={idx} />
            ))}
          </div>
        )}

        {/* Row 2: Scrolling Right */}
        {row2Items.length > 0 && (
          <div className="flex w-max gap-3 animate-marquee-right">
            {row2.map((country, idx) => (
              <Chip key={`row2-${country.id}-${idx}`} country={country} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
