"use client";

import { useState } from "react";
import { SearchIcon, Ticket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function TicketVerifier({ country }: { country: string }) {
  const [numbers, setNumbers] = useState("");
  const { t } = useLanguage();

  const handleCheck = () => {
    if (!numbers.trim()) return;
    alert(`Checking numbers for ${country}: ${numbers}`);
    // Implement actual checking logic or API call here
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-800/80 p-6 md:p-8 shadow-xl backdrop-blur-md group">
      {/* Background design elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/5 blur-[80px] transition-opacity group-hover:bg-gold-400/10"></div>
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"></div>

      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
        <Ticket className="w-32 h-32 text-gold-500" />
      </div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/20 text-gold-500 shadow-sm">
            <Ticket className="w-5 h-5" />
          </div>
          {t.common.verifyTicketTitle}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
          {t.common.verifyTicketDesc}
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t.common.enterYourNumbers}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                placeholder={`${t.common.inputPlaceholder}`}
                className="w-full rounded-xl border border-gray-300 dark:border-white/10 bg-gray-50/50 dark:bg-navy-900/50 py-4 pl-12 pr-4 font-mono text-lg tracking-widest text-gray-900 dark:text-white outline-none transition-all placeholder:font-sans placeholder:text-sm placeholder:tracking-normal focus:border-gold-500 focus:bg-white dark:focus:bg-navy-900 focus:ring-2 focus:ring-gold-500/20"
              />
              <Ticket className="absolute left-4 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">
              {t.common.separateTickets}
            </p>
          </div>

          <button
            onClick={handleCheck}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 px-8 py-4 font-bold text-white shadow-lg shadow-gold-500/25 transition-all hover:scale-[1.02] hover:shadow-gold-500/40 active:scale-95"
          >
            <SearchIcon className="h-5 w-5" />
            {t.common.checkBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
