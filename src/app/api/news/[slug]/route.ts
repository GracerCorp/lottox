import { NextResponse } from "next/server";
import { newsService } from "@/lib/services/newsService";
import type { NextRequest } from "next/server";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Error (News Detail):", error);
    return NextResponse.json(
      { error: "Failed to fetch news detail" },
      { status: 500 },
    );
  }
}



export const revalidate = 300;
