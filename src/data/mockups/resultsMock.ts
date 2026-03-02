export const mockGlobalResults = {
  draws: [
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
        },
      },
      lotteryName: "Thai Government Lottery",
      countryCode: "th",
      showingPrizes: ["1st_prize", "2nd_prize"],
    },
    {
      id: 2,
      type: "LAO",
      date: "2024-03-01",
      drawDate: "2024-03-01",
      drawNo: "2",
      data: {
        prizes: {
          "4_digit": { numbers: ["4567"] },
          "3_digit": { numbers: ["567"] },
        },
      },
      lotteryName: "Lao Development Lottery",
      countryCode: "la",
      showingPrizes: ["4_digit", "3_digit"],
    },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
};
