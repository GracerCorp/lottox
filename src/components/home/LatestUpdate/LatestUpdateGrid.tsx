"use client";

import { useApi } from "@/lib/hooks/useApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { LatestUpdateCard } from "./LatestUpdateCard";
import { mapApiResultToRow, ResultRow } from "@/components/ui/ResultsTable";
import type { LatestResultsResponse } from "@/lib/api-types";

import type { RegionData } from "./LatestUpdateSection";

interface LatestUpdateGridProps {
  filter?: string;
  regions?: RegionData[];
  userCountry?: string;
}

export function LatestUpdateGrid({ filter = "trending", regions, userCountry }: LatestUpdateGridProps) {
  const { t, language } = useLanguage();
  let url = "/api/results/latest";
  
  if (filter !== "trending" && filter !== "all") {
    const region = regions?.find((r) => r.id === filter);
    if (region && region.countries.length > 0) {
      url = `/api/results/latest?countries=${region.countries.join(",")}`;
    } else if (!region) {
      // In case the filter is just directly a country code instead of a region
      url = `/api/results/latest?countries=${filter}`;
    }
  }

  // Append priorityCountry so the API sorts this country's lotteries first
  if (userCountry) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}priorityCountry=${userCountry.toLowerCase()}`;
  }

  const { data, loading, error } = useApi<LatestResultsResponse>(url);

  const rawResults: ResultRow[] = [];
  if (data?.results) {
    for (const result of data.results) {
      const row = mapApiResultToRow(result, t, language);
      if (row) {
        rawResults.push(row);
      }
    }
  }

  const results = rawResults.filter((item) => 
    item.numbers && item.numbers.some((prize) => 
      prize.value && prize.value.some((v) => v && v.trim() !== "-" && v.trim() !== "")
    )
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl bg-gray-100 dark:bg-[#171717] border border-gray-200 dark:border-white/5 h-[180px]"
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
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#171717] p-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No results found for this region.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((item) => (
        <LatestUpdateCard
          key={item.id}
          id={item.id}
          name={item.name}
          country={item.country}
          flag={item.flag}
          logo={item.logo}
          date={item.date}
          time={item.time}
          href={item.href}
          numbers={item.numbers}
        />
      ))}
    </div>
  );
}
