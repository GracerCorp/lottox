import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/utils/apiErrorHandler";

export async function GET() {
  try {
    // We want regions that have at least 1 active lottery
    const rawData = await prisma.$queryRaw<{code: string, region: string}[]>`
      SELECT DISTINCT c.code, c.region
      FROM countries c
      JOIN lotteries l ON c.id = l.country_id
      WHERE c.is_active = true
        AND l.is_active = true
        AND c.region IS NOT NULL
        AND c.region != ''
    `;

    // Group by region
    const regionMap: Record<string, string[]> = {};
    for (const row of rawData) {
      if (!regionMap[row.region]) {
        regionMap[row.region] = [];
      }
      regionMap[row.region].push(row.code.toLowerCase());
    }

    // Format output
    const regions = Object.entries(regionMap).map(([name, countries]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      countries
    }));

    // Sort alphabetically
    regions.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ regions });
  } catch (error: unknown) {
    return handleApiError(error, "Regions");
  }
}

export const revalidate = 300;
