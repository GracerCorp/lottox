import { NextResponse } from "next/server";
import { countryService } from "@/lib/services/countryService";

export async function GET() {
  try {
    const data = await countryService.getCountries();
    return NextResponse.json(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[API/Countries] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}


export const revalidate = 300;
