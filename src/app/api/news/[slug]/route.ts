import { NextResponse } from "next/server";
import { newsService } from "@/lib/services/newsService";
import type { NextRequest } from "next/server";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { z } from "zod";

const paramsSchema = z.object({
  slug: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const lang = searchParams.get("lang") || "th";

    // Validate params using zod
    const paramsValidation = paramsSchema.safeParse({ slug });
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid article slug" },
        { status: 400 },
      );
    }

    const data = await newsService.getNewsDetail(slug, lang);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return handleApiError(error, "News/Detail");
  }
}



export const revalidate = 300;
