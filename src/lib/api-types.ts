/* ── Shared API Response Types ── */

/** Standard error response shape returned by handleApiError */
export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

/** Wrapper for paginated API responses */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/* ── Types for External API Responses ── */

// GET /api/results/latest
export interface LatestResultsResponse {
  results: LatestResult[];
}

export interface LatestResult {
  id: number;
  type: string; // "THAI" | "LAO" | "VIETNAM_SPECIFIC" | "VIETNAM_SPECIAL" | "VIETNAM_NORMAL" | "VIETNAM_VIP"
  date: string;
  drawDate: string;
  drawNo: string;
  data: ThaiResultData | LaoResultData | VietnamResultData;
  lotteryName?: string;
  countryCode?: string;
  logo?: string | null;
  showingPrizes?: string[];
}

// Thai Data shape
export interface ThaiResultData {
  firstPrize: string;
  firstPrizeAmount: string;
  front3: string[];
  front3Amount: string;
  back3: string[];
  back3Amount: string;
  last2: string;
  last2Amount: string;
  adjacent?: string[];
  adjacentAmount?: string;
  prize2?: string[];
  prize2Amount?: string;
  prize3?: string[];
  prize3Amount?: string;
  prize4?: string[];
  prize4Amount?: string;
  prize5?: string[];
  prize5Amount?: string;
}

// Lao Data shape
export interface LaoResultData {
  digit4: string;
  digit4Multiplier: string;
  digit3: string;
  digit3Multiplier: string;
  digit2: string;
  digit2Multiplier: string;
  digit1?: string;
  digit1Multiplier?: string;
  animals?: { name: string; number: string; icon?: string; translation?: string }[] | string[];
}

// Vietnam Data shape
export interface VietnamResultData {
  digit4: string;
  digit3: string;
  digit2: string;
  digit2Bottom: string;
}

// GET /api/results/{type}
export interface ResultsByTypeResponse {
  latest: {
    id: number;
    type: string;
    date: string;
    dateDisplay: string;
    drawNo: string;
    daysAgo: string;
    data: ThaiResultData | LaoResultData | VietnamResultData;
    fullData?: any;
  };
  history: {
    date: string;
    dateDisplay: string;
    drawNo: string;
    data: ThaiResultData | LaoResultData | VietnamResultData;
    fullData?: any;
  }[];
  total: number;
}

// GET /api/results/global
export interface GlobalResultsResponse {
  draws: GlobalDraw[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GlobalDraw {
  id: number;
  time: string;
  country: string;
  countryCode: string;
  name: string;
  numbers: string[];
  special: string | null;
  jackpot: string;
  drawDate: string;
  status: string;
  fullData?: any;
}

// GET /api/check
export interface CheckNumberResponse {
  win: boolean;
  prize: string | null;
  prizeLabel: string | null;
  amount: string | null;
  drawDate: string;
  drawNo: string;
}

// GET /api/countries
export interface CountriesResponse {
  countries: CountryInfo[];
}

export interface CountryInfo {
  code: string;
  name: string;
  lottoName: string;
  flag: string;
  nextDraw: string | null;
  jackpot: string | null;
  drawSchedule: string;
  odds: string;
}

// GET /api/lotteries
export interface LotteriesListResponse {
  countries: LotteryCountryGroup[];
}

export interface LotteryCountryGroup {
  code: string;
  name: string;
  region?: string | null;
  flag: string | null;
  lotteries: LotteryItem[];
}

export interface LotteryItem {
  id: number;
  name: string;
  logo: string | null;
}

export interface PinnedLottery {
  lotteryId: number;
  lotteryName: string;
  logo: string | null;
  countryCode: string;
}

// GET /api/news
export interface NewsListResponse {
  articles: NewsArticle[];
  total: number;
  page: number;
  totalPages: number;
}

export interface NewsArticle {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  image: string;
  date: string;
  category: string;
  categoryEn?: string;
  author: string;
}

// GET /api/news/{slug}
export interface NewsDetailResponse {
  slug: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  excerpt?: string;
  excerptEn?: string;
  image: string;
  date: string;
  category: string;
  categoryEn?: string;
  author: string;
  source: string;
  related: string[];
  relatedLottery?: {
    type: string;
    name: string;
    countryCode: string;
  };
}

// GET /api/statistics/overview
export interface StatsOverviewResponse {
  totalJackpotsTracked: string;
  activeLotteries: number;
  upcomingDraws24h: number;
  totalCountries: number;
}

// GET /api/statistics/frequency
export interface StatsFrequencyResponse {
  type: string;
  draws: number;
  frequency: {
    last2?: { number: string; count: number }[];
    last3?: { number: string; count: number }[];
    front3?: { number: string; count: number }[];
    first?: { number: string; count: number }[];
  };
  trends: {
    evenOddRatio: string;
    mostFrequentStartDigit: string;
  };
}
