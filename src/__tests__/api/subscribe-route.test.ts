import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/subscribe/route";

describe("/api/subscribe route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubEnv("NEXT_PUBLIC_CMS_API_URL", "https://cms.example.com");
  });

  function makeRequest(body: unknown) {
    return new Request("http://localhost/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ lotteryId: 1 }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 400 when lotteryId is missing", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({ email: "not-an-email", lotteryId: 1 }),
    );
    expect(res.status).toBe(400);
  });

  it("proxies to CMS on valid request", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const res = await POST(
      makeRequest({ email: "test@example.com", lotteryId: 5 }),
    );

    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalledOnce();

    // Verify the URL ends with /api/v1/users/_/subscriptions
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toMatch(/\/api\/v1\/users\/_\/subscriptions$/);

    // Verify the body sent to CMS contains the correct data
    const calledInit = fetchSpy.mock.calls[0][1];
    expect(calledInit?.method).toBe("POST");
    const sentBody = JSON.parse(calledInit?.body as string);
    expect(sentBody.email).toBe("test@example.com");
    expect(sentBody.lotteryId).toBe(5);
  });

  it("returns 500 when CMS responds with error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const res = await POST(
      makeRequest({ email: "test@example.com", lotteryId: 1 }),
    );
    expect(res.status).toBe(500);
  });

  it("returns 500 when CMS is unreachable", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    const res = await POST(
      makeRequest({ email: "test@example.com", lotteryId: 1 }),
    );
    expect(res.status).toBe(500);
  });
});
