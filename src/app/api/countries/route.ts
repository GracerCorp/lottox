import { NextResponse } from "next/server";
import { countryService } from "@/lib/services/countryService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";

export async function GET() {
  try {
    const data = await countryService.getCountries();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "Countries");
  }
}


export const revalidate = 300;
