"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const links = [
    { title: t.footer.worldDashboard, href: "/global-draws" },
    { title: t.footer.statistics, href: "/statistics" },
    { title: t.footer.about, href: "/about" },
    { title: t.footer.faq, href: "/faq" },
    { title: t.footer.contact, href: "/contact" },
    { title: t.footer.disclaimer, href: "/disclaimer" },
    { title: t.footer.terms, href: "/terms" },
    { title: t.footer.privacy, href: "/privacy" },
    { title: t.footer.api, href: "/api-docs" },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-navy-950 pb-6 pt-10">
      {/* Background noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Why LOTTOX Section - Compact Version */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-navy-900/50 px-6 py-4 backdrop-blur-sm md:flex-row shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 text-gold-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-200 whitespace-nowrap">
              {t.footer.whyTitle}
            </h3>
          </div>

          <div className="text-sm text-gray-400 md:text-right">
            <span className="font-bold text-gold-400">{t.footer.whyDesc1}</span>{" "}
            {t.footer.whyDesc2}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

        {/* Bottom Navigation */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-navy-900 dark:hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <button className="rounded-full border border-gold-500/30 bg-gold-500/10 px-6 py-2 text-xs font-bold text-gold-400 hover:bg-gold-500/20 hover:text-gold-300 transition-colors shadow-lg shadow-gold-900/20">
            {t.footer.apiAccess}
          </button>
        </div>
      </div>
    </footer>
  );
}
