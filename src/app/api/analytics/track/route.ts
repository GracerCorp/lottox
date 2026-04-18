import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const trackSchema = z.object({
  countryCode: z.string().max(10).optional(),
  countryName: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = trackSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { countryCode, countryName, city, region } = parseResult.data;

    // Extract IP from headers (x-forwarded-for is set by reverse proxies / Vercel)
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded ? forwarded.split(",")[0].trim() : null;

    // Extract user agent
    const userAgent = request.headers.get("user-agent") || null;

    await prisma.visitor_analytics.create({
      data: {
        country_code: countryCode || null,
        country_name: countryName || null,
        city: city || null,
        region: region || null,
        ip_address: ipAddress,
        user_agent: userAgent,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 },
    );
  }
}
