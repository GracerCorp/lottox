import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";

class ApiClient {
  // --- Public Spec API Methods ---

  // Results
  async getLatestResults(type?: string) {
    const whereClause: Prisma.lottery_resultsWhereInput = {};
    if (type) {
      whereClause.lottery_jobs = {
        name: {
          equals: type,
          mode: "insensitive",
        },
      };
    }

    const latestResults = await prisma.lottery_results.findMany({
      where: whereClause,
      orderBy: { draw_date: "desc" },
      take: 10,
      include: {
        lottery_jobs: {
          select: {
            name: true,
          },
        },
      },
    });

    const formatResult = (res: {
      id: number;
      draw_date: string;
      draw_period: string | null;
      full_data: unknown;
      lottery_jobs: { name: string } | null;
    }) => ({
      id: res.id,
      type: res.lottery_jobs?.name || type,
      date: res.draw_date,
      drawDate: res.draw_date,
      drawNo: res.draw_period || "",
      data: res.full_data,
    });

    return { results: latestResults.map(formatResult) };
  }

  async getResultsByType(type: string, limit: number = 10, offset: number = 0) {
    const whereClause: Prisma.lottery_resultsWhereInput = {
      lottery_jobs: {
        name: {
          equals: type,
          mode: "insensitive",
        },
      },
    };

    const [total, results] = await prisma.$transaction([
      prisma.lottery_results.count({ where: whereClause }),
      prisma.lottery_results.findMany({
        where: whereClause,
        orderBy: { draw_date: "desc" },
        take: limit,
        skip: offset,
        include: {
          lottery_jobs: {
            select: { name: true },
          },
        },
      }),
    ]);

    const formatResult = (res: {
      id: number;
      draw_date: string;
      draw_period: string | null;
      full_data: unknown;
      lottery_jobs: { name: string } | null;
    }) => ({
      id: res.id,
      type: res.lottery_jobs?.name || type,
      date: res.draw_date,
      dateDisplay: res.draw_date,
      drawNo: res.draw_period || "",
      daysAgo: "", // Can calculate if needed
      data: res.full_data,
    });

    return {
      latest: results.length > 0 ? formatResult(results[0]) : null,
      history: results.map(formatResult),
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
      whereClause.lottery_jobs = {
        countries: {
          code: {
            equals: country,
            mode: "insensitive",
          },
        },
      };
    }
    if (date) {
      whereClause.draw_date = date; // Or however dates are tracked exactly
    }
    if (period) {
      whereClause.draw_period = period;
    }

    const [total, results] = await prisma.$transaction([
      prisma.lottery_results.count({ where: whereClause }),
      prisma.lottery_results.findMany({
        where: whereClause,
        orderBy: { draw_date: "desc" },
        take: limit,
        skip: offset,
        include: {
          lottery_jobs: {
            include: {
              countries: true,
            },
          },
        },
      }),
    ]);

    return {
      draws: results,
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
    const resultWhere: Prisma.lottery_resultsWhereInput = {
      lottery_jobs: {
        name: { equals: type, mode: "insensitive" },
      },
    };
    if (drawDate) {
      resultWhere.draw_date = drawDate;
    }

    const latestResult = await prisma.lottery_results.findFirst({
      where: resultWhere,
      orderBy: { draw_date: "desc" },
      include: {
        lottery_prizes: true,
      },
    });

    if (!latestResult) {
      return {
        win: false,
        drawDate: drawDate || "Unknown",
        drawNo: "Unknown",
      };
    }

    let isWin = false;
    let winPrize = "";
    let amount = 0;

    for (const prize of latestResult.lottery_prizes) {
      // winning_numbers is likely an array in JSON or string
      const numbers: unknown = prize.winning_numbers;
      if (Array.isArray(numbers) && numbers.includes(number)) {
        isWin = true;
        winPrize = prize.prize_name;
        amount = prize.prize_amount;
        break;
      } else if (typeof numbers === "string" && numbers === number) {
        isWin = true;
        winPrize = prize.prize_name;
        amount = prize.prize_amount;
        break;
      }
    }

    return {
      win: isWin,
      prize: isWin ? winPrize : undefined,
      prizeLabel: isWin ? winPrize : undefined,
      amount: amount > 0 ? amount.toString() : undefined,
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
    const countryInfo = await prisma.countries.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        lotteries: {
          include: {
            lottery_results: {
              orderBy: { draw_date: "desc" },
              take: 1,
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
      where: { lottery_id: { in: lotteryIds } },
      orderBy: { draw_date: "desc" },
      take: limit,
      include: {
        lottery_jobs: true,
      },
    });

    return { country: countryInfo, draws };
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

    const [total, articles] = await prisma.$transaction([
      prisma.articles.count({ where }),
      prisma.articles.findMany({
        where,
        orderBy: { published_at: "desc" },
        take: limit,
        skip: offset,
      }),
    ]);

    return {
      articles,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getNewsDetail(slug: string, lang?: string) {
    const article = await prisma.articles.findUnique({
      where: { slug },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    if (!article) {
      throw new Error("Article not found");
    }

    return {
      slug: article.slug,
      title: article.title,
      content:
        typeof article.content === "string"
          ? article.content
          : JSON.stringify(article.content),
      image:
        article.cover_image ||
        (article.images.length > 0 ? article.images[0] : ""),
      date:
        article.published_at?.toISOString() ||
        article.created_at?.toISOString() ||
        "",
      category: article.tags.length > 0 ? article.tags[0] : "",
      author: article.user?.name || "Admin",
      source: "LottoX",
      related: [],
    };
  }

  // Statistics
  async getStatsOverview() {
    const [totalResults, activeLottos, countries] = await prisma.$transaction([
      prisma.lottery_results.count(),
      prisma.lottery_jobs.count({ where: { status: "active" } }),
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
