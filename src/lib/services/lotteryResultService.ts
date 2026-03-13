import { NextResponse } from "next/server";
import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

/** Map API type strings to DB country codes */
const TYPE_TO_COUNTRY: Record<string, string> = {
  thai: "th",
  lao: "la",
  laos: "la",
  vietnam: "vn",
  vietnam_specific: "vn",
  vietnam_special: "vn",
  vietnam_normal: "vn",
  vietnam_vip: "vn",
};

/** Map country code to display type used by frontend */
const COUNTRY_TO_TYPE: Record<string, string> = {
  th: "THAI",
  la: "LAO",
  vn: "VIETNAM",
};

type LotteryResultWithIncludes = {
  id: number;
  draw_date: string;
  draw_period: string | null;
  full_data: unknown;
  lottery: {
    name: string;
    showing_prizes?: string[];
    countries: { code: string } | null;
  } | null;
  result_verifications_result_verifications_lottery_result_idTolottery_results?: {
    chosen_data: unknown;
  }[];
};

function formatLotteryResult(res: LotteryResultWithIncludes, explicitType?: string) {
  const countryCode = res.lottery?.countries?.code?.toLowerCase() || "";
  const verification =
    res.result_verifications_result_verifications_lottery_result_idTolottery_results?.[0];
  const dataToUse = verification?.chosen_data || res.full_data;

  // The type logic sometimes returns the country display, explicit type, or lottery name.
  // Note: getResultsByType uses `COUNTRY_TO_TYPE[cc] || type`
  // getLatestResults uses `COUNTRY_TO_TYPE[countryCode] || type || res.lottery?.name`
  // getGlobalResults uses `COUNTRY_TO_TYPE[countryCode] || res.lottery?.name || ""`
  // We can unify as `COUNTRY_TO_TYPE[countryCode] || explicitType || res.lottery?.name || ""`
  const displayType = COUNTRY_TO_TYPE[countryCode] || explicitType || res.lottery?.name || "";

  return {
    id: res.id,
    type: displayType,
    date: res.draw_date,
    dateDisplay: res.draw_date, // Added from getResultsByType
    drawDate: res.draw_date, // Added from getGlobalResults / getLatestResults
    drawNo: res.draw_period || "",
    daysAgo: "", // Added from getResultsByType
    data: dataToUse,
    lotteryName: res.lottery?.name || "",
    countryCode: countryCode,
    showingPrizes: res.lottery?.showing_prizes || [],
  };
}

class ApiClient {
  // --- Public Spec API Methods ---

  // Results
  async getLatestResults(type?: string) {
    const whereClause: Prisma.lottery_resultsWhereInput = {};
    if (type) {
      const countryCode = TYPE_TO_COUNTRY[type.toLowerCase()];
      if (countryCode) {
        whereClause.lottery = {
          countries: {
            code: { equals: countryCode, mode: "insensitive" },
          },
        };
      }
    }

    // Filter only those with verified result_verification
    whereClause.result_verifications_result_verifications_lottery_result_idTolottery_results =
      {
        some: { status: "verified" },
      };

    const latestResults = await prisma.lottery_results.findMany({
      where: whereClause,
      orderBy: { draw_date: "desc" },
      take: 10,
      include: {
        lottery: {
          select: {
            name: true,
            showing_prizes: true,
            countries: { select: { code: true } },
          },
        },
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          {
            where: { status: "verified" },
            orderBy: { created_at: "desc" },
            take: 1,
            select: { chosen_data: true },
          },
      },
    });

    return { results: latestResults.map((r) => formatLotteryResult(r as LotteryResultWithIncludes, type)) };
  }

  async getResultsByType(type: string, limit: number = 10, offset: number = 0) {
    const countryCode = TYPE_TO_COUNTRY[type.toLowerCase()];
    const whereClause: Prisma.lottery_resultsWhereInput = countryCode
      ? {
          lottery: {
            countries: {
              code: { equals: countryCode, mode: "insensitive" },
            },
          },
        }
      : {};

    // Filter only those with verified result_verification
    whereClause.result_verifications_result_verifications_lottery_result_idTolottery_results =
      {
        some: { status: "verified" },
      };

    const [total, results] = await prisma.$transaction([
      prisma.lottery_results.count({ where: whereClause }),
      prisma.lottery_results.findMany({
        where: whereClause,
        orderBy: { draw_date: "desc" },
        take: limit,
        skip: offset,
        include: {
          lottery: {
            select: {
              name: true,
              showing_prizes: true,
              countries: { select: { code: true } },
            },
          },
          result_verifications_result_verifications_lottery_result_idTolottery_results:
            {
              where: { status: "verified" },
              orderBy: { created_at: "desc" },
              take: 1,
              select: { chosen_data: true },
            },
        },
      }),
    ]);

    return {
      latest: results.length > 0 ? formatLotteryResult(results[0] as LotteryResultWithIncludes, type) : null,
      history: results.map((r) => formatLotteryResult(r as LotteryResultWithIncludes, type)),
      total,
    };
  }

  async getGlobalResults(params: {
    page?: number;
    limit?: number;
    country?: string;
    period?: string;
    date?: string;
  }) {
    const { page = 1, limit = 10, country, period, date } = params;
    const offset = (page - 1) * limit;

    const whereClause: Prisma.lottery_resultsWhereInput = {};
    if (country) {
      whereClause.lottery = {
        countries: {
          code: {
            equals: country,
            mode: "insensitive",
          },
        },
      };
    }
    if (date) {
      whereClause.draw_date = date;
    }
    if (period) {
      whereClause.draw_period = period;
    }

    // Filter only those with verified result_verification
    whereClause.result_verifications_result_verifications_lottery_result_idTolottery_results =
      {
        some: { status: "verified" },
      };

    const [total, results] = await prisma.$transaction([
      prisma.lottery_results.count({ where: whereClause }),
      prisma.lottery_results.findMany({
        where: whereClause,
        orderBy: { draw_date: "desc" },
        take: limit,
        skip: offset,
        include: {
          lottery: {
            select: {
              name: true,
              showing_prizes: true,
              countries: { select: { code: true } },
            },
          },
          result_verifications_result_verifications_lottery_result_idTolottery_results:
            {
              where: { status: "verified" },
              orderBy: { created_at: "desc" },
              take: 1,
              select: { chosen_data: true },
            },
        },
      }),
    ]);

    return {
      draws: results.map((r) => formatLotteryResult(r as LotteryResultWithIncludes)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Check Number
  async checkNumber(number: string, type: string, drawDate?: string) {
    // Basic implementation since we lack all specific parsing details.
    // Assuming full_data JSON has properties we need, or check against lottery_prizes.
    // For now we will try checking lottery_prizes.

    // Find the relevant result first
    const countryCode = TYPE_TO_COUNTRY[type.toLowerCase()];
    const resultWhere: Prisma.lottery_resultsWhereInput = countryCode
      ? {
          lottery: {
            countries: {
              code: { equals: countryCode, mode: "insensitive" },
            },
          },
        }
      : {};
    if (drawDate) {
      resultWhere.draw_date = drawDate;
    }

    const latestResult = await prisma.lottery_results.findFirst({
      where: resultWhere,
      orderBy: { draw_date: "desc" },
    });

    if (!latestResult) {
      return {
        win: false,
        drawDate: drawDate || "Unknown",
        drawNo: "Unknown",
      };
    }

    let isWin = false;
    const wonPrizes: Array<{ label: string; amount?: string }> = [];

    // Traverse the fully nested JSON object looking for exact number matches
    const traverse = (obj: unknown, parentKey?: string) => {
      if (Array.isArray(obj)) {
        obj.forEach((item) => {
          if (typeof item === "string" || typeof item === "number") {
             if (String(item) === number) {
               isWin = true;
               wonPrizes.push({ label: parentKey || "Prize" });
             }
          } else {
             traverse(item, parentKey);
          }
        });
      } else if (obj !== null && typeof obj === "object") {
        const record = obj as Record<string, unknown>;
        
        // Direct match in a structured prize object
        if (String(record.number) === number || 
           (Array.isArray(record.numbers) && record.numbers.some((n: unknown) => String(n) === number))) {
          isWin = true;
          wonPrizes.push({
            label: String(record.name || parentKey || "Prize"),
            amount: record.amount || record.reward ? String(record.amount || record.reward) : undefined
          });
        }
        
        for (const [key, value] of Object.entries(record)) {
          if (key !== "number" && key !== "numbers") {
             traverse(value, key);
          }
        }
      } else if (typeof obj === "string" || typeof obj === "number") {
         if (String(obj) === number) {
             isWin = true;
             wonPrizes.push({ label: parentKey || "Prize" });
         }
      }
    };

    if (latestResult.full_data) {
      traverse(latestResult.full_data);
    }

    return {
      win: isWin,
      prizes: wonPrizes.length > 0 ? wonPrizes : undefined,
      drawDate: latestResult.draw_date,
      drawNo: latestResult.draw_period || "",
    };
  }
}

export const apiClient = new ApiClient();

// Helper to standardise API Responses for our internal API
export function apiResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}
