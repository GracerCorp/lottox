"use client";

import { Clock } from "lucide-react";
import { useApi } from "@/lib/hooks/useApi";
import type { GlobalResultsResponse, GlobalDraw } from "@/lib/api-types";
import { useState } from "react";

export function DashboardTable() {
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

  const draws = data?.draws ?? [];

  // Group draws by date
  const groupedDraws: Record<string, GlobalDraw[]> = {};
  for (const draw of draws) {
    const dateKey = new Date(draw.drawDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!groupedDraws[dateKey]) groupedDraws[dateKey] = [];
    groupedDraws[dateKey].push(draw);
  }

  return (
    <div className="bg-navy-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Controls Header */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-navy-800/50">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setPeriod(f.value);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${period === f.value ? "bg-navy-600 text-white" : "text-gray-400 hover:text-white hover:bg-navy-700"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {data
              ? `${data.total} results | Page ${data.page}/${data.totalPages}`
              : "Loading..."}
          </span>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-navy-950/80 text-gray-500 text-xs uppercase font-medium tracking-wider">
        <div className="col-span-2">Time</div>
        <div className="col-span-4">Lottery</div>
        <div className="col-span-4">Winning Numbers</div>
        <div className="col-span-2 text-right">Jackpot</div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse"
            >
              <div className="col-span-2 h-4 bg-navy-700 rounded" />
              <div className="col-span-4 h-4 bg-navy-700 rounded" />
              <div className="col-span-4 h-4 bg-navy-700 rounded" />
              <div className="col-span-2 h-4 bg-navy-700 rounded" />
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

      {/* Table Body */}
      {!loading && !error && (
        <div className="divide-y divide-white/5">
          {Object.entries(groupedDraws).map(([dateKey, dateDraws]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="px-6 py-2 bg-navy-950/30 text-gray-500 text-xs font-bold uppercase">
                {dateKey}
              </div>
              {dateDraws.map((draw, idx) => (
                <div
                  key={`${draw.id}-${idx}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors group"
                >
                  <div className="col-span-2 text-gold-400 font-mono text-sm">
                    {draw.time || "--:--"}
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <span className="text-xs bg-navy-700 text-gray-300 px-1.5 py-0.5 rounded uppercase">
                      {draw.countryCode || draw.country?.slice(0, 3)}
                    </span>
                    <span className="text-white font-medium group-hover:text-gold-400 transition-colors">
                      {draw.name}
                    </span>
                  </div>
                  <div className="col-span-4 flex items-center gap-2">
                    <span className="text-white font-mono tracking-wide">
                      {draw.numbers?.join(" ") || "-"}
                    </span>
                    {draw.special && (
                      <span className="bg-gold-500 text-navy-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {draw.special}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2 text-right text-white font-bold">
                    {draw.jackpot || "-"}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {draws.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">
              No results found for this period.
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-400">
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page >= data.totalPages}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
