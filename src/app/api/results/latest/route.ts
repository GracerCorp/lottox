import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";

import { z } from "zod";

const querySchema = z.object({
  type: z.string().optional(),
  countries: z.string().optional(), // Comma-separated list of country IDs
  priorityCountry: z.string().max(10).optional(), // User's detected country for sorting
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get("type") || undefined;
    const countriesParam = searchParams.get("countries") || undefined;
    const priorityCountryParam = searchParams.get("priorityCountry") || undefined;

    // Validate input
    const parseResult = querySchema.safeParse({ type: typeParam, countries: countriesParam, priorityCountry: priorityCountryParam });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 },
      );
    }

    const { type, countries, priorityCountry } = parseResult.data;
    
    // Choose what to pass: array of countries or just type
    let apiArgs: string | string[] | undefined = type;
    if (countries) {
        apiArgs = countries.split(",").map(c => c.trim().toLowerCase()).filter(Boolean);
    }
    
    const data = await apiClient.getLatestResults(apiArgs, priorityCountry);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Results/Latest");
  }
}

export const dynamic = "force-dynamic";

