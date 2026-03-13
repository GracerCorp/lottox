import { prisma } from "../prisma";

export const countryService = {
  async getCountries() {
    const countriesList = await prisma.countries.findMany({
      where: { is_active: true },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { lotteries: true },
        },
      },
    });
    return { countries: countriesList };
  },

  async getCountryDraws(code: string, limit: number = 10) {
    const countryInfo = await prisma.countries.findFirst({
      where: { code: { equals: code, mode: "insensitive" } },
      include: {
        lotteries: {
          include: {
            lottery_results: {
              where: {
                result_verifications_result_verifications_lottery_result_idTolottery_results:
                  {
                    some: { status: "verified" },
                  },
              },
              orderBy: { draw_date: "desc" },
              take: 1,
              include: {
                result_verifications_result_verifications_lottery_result_idTolottery_results:
                  {
                    where: { status: "verified" },
                    orderBy: { created_at: "desc" },
                    take: 1,
                    select: { chosen_data: true },
                  },
              },
            },
          },
        },
      },
    });

    if (!countryInfo) {
      throw new Error("Country not found");
    }

    const lotteryIds = countryInfo.lotteries.map((l) => l.id);

    const draws = await prisma.lottery_results.findMany({
      where: {
        lottery_id: { in: lotteryIds },
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          {
            some: { status: "verified" },
          },
      },
      orderBy: { draw_date: "desc" },
      take: limit,
      include: {
        lottery: true,
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          {
            where: { status: "verified" },
            orderBy: { created_at: "desc" },
            take: 1,
            select: { chosen_data: true },
          },
      },
    });

    // Map `chosen_data` into `full_data` for consistency
    const mappedCountryInfo = {
      ...countryInfo,
      lotteries: countryInfo.lotteries.map((lottery) => ({
        ...lottery,
        lottery_results: lottery.lottery_results.map((res) => {
          const verification =
            res
              .result_verifications_result_verifications_lottery_result_idTolottery_results?.[0];
          return {
            ...res,
            full_data: verification?.chosen_data || res.full_data,
            result_verifications_result_verifications_lottery_result_idTolottery_results:
              undefined,
          };
        }),
      })),
    };

    const mappedDraws = draws.map((res) => {
      const verification =
        res
          .result_verifications_result_verifications_lottery_result_idTolottery_results?.[0];
      return {
        ...res,
        full_data: verification?.chosen_data || res.full_data,
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          undefined,
      };
    });

    return { country: mappedCountryInfo, draws: mappedDraws };
  },
};
