"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { LotteriesListResponse, PinnedLottery } from "@/lib/api-types";
import { ResultBoardCard } from "./ResultBoardCard";
import { getRegionForCountry, GLOBAL_REGIONS } from "@/lib/constants/regions";
import { getPinnedLotteries, togglePinnedLottery as togglePinHelper } from "@/lib/utils/cookies";
import { useIntersection } from "react-use";

interface FlattenedLottery {
  id: number;
  name: string;
  logo: string | null;
  countryCode: string;
  countryName: string;
  region: string;
}

const PAGE_SIZE = 12;

export function GlobalBoard() {
  const { t } = useLanguage();
  
  const { data, loading, error } = useApi<LotteriesListResponse>("/api/lotteries");
  const [pinned, setPinned] = useState<PinnedLottery[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Load pinned state initially
  useEffect(() => {
    setPinned(getPinnedLotteries());
  }, []);

  const togglePin = (l: FlattenedLottery) => {
    const next = togglePinHelper({
      lotteryId: l.id,
      lotteryName: l.name,
      logo: l.logo,
      countryCode: l.countryCode
    });
    setPinned(next);
  };

  // Flatten the grouped structure
  const allLotteries = useMemo(() => {
    let result: FlattenedLottery[] = [];
    if (!data?.countries) return result;
    
    for (const c of data.countries) {
      const region = getRegionForCountry(c.code);
      for (const lot of c.lotteries) {
        result.push({
          id: lot.id,
          name: lot.name,
          logo: lot.logo,
          countryCode: c.code.toLowerCase(),
          countryName: c.name,
          region
        });
      }
    }
    
    // Sort A-Z by default as requested
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [data]);

  // Apply Search and Region Filters
  const filteredLotteries = useMemo(() => {
    return allLotteries.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.countryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = selectedRegion === "All" || l.region === selectedRegion;
      return matchSearch && matchRegion;
    });
  }, [allLotteries, searchQuery, selectedRegion]);

  const visibleLotteries = useMemo(() => {
    return filteredLotteries.slice(0, visibleCount);
  }, [filteredLotteries, visibleCount]);

  // Intersection Observer for Infinite Scroll
  const intersectionRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  });

  useEffect(() => {
    if (intersection && intersection.isIntersecting) {
      if (visibleCount < filteredLotteries.length) {
        setVisibleCount(v => v + PAGE_SIZE);
      }
    }
  }, [intersection, filteredLotteries.length, visibleCount]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedRegion]);


  const isPinned = (id: number) => pinned.some(p => p.lotteryId === id);

  return (
    <section className="mt-12" data-testid="global-board">
      <div className="flex flex-col mb-6 gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Global Board
          </h2>
          <p className="text-gray-500 text-sm mt-1">Explore all international lottery results.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full mb-4">
        <input 
          type="text" 
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-neutral-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-amber-400 dark:focus:border-amber-400 transition-colors text-black dark:text-white placeholder:text-gray-400"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Region Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {GLOBAL_REGIONS.map(region => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors",
              selectedRegion === region
                ? "bg-amber-400 text-neutral-950 border-amber-400"
                : "bg-transparent text-gray-500 dark:text-gray-400 border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 hover:text-gray-900 dark:hover:text-white",
            ].join(" ")}
          >
            {region}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-100 dark:bg-neutral-800 rounded-2xl h-64" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-10 text-red-500 bg-red-500/10 rounded-2xl p-4">
          Error loading lotteries. Please try again later.
        </div>
      )}

      {!loading && !error && filteredLotteries.length === 0 && (
         <div className="text-center py-20 text-gray-500">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-lg">No lotteries found.</p>
        </div>
      )}

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleLotteries.map(lot => (
          <ResultBoardCard 
            key={lot.id}
            lotteryName={lot.name}
            countryCode={lot.countryCode}
            pinned={isPinned(lot.id)}
            onTogglePin={() => togglePin(lot)}
          />
        ))}
      </div>

      {/* Infinite Scroll Sentinel */}
      {visibleCount < filteredLotteries.length && (
         <div ref={intersectionRef} className="py-10 flex justify-center mt-6">
            <div className="inline-block w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
         </div>
      )}

    </section>
  );
}
