import { prisma } from "../prisma";
import { resolveCountryCode } from "@/lib/utils/countryResolver";

export const statisticsService = {
  async getStatsOverview() {
    const [totalResults, activeLottos, countries] = await prisma.$transaction([
      prisma.lottery_results.count(),
      prisma.lotteries.count({ where: { is_active: true } }),
      prisma.countries.count({ where: { is_active: true } }),
    ]);

    return {
      totalJackpotsTracked: totalResults.toString(),
      activeLotteries: activeLottos,
      upcomingDraws24h: 0,
      totalCountries: countries,
    };
  },

  async getStatsFrequency(type: string, draws: number = 30) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      result_verifications_result_verifications_lottery_result_idTolottery_results: {
        some: { status: "verified" },
      },
    };

    if (type && type !== "frequency") {
      const countryCode = await resolveCountryCode(type);
      if (countryCode) {
        where.lottery = { countries: { code: countryCode } };
      }
    }

    const results = await prisma.lottery_results.findMany({
      where,
      orderBy: { draw_date: "desc" },
      take: draws,
      select: {
        full_data: true,
        draw_date: true,
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          {
            where: { status: "verified" },
            take: 1,
            select: { chosen_data: true },
          },
      },
    });

    const frequency: Record<string, number> = {};
    const trends: Record<string, number> = {};

    results.forEach((row, i) => {
      const data =
        row
          .result_verifications_result_verifications_lottery_result_idTolottery_results[0]
          ?.chosen_data || row.full_data;

      // Deep extract to identify suffixes
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const extract = (obj: any) => {
        if (Array.isArray(obj)) {
          obj.forEach(extract);
        } else if (obj !== null && typeof obj === "object") {
          if (obj.number) {
             extract(obj.number);
          } else if (obj.numbers) {
             extract(obj.numbers);
          } else {
            Object.entries(obj).forEach(([key, val]) => {
              if (key !== "amount" && key !== "reward" && key !== "name") {
                extract(val);
              }
            });
          }
        } else if (typeof obj === "string" || typeof obj === "number") {
          const str = String(obj);
          if (str.length >= 2) {
            const suffix = str.slice(-2);
            frequency[suffix] = (frequency[suffix] || 0) + 1;
            if (i < 5) {
              trends[suffix] = (trends[suffix] || 0) + 1;
            }
          }
        }
      };

      if (data) extract(data);
    });

    return {
      type,
      draws,
      frequency,
      trends,
    };
  },
};
