import { NextResponse, NextRequest } from "next/server";
import { statisticsService } from "@/lib/services/statisticsService";
import { z } from "zod";

const querySchema = z.object({
  type: z.enum(["overview", "frequency", "thai", "lao", "vietnam"]).default("overview"),
  draws: z.coerce.number().int().min(1).max(100).default(30),
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

    const { type, draws } = result.data;

    let data;
    if (type === "overview") {
      data = await statisticsService.getStatsOverview();
    } else {
      data = await statisticsService.getStatsFrequency(type, draws);
    }

    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[API/Statistics] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


export const revalidate = 300;
