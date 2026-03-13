import type th from "./dictionaries/th";

export type Language = "th" | "en";
export type Dictionary = typeof th;

const dictionaries = {
  th: () => import('./dictionaries/th').then((module) => module.default),
  en: () => import('./dictionaries/en').then((module) => module.default),
};

export const getDictionary = async (locale: Language) => {
  if (!dictionaries[locale]) {
    console.warn(`Dictionary not found for ${locale}, falling back to th`);
    return dictionaries.th();
  }
  return dictionaries[locale]();
};

// For backward compatibility during migration, we can load a default dictionary synchronously
// but this defeats lazy loading for initial renders if used globally.
import defaultDictionary from "./dictionaries/th";
export const defaultDict = defaultDictionary;
