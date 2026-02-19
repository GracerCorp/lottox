import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const country = searchParams.get("country") || undefined;
  const period = searchParams.get("period") || undefined;
  const date = searchParams.get("date") || undefined;

  try {
    const data = await apiClient.getGlobalResults({
      page,
      limit,
      country,
      period,
      date,
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
