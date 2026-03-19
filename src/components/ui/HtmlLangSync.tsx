"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Syncs the <html lang> attribute with the current language from context.
 * Renders nothing — purely a side-effect component.
 */
export function HtmlLangSync() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
