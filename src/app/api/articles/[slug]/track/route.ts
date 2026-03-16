import { NextRequest, NextResponse } from "next/server";
import { newsService } from "@/lib/services/newsService";
import { handleApiError } from "@/lib/utils/apiErrorHandler";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Check if credentials exist before initializing to prevent build errors
const isRateLimiterReady = !!(
  process.env.KV_REST_API_URL && process.env.REDIS_URL
);

const ratelimit = isRateLimiterReady
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 tracking events per minute per IP
      analytics: true,
      prefix: "@upstash/ratelimit/track",
    })
  : null;

const trackingSchema = z.object({
  views: z.number().int().min(0).max(10).optional(),
  activeSeconds: z.number().int().min(0).max(86400).optional(),
  scrollCompletes: z.number().int().min(0).max(100).optional(),
  bounceRate: z.number().min(0).max(1).optional(),
  shareClick: z.boolean().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    if (ratelimit) {
      // Use standard header fallback for IP
      const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success, limit, reset, remaining } = await ratelimit.limit(
        `track_${ip}`,
      );

      if (!success) {
        return NextResponse.json(
          { error: "Too many tracking events" },
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString(),
            },
          },
        );
      }
    }

    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const rawBody = await request.json();
    const parsed = trackingSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tracking payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await newsService.trackAnalytics(slug, parsed.data);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error, "Articles/Track");
  }
}
