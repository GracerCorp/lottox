import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fallback rate limiter for when environment variables are missing for Redis
// In memory map for basic rate limiting
const inMemoryCache = new Map<string, { count: number; expires: number }>();

export default function proxy(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
  
  // Rate limiting configuration
  const config = {
    windowMs: 60 * 1000, // 1 minute
    maxLimit: request.nextUrl.pathname.startsWith("/api/subscribe") ? 10 : 60, // 10 reqs for subscribe, 60 for others
  };

  const now = Date.now();
  const cacheData = inMemoryCache.get(ip);
  let count = 1;

  if (cacheData) {
    if (now > cacheData.expires) {
      // Window expired, reset
      inMemoryCache.set(ip, { count: 1, expires: now + config.windowMs });
    } else {
      // Still in window, increment
      count = cacheData.count + 1;
      inMemoryCache.set(ip, { ...cacheData, count });
    }
  } else {
    // New IP entry
    inMemoryCache.set(ip, { count: 1, expires: now + config.windowMs });
  }

  // Add CORS headers and rate limit status
  const response = count > config.maxLimit
    ? NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 })
    : NextResponse.next();
    
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
