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
    <footer className="relative w-full overflow-hidden border-t border-white/5 bg-navy-950 pb-6 pt-10">
      {/* Background noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Why LOTTOX Section */}
        <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-white/5 bg-navy-900/50 p-8 backdrop-blur-sm md:flex-row">
          <div>
            <h3 className="text-2xl font-bold text-gray-200">
              {t.footer.whyTitle}
            </h3>
          </div>

          <div className="flex items-center gap-4 w-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="max-w-md text-lg text-gray-400">
              <span className="font-bold text-gold-400">
                {t.footer.whyDesc1}
              </span>{" "}
              {t.footer.whyDesc2}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Navigation */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-white transition-colors"
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
