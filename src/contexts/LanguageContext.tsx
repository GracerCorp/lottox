"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getDictionary, defaultDict, Dictionary, Language } from "@/lib/i18n";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with "en" for consistent SSR — sync from localStorage after mount
  const [language, setLanguageState] = useState<Language>("en");
  const [dict, setDict] = useState<Dictionary>(defaultDict); // Default is sync

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "th" || saved === "en")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(saved);
      if (saved !== "en") {
        getDictionary(saved).then(setDict).catch(console.error);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    if (lang === "en") {
      setDict(defaultDict);
    } else {
      getDictionary(lang).then(setDict).catch(console.error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "th" ? "en" : "th");
  };

  const value = {
    language,
    toggleLanguage,
    setLanguage,
    t: dict,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Safe default for SSR — components render with English defaults when
// context is unavailable (e.g. during server pre-render or tests).
const SSR_DEFAULTS: LanguageContextType = {
  language: "en",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: defaultDict,
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context ?? SSR_DEFAULTS;
}
