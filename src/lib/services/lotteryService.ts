import { prisma } from "@/lib/prisma";

export async function getActiveCountries() {
  const countries = await prisma.countries.findMany({
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
    orderBy: {
      id: "asc", // or name: "asc"
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
