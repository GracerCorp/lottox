/**
 * Country-specific lottery number validation rules.
 *
 * Each rule defines the expected digit count, regex pattern, placeholder,
 * and a human-readable description used in both the widget and API validation.
 */

/* ---------- Types ---------- */
export interface LotteryNumberRule {
  /** Exact number of digits the user must enter (for fixed-length lotteries) */
  digits: number;
  /** Min digits accepted (for variable-length like AU) */
  minDigits: number;
  /** Regex the final input must match */
  pattern: RegExp;
  /** Placeholder text shown in the input field */
  placeholder: string;
  /** Human-readable format description (e.g. "6 digits") */
  description: string;
}

/* ---------- Rules ---------- */

/**
 * Keyed by lowercase identifiers. Resolution order:
 * 1. Exact lottery key (e.g. "jp-loto7")
 * 2. Country code (e.g. "jp")
 * 3. "default" fallback
 */
const RULES: Record<string, LotteryNumberRule> = {
  // Thailand — GLO: exactly 6 digits
  th: {
    digits: 6,
    minDigits: 6,
    pattern: /^\d{6}$/,
    placeholder: "XXXXXX",
    description: "6 digits",
  },

  // Laos — Lao Lotto: exactly 4 digits
  la: {
    digits: 4,
    minDigits: 4,
    pattern: /^\d{4}$/,
    placeholder: "XXXX",
    description: "4 digits",
  },

  // Japan — Loto 6: exactly 6 digits
  jp: {
    digits: 6,
    minDigits: 6,
    pattern: /^\d{6}$/,
    placeholder: "XXXXXX",
    description: "6 digits",
  },

  // Japan — Loto 7: exactly 7 digits
  "jp-loto7": {
    digits: 7,
    minDigits: 7,
    pattern: /^\d{7}$/,
    placeholder: "XXXXXXX",
    description: "7 digits",
  },

  // Japan — Mini Loto: exactly 5 digits
  "jp-mini": {
    digits: 5,
    minDigits: 5,
    pattern: /^\d{5}$/,
    placeholder: "XXXXX",
    description: "5 digits",
  },

  // Vietnam — 6 digits
  vn: {
    digits: 6,
    minDigits: 6,
    pattern: /^\d{6}$/,
    placeholder: "XXXXXX",
    description: "6 digits",
  },

  // Australia — variable 1-6 digits (partial match on last N digits)
  au: {
    digits: 6,
    minDigits: 1,
    pattern: /^\d{1,6}$/,
    placeholder: "XXXXXX",
    description: "1-6 digits",
  },

  // Default fallback
  default: {
    digits: 6,
    minDigits: 2,
    pattern: /^\d{2,6}$/,
    placeholder: "XXXXXX",
    description: "2-6 digits",
  },
};

/* ---------- Public API ---------- */

/**
 * Look up the validation rule for a given lottery.
 *
 * @param countryCode - lowercase country code (e.g. "th", "jp")
 * @param lotteryName - optional lottery name for more specific matching
 *                      (e.g. "Japan Loto 7" → resolves to "jp-loto7")
 */
export function getRule(
  countryCode: string,
  lotteryName?: string,
): LotteryNumberRule {
  const cc = countryCode.toLowerCase();

  // Try lottery-specific key first (e.g. "jp-loto7", "jp-mini")
  if (lotteryName) {
    const name = lotteryName.toLowerCase();

    if (cc === "jp") {
      if (name.includes("loto 7") || name.includes("loto7")) {
        return RULES["jp-loto7"];
      }
      if (name.includes("mini")) {
        return RULES["jp-mini"];
      }
    }
  }

  // Try country code
  if (RULES[cc]) {
    return RULES[cc];
  }

  // Fallback
  return RULES.default;
}

/**
 * Validate a lottery number against the rules for a specific country/lottery.
 *
 * @returns `{ valid: true }` or `{ valid: false, error: string }`
 */
export function validateNumber(
  number: string,
  countryCode: string,
  lotteryName?: string,
): { valid: true } | { valid: false; error: string } {
  const rule = getRule(countryCode, lotteryName);

  if (!number || number.length === 0) {
    return { valid: false, error: "Number is required" };
  }

  // Must be digits only
  if (!/^\d+$/.test(number)) {
    return { valid: false, error: "Number must contain only digits" };
  }

  // Length check
  if (number.length < rule.minDigits) {
    return {
      valid: false,
      error: `Number must be at least ${rule.minDigits} digit${rule.minDigits > 1 ? "s" : ""}`,
    };
  }

  if (number.length > rule.digits) {
    return {
      valid: false,
      error: `Number must be at most ${rule.digits} digit${rule.digits > 1 ? "s" : ""}`,
    };
  }

  // Pattern check
  if (!rule.pattern.test(number)) {
    return { valid: false, error: `Invalid number format (expected ${rule.description})` };
  }

  return { valid: true };
}

/** Exposed for testing */
export const _rules = RULES;
