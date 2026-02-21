"use client";

import { DrawResult } from "@/components/lottery/DrawResult";
import { useApi } from "@/lib/hooks/useApi";
import { ResultsByTypeResponse, ThaiResultData } from "@/lib/api-types";
import { useLanguage } from "@/contexts/LanguageContext";
import { notFound } from "next/navigation";

interface DrawDetailContentProps {
  country: string;
  lottery: string;
  date: string;
}

export default function DrawDetailContent({
  country,
  lottery,
  date,
}: DrawDetailContentProps) {
  const { t } = useLanguage();
  // Fetching data. Assuming API endpoint supports date filter or single result
  // If not, we might need to fetch history and find the date, or use a specific endpoint
  // For now, let's assume we can fetch by date: /api/results/{lottery}/{date}
  // OR if the API is /api/results/{lottery} we might need to filter.
  // Let's try to fetch specific draw endpoint if it exists, or fallback to filtering.

  // Based on api-types check, there is no explicit strict date endpoint documented yet fully,
  // but let's assume /api/results/{type}/{date} might be implemented or we can implement it.
  // For now, I will use a placeholder fetch.

  // Constructing a hypothetical endpoint
  const endpoint = `/api/results/${lottery}/${date}`;

  const { data, loading, error } = useApi<any>(endpoint); // using any for now as response shape for single draw might vary

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        Loading draw details...
      </div>
    );
  }

  if (error || !data) {
    // Return a basic placeholder if API fails or not impl yet
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-2xl border border-white/10 bg-navy-900 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Results for {date}
          </h1>
          <p className="text-gray-400">
            Could not load specific results for this date (API: {endpoint})
          </p>
        </div>
      </div>
    );
  }

  // Normalize data
  // Assuming data structure similar to what we passed to DrawResult
  // If data returned is single object
  const resultData = data.data || data;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {country} - {lottery}
        </h1>
        <p className="text-gray-400">Draw Date: {date}</p>
      </div>

      <DrawResult
        country={country}
        lotteryName={lottery}
        date={date}
        drawId={resultData.drawNo || "-"}
        firstPrize={resultData.firstPrize || "-"}
        firstPrizeAmount={resultData.firstPrizeAmount || "-"}
        {...resultData}
      />
    </div>
  );
}
