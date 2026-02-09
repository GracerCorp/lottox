export function getFlagUrl(countryCode: string): string {
  // Map common country names/codes to ISO 3166-1 alpha-2 codes if needed
  // But generally expect 2-letter codes.
  const code = countryCode.toLowerCase();

  // Handle some manual mapping if the input isn't a strict 2-letter code yet,
  // but for now let's assume we will pass valid codes or map them in the usage.
  // FlagCDN format: https://flagcdn.com/{size}/{code}.png

  // We'll use 'w' prefix for width-based sizing which is standard for flagcdn
  // e.g. https://flagcdn.com/w80/th.png

  return `https://flagcdn.com/${code}.svg`;
}
