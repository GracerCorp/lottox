import { NextResponse } from "next/server";

const API_BASE_URL = "https://lotto-x-cms.vercel.app/api";
const API_KEY = process.env.API_KEY;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const { method = "GET", body, headers = {}, params, cache, next } = options;

    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
      ...headers,
    };

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        cache,
        next,
      });

      if (!response.ok) {
        // Try to parse error message from response
        try {
          const errorData = await response.json();
          throw new Error(
            errorData.message ||
              errorData.error ||
              `API Error: ${response.status} ${response.statusText}`,
          );
        } catch (jsonError) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`,
          );
        }
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`API Request Failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  // --- Public Spec API Methods ---

  // Results
  async getLatestResults(type?: string) {
    return this.fetch<{ results: any[] }>("/results/latest", {
      params: { type },
      next: { revalidate: 60 }, // Cache for 1 minute
    });
  }

  async getResultsByType(type: string, limit: number = 10, offset: number = 0) {
    return this.fetch<{ latest: any; history: any[]; total: number }>(
      `/results/${type}`,
      {
        params: { limit, offset },
        next: { revalidate: 60 },
      },
    );
  }

  async getGlobalResults(params: {
    page?: number;
    limit?: number;
    country?: string;
    period?: string;
    date?: string;
  }) {
    return this.fetch<{
      draws: any[];
      total: number;
      page: number;
      totalPages: number;
    }>("/results/global", {
      params,
      next: { revalidate: 60 },
    });
  }

  // Check Number
  async checkNumber(number: string, type: string, drawDate?: string) {
    return this.fetch<{
      win: boolean;
      prize?: string;
      prizeLabel?: string;
      amount?: string;
      drawDate: string;
      drawNo: string;
    }>("/check", {
      params: { number, type, drawDate },
      cache: "no-store", // Do not cache checks
    });
  }

  // Countries
  async getCountries() {
    return this.fetch<{ countries: any[] }>("/countries", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
  }

  async getCountryDraws(code: string, limit: number = 10) {
    return this.fetch<{ country: any; draws: any[] }>(
      `/countries/${code}/draws`,
      {
        params: { limit },
        next: { revalidate: 60 },
      },
    );
  }

  // News
  async getNews(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      lang?: string;
      search?: string;
    } = {},
  ) {
    return this.fetch<{
      articles: any[];
      total: number;
      page: number;
      totalPages: number;
    }>("/news", {
      params,
      next: { revalidate: 300 }, // Cache for 5 mins
    });
  }

  async getNewsDetail(slug: string, lang?: string) {
    return this.fetch<{
      slug: string;
      title: string;
      content: string;
      image: string;
      date: string;
      category: string;
      author: string;
      source: string;
      related: string[];
    }>(`/news/${slug}`, {
      params: { lang },
      next: { revalidate: 300 },
    });
  }

  // Statistics
  async getStatsOverview() {
    return this.fetch<{
      totalJackpotsTracked: string;
      activeLotteries: number;
      upcomingDraws24h: number;
      totalCountries: number;
    }>("/statistics/overview", {
      next: { revalidate: 3600 },
    });
  }

  async getStatsFrequency(type: string, draws: number = 30, position?: string) {
    return this.fetch<{
      type: string;
      draws: number;
      frequency: any;
      trends: any;
    }>("/statistics/frequency", {
      params: { type, draws, position },
      next: { revalidate: 3600 },
    });
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
