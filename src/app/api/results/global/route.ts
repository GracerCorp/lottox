import { NextResponse, NextRequest } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  country: z.string().optional(),
  period: z.string().optional(),
  date: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());
    const result = querySchema.safeParse(params);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const { page, limit, country, period, date } = result.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (apiClient as any).getGlobalResults({
      page,
      limit,
      country,
      period,
      date,
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Results/Global");
  }
}


export const revalidate = 300;
