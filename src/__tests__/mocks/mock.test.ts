import { describe, it, expect } from "vitest";

describe("MSW Mock Server", () => {
  it("should intercept /api/countries request and return mocked data", async () => {
    const res = await fetch("http://localhost/api/countries");
    const json = await res.json();
    
    expect(res.status).toBe(200);
    expect(json.countries).toHaveLength(1);
    expect(json.countries[0].name).toBe("Thailand");
    expect(json.countries[0].code).toBe("th");
  });
});
