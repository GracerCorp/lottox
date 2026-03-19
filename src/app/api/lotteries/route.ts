import { NextResponse } from "next/server";
import { getActiveCountries } from "@/lib/services/lotteryService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";

/**
 * GET /api/lotteries
 * Returns all active lotteries grouped by their parent country.
 */
export async function GET() {
  try {
    const countries = await getActiveCountries();

    const result = {
      countries: countries.map((c) => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
        lotteries: c.lotteries.map((l) => ({
          id: l.id,
          name: l.name,
          logo: l.logo ?? null,
        })),
      })),
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error, "Lotteries");
  }
}

export const revalidate = 300;
