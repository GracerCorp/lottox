"use client";

import { useState } from "react";
import { Search, Ticket } from "lucide-react";

export function TicketVerifier({ country }: { country: string }) {
  const [numbers, setNumbers] = useState("");

  const handleCheck = () => {
    alert(`Checking numbers for ${country}: ${numbers}`);
    // Implement actual checking logic or API call here
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Ticket className="w-24 h-24 text-gold-500" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Ticket className="w-5 h-5 text-gold-400" />
        Verify Your Ticket
      </h2>

      <div className="bg-gray-50 dark:bg-navy-900/50 p-4 rounded-xl border border-gray-200 dark:border-white/5">
        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
          Enter your numbers (separated by commas or spaces)
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
            placeholder="e.g. 12 34 56 78 90"
            className="flex-grow bg-white border border-gray-300 dark:border-transparent text-gray-900 dark:text-navy-900 font-mono text-lg px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 placeholder-gray-400 shadow-sm"
          />
          <button
            onClick={handleCheck}
            className="bg-gold-500 hover:bg-gold-400 text-white dark:text-navy-900 font-bold px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
          >
            <Search className="w-5 h-5" />
            Check Now
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Supports checking last 30 draws automatically.
        </p>
      </div>
    </div>
  );
}
