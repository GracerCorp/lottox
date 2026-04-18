import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

// We need to control NODE_ENV for the rate limiter
// The proxy skips rate limiting in development, so we stub env to production

describe("Rate Limit Middleware", () => {
  let proxy: (req: NextRequest) => ReturnType<typeof import("next/server").NextResponse.next>;

  beforeEach(async () => {
    vi.useFakeTimers();
    // Force production mode so rate limiting actually works
    vi.stubEnv("NODE_ENV", "production");
    // Re-import to pick up the env change (clear module cache)
    vi.resetModules();
    const mod = await import("@/proxy");
    proxy = mod.default;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  function makeReq(url: string, ip = "127.0.0.1") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { NextRequest } = require("next/server");
    return new NextRequest(url, {
      headers: new Headers({ "x-forwarded-for": ip }),
    });
  }

  it("should allow requests under the limit", () => {
    const req = makeReq("http://localhost:3000/api/results", "10.0.0.100");
    const res = proxy(req);
    expect(res.status).not.toBe(429);
  });

  it("should block requests over the results limit (300)", () => {
    const req = makeReq("http://localhost:3000/api/results", "10.0.0.2");
    for (let i = 0; i < 300; i++) {
      proxy(req);
    }
    // 301st request should be blocked
    const res = proxy(req);
    expect(res.status).toBe(429);
  });

  it("should have a stricter limit for subscribe route (10)", () => {
    const req = makeReq("http://localhost:3000/api/subscribe", "192.168.1.1");
    for (let i = 0; i < 10; i++) {
      proxy(req);
    }
    // 11th request should be blocked
    const res = proxy(req);
    expect(res.status).toBe(429);
  });

  it("should reset the limit after the window expires", () => {
    const req = makeReq("http://localhost:3000/api/subscribe", "172.16.0.1");
    for (let i = 0; i < 10; i++) {
      proxy(req);
    }
    // Blocked
    expect(proxy(req).status).toBe(429);

    // Advance time by 61 seconds
    vi.advanceTimersByTime(61000);
    
    // Should be allowed again
    const res = proxy(req);
    expect(res.status).not.toBe(429);
  });

  it("should bypass non-API routes", () => {
    const req = makeReq("http://localhost:3000/th", "10.0.0.99");
    const res = proxy(req);
    expect(res.status).toBe(200); 
  });
});
