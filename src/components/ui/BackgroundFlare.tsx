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
        className="absolute top-[-20%] left-0 w-[600px] h-[1200px] bg-gradient-to-b from-blue-500/30 via-cyan-400/10 to-transparent blur-[80px]"
        style={{ transformOrigin: "top center", mixBlendMode: "screen" }}
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
        className="absolute top-[-20%] right-0 w-[600px] h-[1200px] bg-gradient-to-b from-indigo-500/30 via-violet-400/10 to-transparent blur-[80px]"
        style={{ transformOrigin: "top center", mixBlendMode: "screen" }}
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
        className="absolute top-0 left-[-10%] w-[120%] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent blur-[100px]"
      />
    </div>
  );
}
