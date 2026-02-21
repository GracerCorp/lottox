import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

import { z } from "zod";

const querySchema = z.object({
  number: z.string().regex(/^\d+$/, "Number must be numeric").min(1).max(6),
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

    const data = await apiClient.checkNumber(number, type, drawDate);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error (Check):", error);
    return NextResponse.json(
      { error: "Failed to check number" },
      { status: 500 },
    );
  }
}
