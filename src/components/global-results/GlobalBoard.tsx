"use client";

import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useApi } from "@/lib/hooks/useApi";
import type { LotteriesListResponse, PinnedLottery } from "@/lib/api-types";
import { ResultBoardCard } from "./ResultBoardCard";
import { BoardPagination } from "./BoardPagination";
import { getPinnedLotteries, togglePinnedLottery as togglePinHelper, movePinnedLotteryToTop as movePinToTopHelper } from "@/lib/utils/cookies";

interface FlattenedLottery {
  id: number;
  name: string;
  logo: string | null;
  countryCode: string;
  countryName: string;
  region: string;
}

interface RegionData {
  id: string;
  name: string;
  countries: string[];
}


export function GlobalBoard() {
  const { } = useLanguage();
  
  const { data, loading, error } = useApi<LotteriesListResponse>("/api/lotteries");
  const [pinned, setPinned] = useState<PinnedLottery[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [regions, setRegions] = useState<RegionData[]>([]);

  // Load pinned state initially
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPinned(getPinnedLotteries());
    
    // Fetch active regions
    fetch("/api/regions")
      .then(res => res.json())
      .then(d => {
        if (d.regions) setRegions(d.regions);
      })
      .catch(err => console.error(err));
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
    const result: FlattenedLottery[] = [];
    if (!data?.countries) return result;
    
    for (const c of data.countries) {
      // Find region from fetched regions
      const foundRegion = regions.find(r => r.countries.includes(c.code.toLowerCase()));
      const region = foundRegion ? foundRegion.name : "Other";
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
  }, [data, regions]);

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

  const totalPages = Math.ceil(filteredLotteries.length / pageSize) || 1;

  const paginatedLotteries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLotteries.slice(start, start + pageSize);
  }, [filteredLotteries, currentPage, pageSize]);

  // Reset pagination on filter change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, selectedRegion, pageSize]);


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

      {/* Action Bar: Search & Page Size */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-[600px] mx-auto mb-4 gap-4">
        {/* Search */}
        <div className="relative w-full group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search lotteries or countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-white/5 border border-gold-400/50 hover:border-gold-500 rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 caret-gold-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400"
          />
        </div>

        {/* Page Size Selector */}
        <div className="shrink-0 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Show:</span>
          <select 
            value={pageSize} 
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none focus:border-gold-500"
          >
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Region Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["All", ...regions.map(r => r.name)].map(region => (
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
        {paginatedLotteries.map(lot => (
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

      {/* Pagination & Options */}
      {!loading && !error && filteredLotteries.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 py-4 border-border-gray-200 dark:border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Results per page:</span>
            <select 
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-gray-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 outline-none focus:border-amber-400 transition-colors cursor-pointer text-gray-900 dark:text-white"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
          </div>
          
          {totalPages > 1 && (
            <BoardPagination 
              page={currentPage}
              totalPages={totalPages}
              onPrev={() => setCurrentPage(p => Math.max(1, p - 1))}
              onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            />
          )}
        </div>
      )}

    </section>
  );
}
