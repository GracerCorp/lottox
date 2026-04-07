"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { LatestDrawCard } from "./LatestDrawCard";
import { UpcomingLotterySidebar } from "./UpcomingLotterySidebar";

export function GlobalResultsSection() {
  const { t } = useLanguage();
  const gd = t.staticParams.globalDraws;

  return (
    <section data-testid="global-results-section">
      {/* Section title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          {gd.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto">
          {gd.subtitle}
        </p>
      </div>

      {/* Two-column layout: Latest Draw (left 2/3) + Upcoming Sidebar (right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LatestDrawCard />
        </div>
        <div className="lg:col-span-1">
          <UpcomingLotterySidebar />
        </div>
      </div>
    </section>
  );
}
