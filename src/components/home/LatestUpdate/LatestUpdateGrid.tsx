"use client";

import { useApi } from "@/lib/hooks/useApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { LatestUpdateCard } from "./LatestUpdateCard";
import { mapApiResultToRow, ResultRow } from "@/components/ui/ResultsTable";
import type { LatestResultsResponse } from "@/lib/api-types";

interface LatestUpdateGridProps {
  filter?: string;
}

const CONTINENT_MAPPINGS: Record<string, string[]> = {
  "southeast-asia": ["th", "la", "vn", "sg", "my", "id", "ph", "kh", "mm", "bn", "tl"],
  asia: ["jp", "tw", "hk", "kr", "th", "la", "vn", "sg", "my", "id", "ph", "in", "cn", "kh", "mm", "bn", "tl"],
  europe: ["gb", "fr", "de", "it", "es", "pt", "ru", "nl", "se", "pl", "uk", "ie", "ch", "no", "dk", "fi"],
  america: ["us", "ca", "br", "ar", "mx", "cl", "co", "pe"],
  oceania: ["au", "nz", "fj"],
};

export function LatestUpdateGrid({ filter = "trending" }: LatestUpdateGridProps) {
  const { t, language } = useLanguage();
  const { data, loading, error } = useApi<LatestResultsResponse>("/api/results/latest");

  const rawResults: ResultRow[] = [];
  if (data?.results) {
    for (const result of data.results) {
      const row = mapApiResultToRow(result, t, language);
      if (row) {
        rawResults.push(row);
      }
    }
  }

  const results =
    filter === "trending" || filter === "all"
      ? rawResults
      : CONTINENT_MAPPINGS[filter]
      ? rawResults.filter((r) => CONTINENT_MAPPINGS[filter].includes(r.countryId))
      : rawResults.filter((r) => r.countryId === filter);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-[#171717] border border-white/5 h-[180px]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-400">
        {t.common?.error || "An error occurred"}: {error}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#171717] p-8 text-center text-sm text-gray-400">
        No results found for this region.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((item) => (
        <LatestUpdateCard
          key={item.href}
          id={item.id}
          name={item.name}
          country={item.country}
          flag={item.flag}
          date={item.date}
          time={item.time}
          href={item.href}
          numbers={item.numbers}
        />
      ))}
    </div>
  );
}
