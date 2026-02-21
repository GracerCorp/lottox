import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiter
// For production serverless, use Redis (e.g. Upstash) instead
const rateLimit = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    // 1. Origin Check (Simple)
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");
    const host = request.headers.get("host"); // e.g., localhost:3000 or my-site.com

    // Allow requests from same origin (browser) or no origin (server-side fetch/curl tools if needed)
    // If strict origin check is needed:
    // if (origin && !origin.includes(host!)) { ... }

    // 2. Rate Limiting
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const now = Date.now();

    const limitData = rateLimit.get(ip) ?? { count: 0, lastReset: now };

    // Reset if window passed
    if (now - limitData.lastReset > RATE_LIMIT_WINDOW) {
      limitData.count = 0;
      limitData.lastReset = now;
    }

    limitData.count++;
    rateLimit.set(ip, limitData);

    if (limitData.count > MAX_REQUESTS) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests, please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
