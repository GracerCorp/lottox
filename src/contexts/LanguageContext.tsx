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
  // Always start with "th" for consistent SSR — sync from localStorage after mount
  const [language, setLanguageState] = useState<Language>("th");
  const [dict, setDict] = useState<Dictionary>(defaultDict); // Default is sync

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "th" || saved === "en")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(saved);
      if (saved !== "th") {
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
    
    if (lang === "th") {
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

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
