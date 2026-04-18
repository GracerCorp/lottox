"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserLocation } from "@/contexts/UserLocationContext";
import { LatestUpdateFilter } from "./LatestUpdateFilter";
import { LatestUpdateGrid } from "./LatestUpdateGrid";

export interface RegionData {
  id: string;
  name: string;
  countries: string[];
}

export function LatestUpdateSection() {
  const { t } = useLanguage();
  const { countryCode, isLoading: locationLoading } = useUserLocation();
  const [activeFilter, setActiveFilter] = useState("trending");
  const [regions, setRegions] = useState<RegionData[]>([]);
  const hasAutoSelected = useRef(false);

  // Sync initial tab from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveFilter(tab);
        hasAutoSelected.current = true; // URL tab takes precedence
      }
    }
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", filter);
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    fetch("/api/regions")
      .then((res) => res.json())
      .then((data) => {
        if (data.regions) {
          setRegions(data.regions);
        }
      })
      .catch((err) => console.error("Failed to load regions:", err));
  }, []);

  // Auto-select the region tab that contains the user's country
  useEffect(() => {
    if (hasAutoSelected.current || locationLoading || !countryCode || regions.length === 0) {
      return;
    }
    const matchedRegion = regions.find((r) =>
      r.countries.includes(countryCode.toLowerCase()),
    );
    if (matchedRegion) {
      setActiveFilter(matchedRegion.id);
      hasAutoSelected.current = true;
    }
  }, [countryCode, locationLoading, regions]);

  return (
    <section id="latest-results" className="container mx-auto px-4 py-16 fade-in-up">
      {/* Header Container */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 mb-10 w-full max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(t as any).common?.latestUpdate || "Latest Update"}
        </h2>
        <p className="text-neutral-600 dark:text-gray-400 text-sm md:text-base">
          Browse available lotteries by country and explore their latest results.
        </p>
      </div>

      {/* Region / Category Filter */}
      <div className="mb-10">
        <LatestUpdateFilter activeFilter={activeFilter} onFilterChange={handleFilterChange} regions={regions} />
      </div>

      {/* Grid Results */}
      <LatestUpdateGrid filter={activeFilter} regions={regions} userCountry={countryCode} />
    </section>
  );
}

