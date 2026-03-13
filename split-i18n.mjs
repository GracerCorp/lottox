import fs from 'fs';

const content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Find where "th: {" starts
const thStart = content.indexOf('  th: {');
// Find where "en: {" starts, which is after th object ends
const enStart = content.indexOf('  en: {');

// The end of `th` is right before `en: {` (ignoring whitespace/comma)
const thContent = content.substring(thStart + 6, enStart - 3).trim();

// The end of `en` is right before `} as const;` or `};` block ends
const enEnd = content.lastIndexOf('    },');
const enContentRaw = content.substring(enStart + 6);
const justEnContent = enContentRaw.substring(0, enContentRaw.lastIndexOf('    }') + 6);

const thFile = `export default ${thContent};`;
const enFile = `export default ${justEnContent};`;

fs.writeFileSync('src/lib/dictionaries/th.ts', thFile);
fs.writeFileSync('src/lib/dictionaries/en.ts', enFile);

// rewrite i18n
const newI18n = `import type th from "./dictionaries/th";

export type Language = "th" | "en";
export type Dictionary = typeof th;

const dictionaries = {
  th: () => import('./dictionaries/th').then((module) => module.default),
  en: () => import('./dictionaries/en').then((module) => module.default),
};

export const getDictionary = async (locale: Language) => {
  if (!dictionaries[locale]) {
    console.warn(\`Dictionary not found for \${locale}, falling back to th\`);
    return dictionaries.th();
  }
  return dictionaries[locale]();
};

// For backward compatibility during migration, we can load a default dictionary synchronously
// but this defeats lazy loading for initial renders if used globally.
import defaultDictionary from "./dictionaries/th";
export const defaultDict = defaultDictionary;
`;
fs.writeFileSync('src/lib/i18n.ts', newI18n);

console.log("Done splitting");
