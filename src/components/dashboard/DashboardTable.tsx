"use client";

import { Clock } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import { mapApiResultToRow, SingleLineRow } from "@/components/ui/ResultsTable";
import type { ResultRow } from "@/components/ui/ResultsTable";
import type { LatestResult } from "@/lib/api-types";

interface GlobalResultsResponse {
  draws: LatestResult[];
  total: number;
  page: number;
  totalPages: number;
}

export function DashboardTable() {
  const { t, language } = useLanguage();
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState<string>("all");
  const { data, loading, error } = useApi<GlobalResultsResponse>(
    `/api/results/global?page=${page}&limit=20${period !== "all" ? `&period=${period}` : ""}`,
  );

  const filters = [
    { label: "All Results", value: "all" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
  ];

  // Map API draws to ResultRow using the same mapper as ResultsTable
  const rows: ResultRow[] = [];
  if (data?.draws) {
    for (const draw of data.draws) {
      const row = mapApiResultToRow(draw, t, language);
      if (row) {
        rows.push(row);
      }
    }
  }

  // Group rows by date
  const groupedRows: Record<string, ResultRow[]> = {};
  for (const row of rows) {
    const dateKey = row.date;
    if (!groupedRows[dateKey]) groupedRows[dateKey] = [];
    groupedRows[dateKey].push(row);
  }

  return (
    <div className="bg-white dark:bg-navy-900 rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl">
      {/* Controls Header */}
      <div className="p-6 border-b border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 dark:bg-navy-800/50">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setPeriod(f.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === f.value ? "bg-gray-200 dark:bg-navy-600 text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-700"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {data
              ? `${data.total} results | Page ${data.page}/${data.totalPages}`
              : "Loading..."}
          </span>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3 animate-pulse"
            >
              <div className="h-5 w-7 bg-gray-200 dark:bg-navy-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-navy-700 rounded" />
              <div className="h-6 w-24 bg-gray-200 dark:bg-navy-700 rounded ml-auto" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-8 text-center text-red-400">
          Error loading results: {error}
        </div>
      )}

      {/* Table Body - using same row style as ResultsTable */}
      {!loading && !error && (
        <div className="divide-y divide-gray-100 dark:divide-white/5">
          {Object.entries(groupedRows).map(([dateKey, dateRows]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="px-6 py-2 bg-gray-50 dark:bg-navy-950/30 text-gray-500 text-xs font-bold uppercase">
                {dateKey}
              </div>
              <div className="flex flex-col gap-0 divide-y divide-gray-100 dark:divide-white/5">
                {dateRows.map((item, idx) => (
                  <SingleLineRow key={`${item.id}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          ))}

          {rows.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">
              No results found for this period.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
