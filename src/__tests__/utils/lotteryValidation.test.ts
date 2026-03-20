import { describe, it, expect } from "vitest";
import {
  getRule,
  validateNumber,
  _rules,
} from "@/lib/utils/lotteryValidation";

describe("lotteryValidation", () => {
  // ─── getRule ─────────────────────────────────────────────────────────────

  describe("getRule", () => {
    it("returns TH rule for 'th'", () => {
      const rule = getRule("th");
      expect(rule.digits).toBe(6);
      expect(rule.minDigits).toBe(6);
      expect(rule.placeholder).toBe("XXXXXX");
    });

    it("returns LA rule for 'la'", () => {
      const rule = getRule("la");
      expect(rule.digits).toBe(4);
      expect(rule.minDigits).toBe(4);
    });

    it("returns JP default rule for 'jp' without lottery name", () => {
      const rule = getRule("jp");
      expect(rule.digits).toBe(6);
    });

    it("returns Loto 7 rule when lottery name contains 'Loto 7'", () => {
      const rule = getRule("jp", "Japan Loto 7");
      expect(rule.digits).toBe(7);
      expect(rule.placeholder).toBe("XXXXXXX");
    });

    it("returns Mini Loto rule when lottery name contains 'Mini'", () => {
      const rule = getRule("jp", "Japan Mini Loto");
      expect(rule.digits).toBe(5);
      expect(rule.placeholder).toBe("XXXXX");
    });

    it("returns VN rule for 'vn'", () => {
      const rule = getRule("vn");
      expect(rule.digits).toBe(6);
    });

    it("returns AU rule for 'au' with minDigits=1", () => {
      const rule = getRule("au");
      expect(rule.digits).toBe(6);
      expect(rule.minDigits).toBe(1);
    });

    it("returns default rule for unknown country", () => {
      const rule = getRule("xx");
      expect(rule).toEqual(_rules.default);
    });

    it("is case-insensitive", () => {
      expect(getRule("TH").digits).toBe(6);
      expect(getRule("La").digits).toBe(4);
    });
  });

  // ─── validateNumber ──────────────────────────────────────────────────────

  describe("validateNumber", () => {
    // Thai
    it("accepts valid 6-digit Thai number", () => {
      expect(validateNumber("833009", "th")).toEqual({ valid: true });
    });

    it("rejects 5-digit Thai number", () => {
      const result = validateNumber("83300", "th");
      expect(result.valid).toBe(false);
    });

    it("rejects 7-digit Thai number", () => {
      const result = validateNumber("8330091", "th");
      expect(result.valid).toBe(false);
    });

    // Lao
    it("accepts valid 4-digit Lao number", () => {
      expect(validateNumber("1234", "la")).toEqual({ valid: true });
    });

    it("rejects 6-digit Lao number", () => {
      const result = validateNumber("123456", "la");
      expect(result.valid).toBe(false);
    });

    // Japan Loto 7
    it("accepts valid 7-digit Loto 7 number", () => {
      expect(validateNumber("1234567", "jp", "Japan Loto 7")).toEqual({
        valid: true,
      });
    });

    it("rejects 6-digit Loto 7 number", () => {
      const result = validateNumber("123456", "jp", "Japan Loto 7");
      expect(result.valid).toBe(false);
    });

    // Japan Mini Loto
    it("accepts valid 5-digit Mini Loto number", () => {
      expect(validateNumber("12345", "jp", "Japan Mini Loto")).toEqual({
        valid: true,
      });
    });

    // Australia — partial match
    it("accepts 2-digit AU number", () => {
      expect(validateNumber("12", "au")).toEqual({ valid: true });
    });

    it("accepts 6-digit AU number", () => {
      expect(validateNumber("123456", "au")).toEqual({ valid: true });
    });

    // Edge cases
    it("rejects empty string", () => {
      const result = validateNumber("", "th");
      expect(result.valid).toBe(false);
    });

    it("rejects non-numeric input", () => {
      const result = validateNumber("12AB56", "th");
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toMatch(/digits/i);
      }
    });

    it("uses default rule for unknown country", () => {
      // Default allows 2-6 digits
      expect(validateNumber("12", "xx")).toEqual({ valid: true });
      expect(validateNumber("123456", "xx")).toEqual({ valid: true });

      const tooShort = validateNumber("1", "xx");
      expect(tooShort.valid).toBe(false);
    });
  });
});
