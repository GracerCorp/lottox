"use client";

import { useState } from "react";
import Image from "next/image";
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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>("all");

  const localizedTabs = tabs.map((tab) => {
    let localizedLabel = tab.label;
    if (tab.id === "all") localizedLabel = t.selector.all;
    else if (tab.id === "th") localizedLabel = t.selector.thai;
    else if (tab.id === "la") localizedLabel = t.selector.lao;
    else if (tab.id === "vn") localizedLabel = t.selector.vietnam;
    else if (tab.id === "jp") localizedLabel = t.selector.jp;
    else if (tab.id === "au") localizedLabel = t.selector.au;
    else if (tab.id === "sg") localizedLabel = t.selector.sg;
    else if (tab.id === "my") localizedLabel = t.selector.my;
    else if (tab.id === "id") localizedLabel = t.selector.id;
    else if (tab.id === "ph") localizedLabel = t.selector.ph;
    else if (tab.id === "tw") localizedLabel = t.selector.tw;
    else if (tab.id === "hk") localizedLabel = t.selector.hk;
    else if (tab.id === "sg") localizedLabel = t.selector.sg;
    else if (tab.id === "br") localizedLabel = t.selector.br;
    // For future countries, maybe they have translations inside t.selector or fallback to DB Name
    // Ideally, DB provides the proper translated name, or we store translations in keys.

    return { ...tab, label: localizedLabel };
  });

  return (
    <section className="container mx-auto px-4">
      {/* Country Tabs */}
      <div className="flex w-full overflow-x-auto hide-scrollbar mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
        <div className="flex shrink-0 p-1 bg-white/60 dark:bg-navy-900/50 backdrop-blur-md rounded-full border border-gray-200/60 dark:border-white/10 shadow-sm dark:shadow-none w-max">
          {localizedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md dark:shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5",
              )}
            >
              {tab.flag && (
                <div className="relative h-4 w-6 overflow-hidden rounded shadow-sm">
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
    </section>
  );
}
