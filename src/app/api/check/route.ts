import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { validateNumber } from "@/lib/utils/lotteryValidation";

import { z } from "zod";

const querySchema = z.object({
  number: z.string().regex(/^\d+$/, "Number must be numeric").min(1).max(7),
  type: z.string().min(1),
  drawDate: z.string().optional(), // YYYY-MM-DD format check optional but recommended
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawNumber = searchParams.get("number");
    const rawType = searchParams.get("type");
    const rawDate = searchParams.get("drawDate");

    const validation = querySchema.safeParse({
      number: rawNumber,
      type: rawType,
      drawDate: rawDate || undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { number, type, drawDate } = validation.data;

    // Country-specific validation
    const numberValidation = validateNumber(number, type);
    if (!numberValidation.valid) {
      return NextResponse.json(
        { error: numberValidation.error },
        { status: 400 },
      );
    }

    const data = await apiClient.checkNumber(number, type, drawDate);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Check");
  }
}
