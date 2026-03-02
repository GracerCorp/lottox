export const mockCountries = [
  {
    id: 1,
    code: "th",
    name: "Thai",
    flag: "https://flagcdn.com/w40/th.png",
    draw_schedule: "1st & 16th of every month",
    is_active: true,
    lotteries: [
      {
        id: 1,
        name: "Thai Government Lottery",
        currency: "THB",
        is_active: true,
      },
      {
        id: 2,
        name: "Thai Govt Lottery (VIP)",
        currency: "THB",
        is_active: true,
      },
    ],
  },
  {
    id: 2,
    code: "la",
    name: "Lao",
    flag: "https://flagcdn.com/w40/la.png",
    draw_schedule: "Monday, Wednesday, Friday",
    is_active: true,
    lotteries: [
      {
        id: 3,
        name: "Lao Development Lottery",
        currency: "LAK",
        is_active: true,
      },
    ],
  },
  {
    id: 3,
    code: "vn",
    name: "Vietnam",
    flag: "https://flagcdn.com/w40/vn.png",
    draw_schedule: "Daily at 18:00",
    is_active: true,
    lotteries: [
      {
        id: 4,
        name: "Vietnam Lottery (Northern)",
        currency: "VND",
        is_active: true,
      },
    ],
  },
];

export const mockBanners = [
  {
    id: 1,
    image_url:
      "https://images.unsplash.com/photo-1668107710159-10fbbab2a9dd?q=80&w=1287&auto=format&fit=crop",
    is_active: true,
    lottery_results: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lottery: mockCountries[0].lotteries[0] as any,
    },
  },
];

export const mockLatestResults = [
  {
    id: 1,
    type: "THAI",
    date: "2024-03-01",
    drawDate: "2024-03-01",
    drawNo: "1",
    data: {
      prizes: {
        "1st_prize": { numbers: ["123456"] },
        "2nd_prize": { numbers: ["234567"] },
        "3rd_prize": { numbers: ["345678"] },
      },
    },
    lotteryName: "Thai Government Lottery",
    countryCode: "th",
    showingPrizes: ["1st_prize", "2nd_prize"],
  },
];
