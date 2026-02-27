import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";
import { z } from "zod";

/** Map API type slugs to DB country codes */
const TYPE_TO_COUNTRY_CODE: Record<string, string> = {
  thai: "th",
  "government-lottery-office-glo": "th",
  lao: "la",
  laos: "la",
  "lao-development": "la",
  vietnam: "vn",
};

const paramsSchema = z.object({
  type: z.enum([
    "thai",
    "lao",
    "laos",
    "vietnam",
    "government-lottery-office-glo",
    "lao-development",
  ]),
  date: z.string(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; date: string }> },
) {
  try {
    const resolvedParams = await params;

    // Validate URL params
    const typeValidation = paramsSchema.safeParse(resolvedParams);
    if (!typeValidation.success) {
      return NextResponse.json(
        { error: "Invalid lottery type or date format" },
        { status: 400 },
      );
    }

    const { type, date } = typeValidation.data;
    const countryCode = TYPE_TO_COUNTRY_CODE[type];

    // Fetch result filtered by both country and date
    const data = await apiClient.getGlobalResults({
      limit: 1,
      country: countryCode,
      date: date,
    });

    // Fetch history for the same type to populate the previous draws list
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let historyResults: any[] = [];
    try {
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
        dateDisplay: exactMatch.draw_date,
        date: exactMatch.draw_date,
        drawNo: exactMatch.draw_period,
        data: exactMatch.full_data,
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
