import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";
import { z } from "zod";

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

    // Use global results endpoint with date filtering
    const data = await apiClient.getGlobalResults({
      period: undefined,
      limit: 1,
      country: undefined,
      date: date,
    });

    // Find the specific result that matches our type and date
    // Note: getGlobalResults is generic, so we'll filter it down here safely
    const exactMatch = data.draws.find((d: any) => {
      const mappedType = d.lottery?.countries?.code?.toLowerCase();
      // "thai" or "government-lottery-office-glo" match to 'th'
      const isThaiMatch =
        (type === "thai" || type === "government-lottery-office-glo") &&
        mappedType === "th";
      const isLaoMatch =
        (type === "lao" || type === "laos" || type === "lao-development") &&
        mappedType === "la";
      const isVnMatch = type === "vietnam" && mappedType === "vn";
      return isThaiMatch || isLaoMatch || isVnMatch;
    });

    if (!exactMatch) {
      // Also try matching by exact date without type matching just in case
      const dateMatch = data.draws.find((d) => d.draw_date === date);
      if (!dateMatch) {
        return NextResponse.json(
          { error: "Result not found for the given date" },
          { status: 404 },
        );
      }

      return NextResponse.json({
        latest: {
          dateDisplay: dateMatch.draw_date,
          date: dateMatch.draw_date,
          drawNo: dateMatch.draw_period,
          data: dateMatch.full_data,
        },
        history: [],
      });
    }

    // Return the found result
    return NextResponse.json({
      latest: {
        dateDisplay: exactMatch.draw_date,
        date: exactMatch.draw_date,
        drawNo: exactMatch.draw_period,
        data: exactMatch.full_data,
      },
      history: [],
    });
  } catch (error: any) {
    console.error("API Error (Specific Result By Date):", error);
    return NextResponse.json(
      { error: "Failed to fetch specific result" },
      { status: 500 },
    );
  }
}
