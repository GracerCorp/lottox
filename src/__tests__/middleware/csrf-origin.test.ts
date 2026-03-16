import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import proxy from "@/proxy";

function createRequest(
  method: string,
  url: string,
  headers: Record<string, string> = {},
): NextRequest {
  return new NextRequest(new URL(url, "https://lottox.today"), {
    method,
    headers,
  });
}

describe("Proxy — CSRF/Origin Validation", () => {
  it("allows GET requests through without origin check", () => {
    const res = proxy(createRequest("GET", "/api/results/latest"));
    expect(res.status).toBe(200);
  });

  it("allows POST with valid origin", () => {
    const res = proxy(
      createRequest("POST", "/api/subscribe", {
        origin: "https://lottox.today",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("blocks POST with unknown origin", async () => {
    const res = proxy(
      createRequest("POST", "/api/subscribe", {
        origin: "https://evil-site.com",
      }),
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Origin not allowed");
  });

  it("allows POST with no origin and no referer (same-origin)", () => {
    const res = proxy(createRequest("POST", "/api/articles/test/track"));
    expect(res.status).toBe(200);
  });

  it("allows POST with valid referer (sendBeacon)", () => {
    const res = proxy(
      createRequest("POST", "/api/articles/test/track", {
        referer: "https://lottox.today/news/some-article",
      }),
    );
    expect(res.status).toBe(200);
  });

  it("blocks POST with invalid referer", async () => {
    const res = proxy(
      createRequest("POST", "/api/subscribe", {
        referer: "https://evil-site.com/attack",
      }),
    );
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toContain("Invalid referer");
  });

  it("does not check non-api routes", () => {
    const res = proxy(
      createRequest("POST", "/news/submit", {
        origin: "https://evil-site.com",
      }),
    );
    expect(res.status).toBe(200);
  });
});
