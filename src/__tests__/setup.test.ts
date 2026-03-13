import { describe, it, expect } from "vitest";

describe("Test setup", () => {
  it("should run tests successfully", () => {
    expect(true).toBe(true);
  });

  it("should resolve path aliases", async () => {
    // Verify that the @ alias resolves correctly
    const utils = await import("@/lib/utils");
    expect(utils).toBeDefined();
  });
});
