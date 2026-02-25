import { prisma } from "@/lib/prisma";

/** Country codes that have a live results page */
export const SUPPORTED_COUNTRY_CODES = ["th", "la", "vn"] as const;

export async function getActiveCountries() {
  const countries = await prisma.countries.findMany({
    where: {
      is_active: true,
      code: { in: [...SUPPORTED_COUNTRY_CODES] },
    },
    include: {
      lotteries: {
        where: {
          is_active: true,
        },
        include: {
          lottery_jobs: {
            where: {
              status: "active",
            },
          },
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return countries;
}

export async function getLotteriesByCountry(countryCode: string) {
  const country = await prisma.countries.findFirst({
    where: {
      code: { equals: countryCode, mode: "insensitive" },
    },
    include: {
      lotteries: {
        where: {
          is_active: true,
        },
      },
    },
  });

  return country;
}

/** Slugify a lottery name to produce URL-safe slug */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Map from country code to API type key used in /api/results/[type] */
const COUNTRY_TO_API_TYPE: Record<string, string> = {
  th: "thai",
  la: "lao",
  vn: "vietnam",
};

/**
 * Find a lottery by country code + URL slug.
 * Slug is matched by slugifying each lottery name and comparing.
 */
export async function getLotteryBySlug(
  countryCode: string,
  lotterySlug: string,
) {
  const country = await prisma.countries.findFirst({
    where: {
      code: { equals: countryCode, mode: "insensitive" },
    },
    include: {
      lotteries: {
        where: { is_active: true },
      },
    },
  });

  if (!country) return null;

  const lottery = country.lotteries.find(
    (l) => slugify(l.name) === lotterySlug,
  );

  if (!lottery) return null;

  const apiType = COUNTRY_TO_API_TYPE[countryCode.toLowerCase()] || countryCode;

  return {
    country,
    lottery,
    apiType,
  };
}
