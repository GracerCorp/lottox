"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

interface CountryHeroSectionProps {
  countryName: string;
  countryCode: string;
  flag: string | null;
}

export function CountryHeroSection({
  countryName,
  countryCode,
  flag,
}: CountryHeroSectionProps) {
  const { t } = useLanguage();

  const officialResults =
    (t as unknown as Record<string, Record<string, string>>)?.country
      ?.officialResults ?? "Official Results";


  return (
    <section
      data-testid="country-hero"
      className="relative overflow-hidden py-14 text-white"
    >
      {/* Dark mode background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1e40af 0%, #0f172a 60%, #020617 100%)",
        }}
      />
      {/* Light mode background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 block dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #bfdbfe 0%, #e0f2fe 40%, #f8fafc 100%)",
        }}
      />

      {/* Soft layered glow — sits behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 20%, rgba(59,130,246,0.35) 0%, transparent 70%)",
        }}
      />
      {/* Bottom fade to page background — dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 hidden dark:block"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(2,6,23,0.85))",
        }}
      />
      {/* Bottom fade to page background — light */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 block dark:hidden"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(240,249,255,0.85))",
        }}
      />


      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-5">
          {/* Country flag — left */}
          {flag ? (
            <div
              data-testid="country-flag"
              className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-white/20 shadow-xl"
            >
              <Image
                src={flag}
                alt={`${countryName} flag`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div
              data-testid="country-flag-placeholder"
              className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-white/20 bg-slate-700 text-xl font-bold shadow-xl"
              aria-label={`${countryCode.toUpperCase()} flag`}
            >
              {countryCode.toUpperCase().slice(0, 2)}
            </div>
          )}

          {/* Country name + subtitle — right */}
          <div className="flex flex-col gap-1">
            <h1
              data-testid="country-name"
              className="text-3xl font-bold tracking-tight sm:text-4xl"
            >
              {countryName}
            </h1>
            <p
              data-testid="official-results-label"
              className="text-sm font-medium text-blue-300"
            >
              {officialResults}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
