"use client";

import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Skip-to-content link for keyboard/screen-reader users.
 * Invisible until focused via Tab key, then appears at the top-left.
 */
export function SkipToContent() {
  const { t } = useLanguage();

  return (
    <a
      href="#main"
      className="
        sr-only focus:not-sr-only
        focus:fixed focus:top-2 focus:left-2 focus:z-[100]
        focus:px-4 focus:py-2 focus:rounded-lg
        focus:bg-amber-400 focus:text-neutral-950
        focus:font-bold focus:text-sm
        focus:shadow-lg focus:outline-none
        focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
        transition-all
      "
      data-testid="skip-to-content"
    >
      {t.common?.skipToContent ?? "Skip to content"}
    </a>
  );
}
