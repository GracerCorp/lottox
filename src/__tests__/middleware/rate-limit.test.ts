import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import proxy from "@/proxy";
import { NextRequest } from "next/server";

describe("Rate Limit Middleware", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should allow requests under the limit", () => {
    const req = new NextRequest("http://localhost:3000/api/results", {
      headers: new Headers({ "x-forwarded-for": "127.0.0.1" }),
    });

    const res = proxy(req);
    expect(res.status).not.toBe(429);
  });

  it("should block requests over the global limit (60)", () => {
    const req = new NextRequest("http://localhost:3000/api/results", {
      headers: new Headers({ "x-forwarded-for": "10.0.0.1" }),
    });

    for (let i = 0; i < 60; i++) {
      proxy(req);
    }
    
    // 61st request should be blocked
    const res = proxy(req);
    expect(res.status).toBe(429);
  });

  it("should have a stricter limit for subscribe route (10)", () => {
    const req = new NextRequest("http://localhost:3000/api/subscribe", {
      headers: new Headers({ "x-forwarded-for": "192.168.1.1" }),
    });

    for (let i = 0; i < 10; i++) {
      proxy(req);
    }
    
    // 11th request should be blocked
    const res = proxy(req);
    expect(res.status).toBe(429);
  });

  it("should reset the limit after the window expires", () => {
    const req = new NextRequest("http://localhost:3000/api/subscribe", {
      headers: new Headers({ "x-forwarded-for": "172.16.0.1" }),
    });

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
    const req = new NextRequest("http://localhost:3000/th");
    const res = proxy(req);
    // When nextUrl.pathname doesn't start with /api/, we just return NextResponse.next() 
    // which has status 200
    expect(res.status).toBe(200); 
  });
});

