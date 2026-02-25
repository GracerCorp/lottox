import { prisma } from "@/lib/prisma";

/** Country codes that have a live results page */
export const SUPPORTED_COUNTRY_CODES = ["TH", "LA", "VN"] as const;

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
  const country = await prisma.countries.findUnique({
    where: {
      code: countryCode.toUpperCase(),
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
