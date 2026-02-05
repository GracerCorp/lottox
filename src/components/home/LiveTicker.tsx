"use client";

import { motion } from "framer-motion";

const RECENT_RESULTS = [
  { name: "USA Powerball", numbers: "12 34 45 55 58 (20)" },
  { name: "EuroMillions", numbers: "02 10 26 32 45 (05)" },
  { name: "Thai Lotto", numbers: "43558" },
  { name: "Mega Millions", numbers: "05 13 24 31 58 (17)" },
  { name: "Japan Lotto 6", numbers: "01 05 06 13 23 29" },
];

export function LiveTicker() {
  return (
    <div className="w-full bg-navy-950/50 border-y border-white/5 py-3 overflow-hidden flex items-center">
      <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mx-4 whitespace-nowrap animate-pulse">
        ● Live Results
      </div>

      <div className="flex overflow-hidden relative w-full">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 30,
            ease: "linear",
          }}
        >
          {[...RECENT_RESULTS, ...RECENT_RESULTS, ...RECENT_RESULTS].map(
            (result, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <span className="font-semibold text-white">{result.name}:</span>
                <span className="font-mono text-gold-400 tracking-wider">
                  {result.numbers}
                </span>
              </div>
            ),
          )}
        </motion.div>
      </div>
    </div>
  );
}
