"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay to not show exactly on load
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pb-6 md:pb-8 pointer-events-none"
        >
          <div className="mx-auto max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
            <div className="flex items-start sm:items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-full flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งานของคุณ การใช้งานเว็บไซต์นี้ต่อไปถือว่าคุณยอมรับ{" "}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                  {" "}ของเรา
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
              <button
                onClick={acceptCookies}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-white bg-gold-500 hover:bg-gold-600 dark:bg-gold-500 dark:hover:bg-gold-600 rounded-xl transition-colors whitespace-nowrap"
              >
                ยอมรับ
              </button>
              <button
                onClick={() => setShowConsent(false)}
                className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="ปิด"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
