import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ── CSRF / Origin Validation ── */

const ALLOWED_ORIGINS = [
  "https://lottox.today",
  "https://www.lottox.today",
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
];

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function validateOrigin(request: NextRequest): NextResponse | null {
  if (!MUTATING_METHODS.has(request.method)) return null;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!origin) {
    // No origin — check referer (sendBeacon / same-origin fallback)
    if (referer) {
      const refererAllowed = ALLOWED_ORIGINS.some((o) => referer.startsWith(o));
      if (!refererAllowed) {
        return NextResponse.json(
          { error: "Forbidden: Invalid referer" },
          { status: 403 },
        );
      }
    }
    // No origin + no referer = same-origin (server component, curl, etc.)
    return null;
  }

  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { error: "Forbidden: Origin not allowed" },
      { status: 403 },
    );
  }

  return null; // Origin is valid
}

/* ── In-Memory Rate Limiter ── */

const inMemoryCache = new Map<string, { count: number; expires: number }>();

function rateLimit(request: NextRequest): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const windowMs = 60 * 1000; // 1 minute
  const maxLimit = request.nextUrl.pathname.startsWith("/api/subscribe")
    ? 10
    : request.nextUrl.pathname.startsWith("/api/results")
    ? 300 // higher limit for results endpoints
    : 100;

  // Bypass rate limiting in development mode
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  const now = Date.now();
  const entry = inMemoryCache.get(ip);
  let count = 1;

  if (entry) {
    if (now > entry.expires) {
      inMemoryCache.set(ip, { count: 1, expires: now + windowMs });
    } else {
      count = entry.count + 1;
      inMemoryCache.set(ip, { ...entry, count });
    }
  } else {
    inMemoryCache.set(ip, { count: 1, expires: now + windowMs });
  }

  if (count > maxLimit) {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 429 },
    );
  }

  return null;
}

/* ── Main Proxy ── */

export default function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 1. CSRF / Origin check (mutating requests only)
  const originBlock = validateOrigin(request);
  if (originBlock) return originBlock;

  // 2. Rate limiting (all API requests)
  const rateLimitBlock = rateLimit(request);
  if (rateLimitBlock) return rateLimitBlock;

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
