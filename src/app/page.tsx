"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { ResultsTable } from "@/components/ui/ResultsTable";
import { BackgroundFlare } from "@/components/ui/BackgroundFlare";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import Image from "next/image";
import { getFlagUrl } from "@/lib/flags";
import { cn } from "@/lib/utils";

export default function Home() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"all" | "th" | "la">("all");

  const tabs = [
    { id: "all", label: t.selector.all, flag: null },
    { id: "th", label: t.selector.thai, flag: getFlagUrl("th") },
    { id: "la", label: t.selector.lao, flag: getFlagUrl("la") },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Background with Flare */}
      <div className="absolute inset-x-0 -top-40 z-0 h-[800px] w-full bg-nebula opacity-80 blur-3xl pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-blue-900/20 via-purple-900/10 to-transparent blur-[100px] z-0 pointer-events-none" />
      <BackgroundFlare />

      {/* Hero Section */}
      <HeroSection />

      {/* Results Section with Country Tabs */}
      <section className="container mx-auto px-4">
        {/* Country Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-navy-900/50 backdrop-blur-md rounded-full border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "all" | "th" | "la")}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
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
    </div>
  );
}
