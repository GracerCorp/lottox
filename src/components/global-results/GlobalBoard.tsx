"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { LotteriesListResponse, PinnedLottery } from "@/lib/api-types";
import { ResultBoardCard } from "./ResultBoardCard";
import { getRegionForCountry, GLOBAL_REGIONS } from "@/lib/constants/regions";
import { getPinnedLotteries, togglePinnedLottery as togglePinHelper, movePinnedLotteryToTop as movePinToTopHelper } from "@/lib/utils/cookies";
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

  const moveToTop = (lotteryId: number) => {
    const next = movePinToTopHelper(lotteryId);
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
    const filtered = allLotteries.filter(l => {
      const isPinned = pinned.some(p => p.lotteryId === l.id);
      if (isPinned) return true;

      const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.countryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRegion = selectedRegion === "All" || l.region === selectedRegion;
      return matchSearch && matchRegion;
    });

    // Sort to ensure pinned items are at the top, ordered exactly as they appear in the pinned list
    return filtered.sort((a, b) => {
      const indexA = pinned.findIndex(p => p.lotteryId === a.id);
      const indexB = pinned.findIndex(p => p.lotteryId === b.id);
      const isPinnedA = indexA !== -1;
      const isPinnedB = indexB !== -1;

      if (isPinnedA && isPinnedB) {
        return indexA - indexB;
      }
      if (isPinnedA) return -1;
      if (isPinnedB) return 1;

      // The rest remains in the initial A-Z order from allLotteries
      return 0;
    });
  }, [allLotteries, searchQuery, selectedRegion, pinned]);

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
      <div className="flex flex-col items-center justify-center text-center mb-6 gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Global Board
          </h2>
          <p className="text-gray-500 text-sm mt-1">Find your lottery results and track them your way.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-[466px] mx-auto mb-4">
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
      <div className="flex flex-wrap justify-center gap-2 mb-8">
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
         <div className="flex flex-col items-center justify-center py-20">
          <div className="relative w-40 h-40 mb-2">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Background pills */}
              <rect x="30" y="30" width="60" height="12" rx="6" fill="currentColor" className="text-gray-200 dark:text-neutral-800" />
              <rect x="20" y="50" width="80" height="12" rx="6" fill="currentColor" className="text-gray-200 dark:text-neutral-800" />
              <rect x="25" y="70" width="70" height="12" rx="6" fill="currentColor" className="text-gray-200 dark:text-neutral-800" />
              
              {/* Document */}
              <rect x="42" y="20" width="36" height="52" rx="3" fill="white" className="dark:fill-neutral-900" stroke="#a3a3a3" strokeWidth="2" />
              <line x1="48" y1="28" x2="60" y2="28" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="36" x2="72" y2="36" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="44" x2="68" y2="44" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="52" x2="72" y2="52" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="60" x2="62" y2="60" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" />
              
              {/* Magnifier Glass */}
              <g transform="translate(10, 8)">
                <circle cx="55" cy="50" r="16" fill="#f5f5f5" className="dark:fill-neutral-800" stroke="#a3a3a3" strokeWidth="4" />
                {/* X Mark inside magnifier */}
                <path d="M49 44L61 56M61 44L49 56" stroke="#a3a3a3" strokeWidth="3" strokeLinecap="round" />
                {/* Handle */}
                <line x1="66" y1="61" x2="78" y2="73" stroke="#a3a3a3" strokeWidth="6" strokeLinecap="round" />
              </g>
              
              {/* Decor crosses and circles */}
              <circle cx="32" cy="45" r="2" fill="#a3a3a3" />
              <circle cx="88" cy="38" r="2" fill="#a3a3a3" />
              <path d="M28 60L31 63M31 60L28 63" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M85 58L88 61M88 58L85 61" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-gray-400 dark:text-gray-500 text-[15px] font-medium tracking-wide">
            No Lottery or Country found.
          </p>
        </div>
      )}

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleLotteries.map(lot => (
          <ResultBoardCard 
            key={lot.id}
            lotteryName={lot.name}
            countryCode={lot.countryCode}
            logo={lot.logo}
            pinned={isPinned(lot.id)}
            onTogglePin={() => togglePin(lot)}
            onMoveToTop={() => moveToTop(lot.id)}
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
