import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { z } from "zod";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(3),
});

/** Known draw schedules: { countryCode -> draw hour (UTC) } */
const DRAW_SCHEDULE_UTC: Record<string, number> = {
  th: 9,  // Thai government lottery: 09:00 UTC (16:00 Bangkok)
  la: 8,  // Lao 08:00 UTC
  vn: 10, // Vietnam 10:00 UTC
};

function getNextDrawAt(countryCode: string): string {
  const drawHour = DRAW_SCHEDULE_UTC[countryCode] ?? 10;
  const now = new Date();
  const candidate = new Date(now);
  candidate.setUTCHours(drawHour, 0, 0, 0);
  if (candidate <= now) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }
  return candidate.toISOString();
}

export interface UpcomingDraw {
  name: string;
  countryCode: string;
  nextDrawAt: string;
}

export interface UpcomingDrawsResponse {
  upcoming: UpcomingDraw[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parsed = querySchema.safeParse(
      Object.fromEntries(searchParams.entries()),
    );

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const { limit } = parsed.data;

    // Fetch top active lotteries ordered by draw activity
    const activeLotteries = await prisma.lotteries.findMany({
      where: { is_active: true },
      orderBy: { id: "asc" },
      take: limit,
      include: {
        countries: { select: { code: true, name: true } },
      },
    });

    const upcoming: UpcomingDraw[] = activeLotteries.map((l) => {
      const cc = l.countries?.code?.toLowerCase() ?? "th";
      return {
        name: l.name,
        countryCode: cc,
        nextDrawAt: getNextDrawAt(cc),
      };
    });

    return NextResponse.json({ upcoming } satisfies UpcomingDrawsResponse);
  } catch (error: unknown) {
    return handleApiError(error, "Results/Upcoming");
  }
}

export const revalidate = 60;
