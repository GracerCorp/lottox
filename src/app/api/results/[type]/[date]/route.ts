import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";
import { resolveCountryCode } from "@/lib/utils/countryResolver";
import { z } from "zod";

const paramsSchema = z.object({
  type: z.string().min(1).max(30),
  date: z.string(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; date: string }> },
) {
  try {
    const resolvedParams = await params;

    // Validate URL params (format only)
    const typeValidation = paramsSchema.safeParse(resolvedParams);
    if (!typeValidation.success) {
      return NextResponse.json(
        { error: "Invalid lottery type or date format" },
        { status: 400 },
      );
    }

    const { type, date } = typeValidation.data;

    // Resolve dynamic country code
    const countryCode = await resolveCountryCode(type);
    if (!countryCode) {
      return NextResponse.json(
        { error: "Unsupported lottery type or country code" },
        { status: 400 },
      );
    }

    // Fetch result filtered by both country and date
    const data = await apiClient.getGlobalResults({
      limit: 1,
      country: countryCode, // The lookup depends on country code as param
      date: date,
    });

    // Fetch history for the same type to populate the previous draws list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let historyResults: any[] = [];
    try {
      // Pass the original `type` string as getResultsByType resolves it again internally
      const historyData = await apiClient.getResultsByType(type, 10, 0);
      if (historyData && historyData.history) {
        historyResults = historyData.history;
      }
    } catch (e) {
      console.error("Failed to fetch history for date route:", e);
    }

    const exactMatch = data.draws[0];

    if (!exactMatch) {
      return NextResponse.json(
        { error: "Result not found for the given date" },
        { status: 404 },
      );
    }

    // Return the found result
    return NextResponse.json({
      latest: {
        dateDisplay: exactMatch.drawDate,
        date: exactMatch.drawDate,
        drawNo: exactMatch.drawNo,
        data: exactMatch.data,
      },
      history: historyResults,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Error (Specific Result By Date):", error);
    return NextResponse.json(
      { error: "Failed to fetch specific result" },
      { status: 500 },
    );
  }
}

export const revalidate = 300;
