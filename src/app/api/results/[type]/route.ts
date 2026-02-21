import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

import { z } from "zod";

const paramsSchema = z.object({
  type: z.enum(["thai", "lao", "laos", "vietnam"]),
});

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validate URL params
    const typeValidation = paramsSchema.safeParse({ type });
    if (!typeValidation.success) {
      return NextResponse.json(
        { error: "Invalid lottery type" },
        { status: 400 },
      );
    }

    // Validate Query params
    const queryValidation = querySchema.safeParse({
      limit: searchParams.get("limit") || undefined,
      page: searchParams.get("page") || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 },
      );
    }

    const { limit, page } = queryValidation.data;
    const offset = (page - 1) * limit;

    const data = await apiClient.getResultsByType(
      typeValidation.data.type,
      limit,
      offset,
    );
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("API Error (Results By Type):", error);
    return NextResponse.json(
      { error: "Failed to fetch results history" },
      { status: 500 },
    );
  }
}
