import { prisma } from "@/lib/prisma";

/**
 * Legacy aliases for backward compatibility.
 * Maps old API type strings (e.g. "thai") to their country code ("th").
 * New countries don't need entries here — they use their country code directly.
 */
const LEGACY_ALIASES: Record<string, string> = {
  th: "th",
  la: "la",
  vn: "vn",
  au: "au",
  my: "my",
  sg: "sg",
  thai: "th",
  lao: "la",
  laos: "la",
  vietnam: "vn",
  "government-lottery-office-glo": "th",
  "lao-development": "la",
  vietnam_specific: "vn",
  vietnam_special: "vn",
  vietnam_normal: "vn",
  vietnam_vip: "vn",
};

/**
 * Resolve an API type string or country code to a valid DB country code.
 *
 * Resolution order:
 * 1. Check legacy alias map (backward compat for "thai" → "th")
 * 2. Check if input is already a valid country code in the DB
 * 3. Return null if neither matches
 */
export async function resolveCountryCode(
  input: string,
): Promise<string | null> {
  const normalized = input.toLowerCase().trim();

  // 1. Legacy alias lookup (instant, no DB hit)
  const aliased = LEGACY_ALIASES[normalized];
  if (aliased) return aliased;

  // 2. Check if input is directly a valid country code in DB
  const country = await prisma.countries.findFirst({
    where: {
      code: { equals: normalized, mode: "insensitive" },
      is_active: true,
    },
    select: { code: true },
  });

  return country?.code?.toLowerCase() ?? null;
}

/**
 * Get the display type for a country code (e.g. "th" → "TH").
 * Dynamic — no hardcoded map needed.
 */
export function getDisplayType(countryCode: string): string {
  return countryCode.toUpperCase();
}

/**
 * Expose LEGACY_ALIASES for testing purposes only.
 */
export const _legacyAliases = LEGACY_ALIASES;
