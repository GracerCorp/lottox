import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

import { z } from "zod";

const paramsSchema = z.object({
  slug: z.string().min(1),
});

const querySchema = z.object({
  lang: z.enum(["th", "en"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validate params
    const paramsValidation = paramsSchema.safeParse({ slug });
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid article slug" },
        { status: 400 },
      );
    }

    // Validate query
    const queryValidation = querySchema.safeParse({
      lang: searchParams.get("lang") || undefined,
    });
    // lang is simple enum, but safeParse handles it gracefully
    const lang = queryValidation.success
      ? queryValidation.data.lang || "th"
      : "th";

    const data = await apiClient.getNewsDetail(slug, lang);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error (News Detail):", error);
    return NextResponse.json(
      { error: "Failed to fetch news detail" },
      { status: 500 },
    );
  }
}
