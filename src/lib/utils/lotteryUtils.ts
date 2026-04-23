export type GenericPrizeItem = {
  prizeName?: string;
  category?: string;
  number?: string | string[];
  winningNumbers?: string[];
  amount?: string | number;
  prizeAmount?: string | number;
  reward?: string | number;
  order?: number;
  [key: string]: unknown;
};

export type GenericPrizeData = {
  prizes?: GenericPrizeItem[];
  // Dynamic lottery JSON — index must remain `any` because schemas vary by country
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const getPrizeNumber = (
  d: GenericPrizeData,
  names: string[],
  categories: string[] = [],
  fallbackOrder?: number
) => {
  if (d?.prizes && Array.isArray(d.prizes)) {
    const p = d.prizes.find(
      (p: GenericPrizeItem) => 
        (p.prizeName && names.includes(p.prizeName)) || 
        (p.category && categories.includes(p.category))
    );
    if (p) {
      const nums = p.winningNumbers || p.number;
      return Array.isArray(nums) ? nums : typeof nums !== "undefined" ? [nums] : undefined;
    }
    // Fallback: match by order field
    if (fallbackOrder !== undefined) {
      const byOrder = d.prizes.find((p: GenericPrizeItem) => p.order === fallbackOrder);
      if (byOrder) {
        const nums = byOrder.winningNumbers || byOrder.number;
        return Array.isArray(nums) ? nums : typeof nums !== "undefined" ? [nums] : undefined;
      }
    }
  }
  return undefined;
};

export const getPrizeAmount = (
  d: GenericPrizeData,
  names: string[],
  categories: string[] = [],
  fallbackOrder?: number
) => {
  if (d?.prizes && Array.isArray(d.prizes)) {
    const p = d.prizes.find(
      (p: GenericPrizeItem) => 
        (p.prizeName && names.includes(p.prizeName)) || 
        (p.category && categories.includes(p.category))
    );
    if (p) return String(p.amount || p.prizeAmount || p.reward || "");
    // Fallback: match by order field
    if (fallbackOrder !== undefined) {
      const byOrder = d.prizes.find((p: GenericPrizeItem) => p.order === fallbackOrder);
      if (byOrder)
        return String(
          byOrder.amount || byOrder.prizeAmount || byOrder.reward || ""
        );
    }
  }
  return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPrizeName = (pName: string, pCat: string | undefined, t: Record<string, any>, isLao?: boolean): string => {
  const name = pName || "";
  const cat = pCat || "";

  // Lao mappings
  if (isLao) {
    if (cat === "prize_1" || name === "prize_1" || cat === "prize_4_digits" || name === "prize_4_digits")
      return "Match 4 (6,000x Bet)";
    if (cat === "prize_2_digits" || name === "prize_2_digits") return "Match 2 (60x Bet)";
    if (cat === "prize_3_digits" || name === "prize_3_digits") return "Match 3 (500x Bet)";
    if (cat === "prize_modern_5" || name === "prize_modern_5") return t.results.prize_modern_5;
  } else {
    if (cat === "prize_2_digits" || name === "prize_2_digits") return t.results.prize_2_digits;
    if (cat === "prize_3_digits" || name === "prize_3_digits") return t.results.prize_3_digits;
    if (cat === "prize_4_digits" || name === "prize_4_digits") return t.results.prize_4_digits;
    if (cat === "prize_modern_5" || name === "prize_modern_5") return t.results.prize_modern_5;
  }

  // Thai mappings
  if (cat === "prize_1" || name === "prize_1") return t.results.prize_1_thai;
  if (cat === "prize_2" || name === "prize_2") return t.results.prize2rank;
  if (cat === "prize_3" || name === "prize_3") return t.results.prize3rank;
  if (cat === "prize_4" || name === "prize_4") return t.results.prize4rank;
  if (cat === "prize_5" || name === "prize_5") return t.results.prize5rank;
  if (cat === "running_number_front_3" || name === "running_number_front_3" || name === "3 Front")
    return t.results.running_number_front_3;
  if (cat === "running_number_back_3" || name === "running_number_back_3" || name === "3 Back")
    return t.results.running_number_back_3;
  if (cat === "running_number_back_2" || name === "running_number_back_2" || name === "2 Back")
    return t.results.running_number_back_2;
  if (cat === "nearby_prize_1" || name === "nearby_prize_1") return t.results.nearby_prize_1;

  return name;
};

// Deterministic date formatter — avoids toLocaleDateString hydration mismatches
const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_TH = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const DAYS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_TH = ["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ","วันพฤหัสบดี","วันศุกร์","วันเสาร์"];

export const formatDateDisplay = (dateStr: string, language: string) => {
  if (!dateStr || dateStr === "-") return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const day = d.getUTCDate();
    const monthIdx = d.getUTCMonth();
    const year = d.getUTCFullYear();
    const dayOfWeek = d.getUTCDay();

    if (language === "th") {
      const buddhistYear = year + 543;
      return `${DAYS_TH[dayOfWeek]} ${day} ${MONTHS_TH[monthIdx]} ${buddhistYear}`;
    }
    return `${DAYS_EN[dayOfWeek]}, ${MONTHS_EN[monthIdx]} ${day}, ${year}`;
  } catch {
    return dateStr;
  }
};

/** Short date format for table rows — deterministic, no locale dependency */
export const formatDateShort = (dateStr: string, language: string) => {
  if (!dateStr || dateStr === "-") return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    const day = d.getUTCDate();
    const monthIdx = d.getUTCMonth();
    const MONTHS_SHORT_EN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const MONTHS_SHORT_TH = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

    if (language === "th") {
      return `${day} ${MONTHS_SHORT_TH[monthIdx]}`;
    }
    return `${MONTHS_SHORT_EN[monthIdx]} ${day}, ${d.getUTCFullYear()}`;
  } catch {
    return dateStr;
  }
};

export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
