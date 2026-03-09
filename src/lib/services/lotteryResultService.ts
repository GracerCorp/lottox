import { NextResponse } from "next/server";
import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";
import { resolveCountryCode, getDisplayType } from "../utils/countryResolver";

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

function formatLotteryResult(
  res: LotteryResultWithIncludes,
  explicitType?: string,
) {
  const countryCode = res.lottery?.countries?.code?.toLowerCase() || "";
  const verification =
    res
      .result_verifications_result_verifications_lottery_result_idTolottery_results?.[0];
  const dataToUse = verification?.chosen_data || res.full_data;

  // The type logic dynamically assigns uppercase countryCode, explicit type, or lottery name
  const displayType = countryCode
    ? getDisplayType(countryCode)
    : explicitType || res.lottery?.name || "";

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
      const countryCode = await resolveCountryCode(type);
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

    return {
      results: latestResults.map((r) =>
        formatLotteryResult(r as LotteryResultWithIncludes, type),
      ),
    };
  }

  async getResultsByType(type: string, limit: number = 10, offset: number = 0) {
    const countryCode = await resolveCountryCode(type);
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
      latest:
        results.length > 0
          ? formatLotteryResult(results[0] as LotteryResultWithIncludes, type)
          : null,
      history: results.map((r) =>
        formatLotteryResult(r as LotteryResultWithIncludes, type),
      ),
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
      draws: results.map((r) =>
        formatLotteryResult(r as LotteryResultWithIncludes),
      ),
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
    const countryCode = await resolveCountryCode(type);
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
        if (
          String(record.number) === number ||
          (Array.isArray(record.numbers) &&
            record.numbers.some((n: unknown) => String(n) === number))
        ) {
          isWin = true;
          wonPrizes.push({
            label: String(record.name || parentKey || "Prize"),
            amount:
              record.amount || record.reward
                ? String(record.amount || record.reward)
                : undefined,
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

  // Countries
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
  }

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
  }

  async getNews(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      search?: string;
    } = {},
  ) {
    const { page = 1, limit = 10, category, search } = params;
    const offset = (page - 1) * limit;

    const where: Prisma.articlesWhereInput = {
      published: true,
    };

    if (category) {
      // Based on schema, tags are String[] arrays, we can look within them or use a dedicated column if exists (schema lacks simple category)
      where.tags = {
        has: category,
      };
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const [total, rawArticles] = await prisma.$transaction([
      prisma.articles.count({ where }),
      prisma.articles.findMany({
        where,
        orderBy: { published_at: "desc" },
        take: limit,
        skip: offset,
      }),
    ]);

    const mappedArticles = rawArticles.map((article) => {
      // Parse JSON content if it's a string, or use as is if already an object
      const contentData =
        typeof article.content === "string"
          ? JSON.parse(article.content)
          : (article.content as Record<string, unknown>) || {};

      return {
        slug: article.slug,
        title: article.title,
        titleEn: contentData.titleEn || article.title,
        excerpt: article.excerpt || "",
        excerptEn: contentData.excerptEn || article.excerpt || "",
        image:
          article.cover_image ||
          (article.images && article.images.length > 0
            ? article.images[0]
            : ""),
        date:
          article.published_at?.toISOString() ||
          article.created_at?.toISOString() ||
          "",
        category:
          article.tags && article.tags.length > 0 ? article.tags[0] : "",
        categoryEn:
          contentData.categoryEn ||
          (article.tags && article.tags.length > 0 ? article.tags[0] : ""),
        author: "Admin", // Need to join with User table if we want dynamic author, but Admin is fine as default
      };
    });

    return {
      articles: mappedArticles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getNewsDetail(
    slug: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lang?: string,
  ) {
    const article = await prisma.articles.findUnique({
      where: { slug },
      include: {
        user: {
          select: { name: true },
        },
        lottery: {
          select: {
            name: true,
            countries: {
              select: { code: true },
            },
          },
        },
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    // Parse JSON content if it's a string, or use as is if already an object
    const contentData =
      typeof article.content === "string"
        ? JSON.parse(article.content)
        : (article.content as Record<string, unknown>) || {};

    let relatedLottery = undefined;
    if (article.lottery && article.lottery.countries) {
      const cc = article.lottery.countries.code.toLowerCase();
      relatedLottery = {
        type: getDisplayType(cc) || article.lottery.name,
        name: article.lottery.name,
        countryCode: cc,
      };
    }

    return {
      slug: article.slug,
      title: article.title,
      titleEn: contentData.titleEn || article.title,
      content: article.raw_html || article.full_content || "",
      contentEn:
        contentData.contentEn || article.raw_html || article.full_content || "",
      excerpt: article.excerpt || "",
      excerptEn: contentData.excerptEn || article.excerpt || "",
      image:
        article.cover_image ||
        (article.images.length > 0 ? article.images[0] : ""),
      date:
        article.published_at?.toISOString() ||
        article.created_at?.toISOString() ||
        "",
      category: article.tags.length > 0 ? article.tags[0] : "",
      categoryEn:
        contentData.categoryEn ||
        (article.tags.length > 0 ? article.tags[0] : ""),
      author: article.user?.name || "Admin",
      source: contentData.source || "LottoX",
      related: [],
      relatedLottery,
    };
  }

  // Statistics
  async getStatsOverview() {
    const [totalResults, activeLottos, countries] = await prisma.$transaction([
      prisma.lottery_results.count(),
      prisma.lotteries.count({ where: { is_active: true } }),
      prisma.countries.count({ where: { is_active: true } }),
    ]);

    return {
      totalJackpotsTracked: totalResults.toString(), // Approximation based on DB counts
      activeLotteries: activeLottos,
      upcomingDraws24h: 0, // Need schedule implementation logic to calc properly
      totalCountries: countries,
    };
  }

  async getStatsFrequency(type: string, draws: number = 30) {
    return {
      type,
      draws,
      frequency: {}, // Needs complex aggregation logic over JSON fields
      trends: {},
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
