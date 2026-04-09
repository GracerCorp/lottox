"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Flag, Ticket, Coins, ShieldCheck } from "lucide-react";

export function GlobalStatsBanner({
  countriesCount,
  lotteriesCount
}: {
  countriesCount?: number;
  lotteriesCount?: number;
}) {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Flag,
      value: countriesCount ? countriesCount.toString() : "19",
      label: t.globalStats?.countries || "Countries",
    },
    {
      icon: Ticket,
      value: lotteriesCount ? lotteriesCount.toString() : "34",
      label: t.globalStats?.lotteries || "Lotteries",
    },
    {
      icon: Coins,
      value: "$700M+",
      label: t.globalStats?.maxPrize || "Max Prize Pool",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: t.globalStats?.verified || "Verified Source",
    }
  ];

  return (
    <section 
      className="relative w-full py-20 my-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/cosmic-bg.png')" }}
    >
      {/* Dark overlay to ensure it matches the mood of the image */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Dots/Constellation Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-center bg-no-repeat opacity-60 mix-blend-screen"
        style={{ backgroundImage: "url('/images/stats-dots-overlay.png')", backgroundSize: "cover" }}
      />

      <div className="container relative z-10 mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Hand Text - Right Aligned on Desktop */}
          <div className="text-center lg:text-right flex flex-col justify-center lg:pr-8">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight mb-4 text-[#D8B05F]">
              {t.globalStats?.worldStats || "World Stats"}
            </h2>
            <p className="text-[#a0a0a0] text-sm md:text-base max-w-md mx-auto lg:mx-0 lg:ml-auto">
              {t.globalStats?.subtitle || "Experience the most comprehensive and verified lottery results from across the globe, updated in real-time."}
            </p>
          </div>

          {/* Right Hand Stats Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between p-5 lg:p-6 bg-[#212121]/90 border border-[#3b3b3b] rounded-[1.25rem] shadow-xl"
              >
                <div className="mb-4">
                  <stat.icon className="w-6 h-6 text-[#D8B05F]" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-3xl lg:text-4xl font-bold text-[#D8B05F] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[#888888] text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
