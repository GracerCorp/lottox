import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";

import { z } from "zod";

const querySchema = z.object({
  type: z
    .enum([
      "THAI",
      "LAO",
      "LAOS",
      "VIETNAM",
      "VIETNAM_SPECIFIC",
      "VIETNAM_SPECIAL",
      "VIETNAM_NORMAL",
      "VIETNAM_VIP",
    ])
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get("type") || undefined;

    // Validate input
    const parseResult = querySchema.safeParse({ type: typeParam });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid type parameter" },
        { status: 400 },
      );
    }

    const { type } = parseResult.data;
    const data = await apiClient.getLatestResults(type);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Results/Latest");
  }
}


export const revalidate = 300;
