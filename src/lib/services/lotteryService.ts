import { prisma } from "@/lib/prisma";

/** Slugify a lottery name to produce URL-safe slug */
import { slugify } from "@/lib/utils/lotteryUtils";

/**
 * Get all active countries with their active lotteries and jobs.
 * No whitelist — returns every country marked `is_active: true` in the DB.
 */
export async function getActiveCountries() {
  const countries = await prisma.countries.findMany({
    where: {
      is_active: true,
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

  // apiType always uses the country code directly — no hardcoded map needed
  const apiType = countryCode.toLowerCase();

  return {
    country,
    lottery,
    apiType,
  };
}
