"use client";

import { motion } from "framer-motion";

export function BackgroundFlare() {
  return (
    <div className="absolute inset-x-0 top-0 h-[1000px] w-full z-0 pointer-events-none overflow-hidden">
      {/* 1. Left Spotlight Beam - Sweeping Right */}
      <motion.div
        animate={{
          x: ["-20%", "40%", "-20%"],
          rotate: [15, 45, 15],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-20%] left-0 w-[600px] h-[1200px] bg-gradient-to-b from-gold-400/20 via-gold-300/5 dark:from-gold-500/30 dark:via-gold-400/10 to-transparent blur-[80px]"
        style={{ transformOrigin: "top center" }}
      />

      {/* 2. Right Spotlight Beam - Sweeping Left */}
      <motion.div
        animate={{
          x: ["20%", "-40%", "20%"],
          rotate: [-15, -45, -15],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1, // Slight offset
        }}
        className="absolute top-[-20%] right-0 w-[600px] h-[1200px] bg-gradient-to-b from-amber-400/20 via-orange-400/5 dark:from-amber-500/30 dark:via-amber-400/10 to-transparent blur-[80px]"
        style={{ transformOrigin: "top center" }}
      />

      {/* 3. Wide Moving Aurora (Base) - Horizontal Shift */}
      <motion.div
        animate={{
          x: ["-10%", "10%", "-10%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-[-10%] w-[120%] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-600/10 dark:from-gold-700/30 via-transparent to-transparent blur-[100px]"
      />
    </div>
  );
}
