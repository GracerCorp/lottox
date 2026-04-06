"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { ResultsTable } from "@/components/ui/ResultsTable";

interface TabItem {
  id: string;
  label: string;
  flag: string | null;
}

interface HomeResultsSectionProps {
  tabs: TabItem[];
}

export function HomeResultsSection({ tabs }: HomeResultsSectionProps) {
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
      <HomeResultsContent tabs={tabs} />
    </Suspense>
  );
}

function HomeResultsContent({ tabs }: HomeResultsSectionProps) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam === 'trending') setActiveTab('all');
      else setActiveTab(tabParam);
      
      // Delay scrolling slightly to let the page render properly
      setTimeout(() => {
        if (window.location.hash === '#latest-results') {
          const el = document.getElementById('latest-results');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [searchParams]);

  const localizedTabs = tabs.map((tab) => {
    let localizedLabel = tab.label;
    if (tab.id === "all") localizedLabel = t.selector.all || "Global";
    else if (tab.id === "th") localizedLabel = t.selector.thai || "Thailand";
    else if (tab.id === "la") localizedLabel = t.selector.lao || "Lao";
    else if (tab.id === "vn") localizedLabel = t.selector.vietnam || "Vietnam";
    else if (tab.id === "jp") localizedLabel = t.selector.jp || "Japan";
    else if (tab.id === "au") localizedLabel = t.selector.au || "Australia";
    else if (tab.id === "sg") localizedLabel = t.selector.sg || "Singapore";
    else if (tab.id === "my") localizedLabel = t.selector.my || "Malaysia";
    else if (tab.id === "id") localizedLabel = t.selector.id || "Indonesia";
    else if (tab.id === "ph") localizedLabel = t.selector.ph || "Philippines";
    else if (tab.id === "tw") localizedLabel = t.selector.tw || "Taiwan";
    else if (tab.id === "hk") localizedLabel = t.selector.hk || "Hong Kong";
    else if (tab.id === "br") localizedLabel = t.selector.br || "Brazil";
    return { ...tab, label: localizedLabel };
  });

  const continentTabs = ['southeast-asia', 'asia', 'europe', 'america', 'oceania'];
  if (continentTabs.includes(activeTab)) {
    if (!localizedTabs.find(t => t.id === activeTab)) {
      const activeContinentObj = {
        id: activeTab,
        label: activeTab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        flag: null
      };
      
      // Insert after 'all' tab if present, else at beginning
      const allIndex = localizedTabs.findIndex(t => t.id === 'all');
      if (allIndex !== -1) {
        localizedTabs.splice(allIndex + 1, 0, activeContinentObj);
      } else {
        localizedTabs.unshift(activeContinentObj);
      }
    }
  }

  return (
    <section id="latest-results" className="container mx-auto px-4 py-10 fade-in-up">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t.common.latestUpdate}
      </h2>

      {/* Country Tabs */}
      <div className="flex w-full overflow-x-auto hide-scrollbar mb-6 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex shrink-0 gap-2 w-max">
          {localizedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border",
                activeTab === tab.id
                  ? "bg-gold-500 text-neutral-950 border-gold-500/60 shadow-md shadow-gold-500/20 font-bold"
                  : "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 bg-white/60 dark:bg-neutral-900/40 hover:bg-gray-100 dark:hover:bg-neutral-800/60 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20",
              )}
            >
              {tab.flag && (
                <div className="relative h-3.5 w-5 overflow-hidden rounded shadow-sm">
                  <Image
                    src={tab.flag}
                    alt={`${tab.label} flag`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <ResultsTable filter={activeTab} />

      {/* All Global Results CTA */}
      <div className="flex justify-center mt-8">
        <Link
          href="/global-draws"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold-500/60 text-gold-400 text-sm font-semibold transition-all duration-200 hover:bg-gold-500 hover:text-neutral-950 hover:shadow-md hover:shadow-gold-500/20"
        >
          {t.common.allGlobalResults || "All Global Results"}
        </Link>
      </div>
    </section>
  );
}
