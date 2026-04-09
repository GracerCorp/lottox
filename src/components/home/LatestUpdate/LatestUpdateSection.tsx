"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LatestUpdateFilter } from "./LatestUpdateFilter";
import { LatestUpdateGrid } from "./LatestUpdateGrid";

export function LatestUpdateSection() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("trending");

  return (
    <section id="latest-results" className="container mx-auto px-4 py-16 fade-in-up">
      {/* Header Container */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 mb-10 w-full max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(t as any).common?.latestUpdate || "Latest Update"}
        </h2>
        <p className="text-gray-400 text-sm md:text-base">
          Browse available lotteries by country and explore their latest results.
        </p>
      </div>

      {/* Region / Category Filter */}
      <div className="mb-10">
        <LatestUpdateFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Grid Results */}
      <LatestUpdateGrid filter={activeFilter} />
    </section>
  );
}
