import { NextResponse } from "next/server";
import { apiClient } from "@/lib/services/lotteryResultService";

export async function GET() {
  try {
    const data = await apiClient.getCountries();
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
