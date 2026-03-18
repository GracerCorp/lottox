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

export interface LotteryCardData {
  id: number;
  name: string;
  currency: string | null;
  isActive: boolean;
  /** Lottery-specific logo (preferred) */
  logo: string | null;
  /** Country flag (fallback when no logo) */
  flag: string | null;
  bgImage: string | null;
  countryCode: string;
  countryName: string;
  prizes: { label: string; amount: string }[];
  nextDrawDate: string | null;
  href: string;
}

/**
 * Fetch lottery card display data for a specific country.
 * Returns prize breakdown from the latest verified result and next draw date.
 */
export async function getLotteryCardData(
  countryCode: string,
): Promise<LotteryCardData[]> {
  const lotteries = await prisma.lotteries.findMany({
    where: {
      is_active: true,
      countries: { code: { equals: countryCode, mode: "insensitive" } },
    },
    include: {
      countries: { select: { code: true, name: true, flag: true, bg_image: true } },

      lottery_jobs: {
        where: { status: "active" },
        take: 1,
        select: { cron_schedule: true },
      },
      lottery_results: {
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
  });

  return lotteries.map((lottery) => {
    const latestResult = lottery.lottery_results[0];
    const verification =
      latestResult
        ?.result_verifications_result_verifications_lottery_result_idTolottery_results?.[0];
    const fullData = (verification?.chosen_data ??
      latestResult?.full_data) as Record<string, unknown> | null;

    // Currency symbol lookup
    const CURRENCY_SYMBOLS: Record<string, string> = {
      THB: "฿",
      LAK: "₭",
      JPY: "¥",
      AUD: "A$",
      USD: "$",
      EUR: "€",
      GBP: "£",
      KRW: "₩",
      CNY: "¥",
      VND: "₫",
      MYR: "RM",
      SGD: "S$",
    };
    const currencySymbol = lottery.currency
      ? (CURRENCY_SYMBOLS[lottery.currency] ?? lottery.currency + " ")
      : "";

    // Extract prize pairs from full_data supporting multiple field-name shapes
    const prizes: { label: string; amount: string }[] = [];
    if (fullData && Array.isArray(fullData.prizes)) {
      for (const p of fullData.prizes as Record<string, unknown>[]) {
        // Support multiple label keys used by different scrapers
        const label = String(
          p.prizeName ?? p.name ?? p.category ?? p.label ?? p.title ?? "Prize",
        );
        // Support multiple amount keys
        const rawAmount =
          p.prizeAmount != null
            ? String(p.prizeAmount)
            : p.value != null
              ? String(p.value)
              : p.jackpot != null
                ? String(p.jackpot)
                : "";

        if (!rawAmount) continue;

        // Parse out numeric value — skip zero / non-positive amounts
        const numeric = parseFloat(rawAmount.replace(/[^0-9.]/g, ""));
        if (isNaN(numeric) || numeric <= 0) continue;

        // Prepend currency symbol if the amount doesn't already have one
        const amount = /^[฿₭¥$€£₩₫₽RM]|^[A-Z]{2,3}\s/.test(rawAmount)
          ? rawAmount
          : `${currencySymbol}${rawAmount}`;
        prizes.push({ label, amount });
      }
    }


    const nextJob = lottery.lottery_jobs[0];
    // cron_schedule is a cron string (e.g. "0 15 1,16 * *") — use null for nextDrawDate
    // since we don't calculate next run from cron here; UI shows countdown only if date provided
    const nextDrawDate: string | null = nextJob?.cron_schedule ? null : null;

    const lotterySlug = slugify(lottery.name);
    const lotteryCountry = lottery.countries;

    return {
      id: lottery.id,
      name: lottery.name,
      currency: lottery.currency ?? null,
      isActive: lottery.is_active ?? false,
      logo: lottery.logo ?? null,
      flag: lotteryCountry?.flag ?? null,
      bgImage: lotteryCountry?.bg_image ?? null,

      countryCode: lotteryCountry?.code ?? countryCode,
      countryName: lotteryCountry?.name ?? countryCode,
      prizes,
      nextDrawDate,
      href: `/${countryCode.toLowerCase()}/${lotterySlug}`,
    };
  });
}

