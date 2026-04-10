/**
 * Hardcoded mapping of country codes to their respective continents/regions
 * since the database doesn't currently provide this grouping.
 */
export const COUNTRY_REGION_MAP: Record<string, string> = {
  // Southeast Asia
  th: "Southeast Asia",
  la: "Southeast Asia",
  vn: "Southeast Asia",
  my: "Southeast Asia",
  sg: "Southeast Asia",
  ph: "Southeast Asia",
  kh: "Southeast Asia",
  id: "Southeast Asia",
  
  // Asia
  jp: "Asia",
  kr: "Asia",
  cn: "Asia",
  in: "Asia",
  tw: "Asia",
  
  // Europe
  gb: "Europe",
  fr: "Europe",
  de: "Europe",
  it: "Europe",
  es: "Europe",
  pt: "Europe",
  nl: "Europe",
  be: "Europe",
  ie: "Europe",
  se: "Europe",
  no: "Europe",
  dk: "Europe",
  ch: "Europe",
  at: "Europe",
  pl: "Europe",
  cz: "Europe",
  gr: "Europe",
  fi: "Europe",
  
  // United States
  us: "United States",
  
  // Oceania
  au: "Oceania",
  nz: "Oceania",
  
  // Americas
  ca: "Americas",
  br: "Americas",
  mx: "Americas",
  ar: "Americas",
  co: "Americas",
  cl: "Americas",
  
  // Africa
  za: "Africa",
  ng: "Africa",
  ke: "Africa",
  eg: "Africa",
  ma: "Africa",
};

export const GLOBAL_REGIONS = [
  "All",
  "Southeast Asia",
  "Asia",
  "Europe",
  "United States",
  "Oceania",
  "Americas",
  "Africa"
];

export function getRegionForCountry(countryCode: string): string {
  return COUNTRY_REGION_MAP[countryCode.toLowerCase()] || "Other";
}
