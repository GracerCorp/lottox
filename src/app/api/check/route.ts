import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const number = searchParams.get("number");
  const type = searchParams.get("type");
  const drawDate = searchParams.get("drawDate");

  if (!number || !type) {
    return NextResponse.json(
      { error: "Missing number or type parameter" },
      { status: 400 },
    );
  }

  try {
    const data = await apiClient.checkNumber(
      number,
      type,
      drawDate || undefined,
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
