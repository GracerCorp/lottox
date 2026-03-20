import { NextResponse, NextRequest } from "next/server";
import { newsService } from "@/lib/services/newsService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  lang: z.enum(["th", "en"]).default("th"),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Validate query params
    const validation = querySchema.safeParse({
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
      category: searchParams.get("category") || undefined,
      lang: searchParams.get("lang") || undefined,
      search: searchParams.get("search") || undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 },
      );
    }

    const { page, limit, category, search } = validation.data;

    const data = await newsService.getNews({
      page,
      limit,
      category,
      search,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "News");
  }
}


export const dynamic = "force-dynamic";
