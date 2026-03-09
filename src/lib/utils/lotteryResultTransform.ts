/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export function transformLotteryResult(rawData: any, t: any) {
  if (!rawData || !rawData.data || !rawData.data.prizes) {
    return null;
  }

  const getPrizeNumber = (
    d: any,
    names: string[],
    categories: string[] = [],
    fallbackOrder?: number,
  ) => {
    if (d?.prizes && Array.isArray(d.prizes)) {
      const p = d.prizes.find(
        (p: any) =>
          names.includes(p.prizeName) || categories.includes(p.category),
      );
      if (p) {
        const nums = p.winningNumbers || p.number;
        return Array.isArray(nums) ? nums : [nums];
      }
      if (fallbackOrder !== undefined) {
        const byOrder = d.prizes.find((p: any) => p.order === fallbackOrder);
        if (byOrder) {
          const nums = byOrder.winningNumbers || byOrder.number;
          return Array.isArray(nums) ? nums : [nums];
        }
      }
    }
    return undefined;
  };

  const getPrizeAmount = (
    d: any,
    names: string[],
    categories: string[] = [],
    fallbackOrder?: number,
  ) => {
    if (d?.prizes && Array.isArray(d.prizes)) {
      const p = d.prizes.find(
        (p: any) =>
          names.includes(p.prizeName) || categories.includes(p.category),
      );
      if (p) return String(p.amount || p.prizeAmount || p.reward || "");
      if (fallbackOrder !== undefined) {
        const byOrder = d.prizes.find((p: any) => p.order === fallbackOrder);
        if (byOrder)
          return String(
            byOrder.amount || byOrder.prizeAmount || byOrder.reward || "",
          );
      }
    }
    return undefined;
  };

  const p1Names = [
    "Prize 1",
    "รางวัลที่ 1",
    "Special Prize",
    "First Prize",
    "First Prize (4 Digits)",
  ];
  const p1Cats = ["prize_1", "prizeFirst", "prizeSpecial", "prize_4_digits"];
  const p1Num = getPrizeNumber(rawData.data, p1Names, p1Cats, 1) || [
    rawData?.first || rawData?.firstPrize,
  ];

  const firstPrize =
    p1Num && p1Num.length > 0 && p1Num[0] !== undefined
      ? String(p1Num[0])
      : "-";
  const firstPrizeAmountStr =
    getPrizeAmount(rawData.data, p1Names, p1Cats, 1) ||
    rawData?.firstPrizeAmount ||
    "6,000,000";

  let firstPrizeAmount = firstPrizeAmountStr;
  if (!isNaN(Number(firstPrizeAmountStr))) {
    firstPrizeAmount = Number(firstPrizeAmountStr).toLocaleString();
  }

  const isDynamic = rawData.type !== "THAI";

  // Static props for THAI
  const front3Num =
    getPrizeNumber(
      rawData.data,
      ["3 Front", "เลขหน้า 3 ตัว"],
      ["running_number_front_3"],
      2,
    ) ||
    rawData?.front3 ||
    [];
  const front3Amount =
    getPrizeAmount(
      rawData.data,
      ["3 Front", "เลขหน้า 3 ตัว"],
      ["running_number_front_3"],
      2,
    ) ||
    rawData?.front3Amount ||
    "4,000";

  const back3Num =
    getPrizeNumber(
      rawData.data,
      ["3 Back", "เลขท้าย 3 ตัว"],
      ["running_number_back_3"],
      3,
    ) ||
    rawData?.back3 ||
    [];
  const back3Amount =
    getPrizeAmount(
      rawData.data,
      ["3 Back", "เลขท้าย 3 ตัว"],
      ["running_number_back_3"],
      3,
    ) ||
    rawData?.back3Amount ||
    "4,000";

  const last2Num =
    getPrizeNumber(
      rawData.data,
      ["2 Back", "เลขท้าย 2 ตัว"],
      ["running_number_back_2"],
      4,
    ) || [rawData?.last2] ||
    [];
  const last2Str = last2Num[0] || "-";
  const last2Amount =
    getPrizeAmount(
      rawData.data,
      ["2 Back", "เลขท้าย 2 ตัว"],
      ["running_number_back_2"],
      4,
    ) ||
    rawData?.last2Amount ||
    "2,000";

  const adjacentNum =
    getPrizeNumber(
      rawData.data,
      ["Nearby Prize 1", "รางวัลข้างเคียงรางวัลที่ 1"],
      ["nearby_prize_1"],
      5,
    ) ||
    rawData?.adjacent ||
    [];
  const adjacentAmount =
    getPrizeAmount(
      rawData.data,
      ["Nearby Prize 1", "รางวัลข้างเคียงรางวัลที่ 1"],
      ["nearby_prize_1"],
      5,
    ) ||
    rawData?.adjacentAmount ||
    "100,000";

  const staticPrizes = isDynamic
    ? undefined
    : (rawData.data?.prizes || []).map((p: any) => ({
        name: p.prizeName || p.name,
        amount: String(p.prizeAmount || p.amount || 0),
        numbers: p.winningNumbers || p.numbers || [],
      }));

  const dynamicPrizes = isDynamic
    ? (rawData.data?.prizes || []).map((p: any) => ({
        prizeName: p.prizeName || p.name,
        prizeAmount: Number(p.prizeAmount || p.amount || 0),
        winningNumbers: p.winningNumbers || p.numbers || [],
        order: p.order,
        category: p.category,
        prizeCount: p.prizeCount,
      }))
    : undefined;

  return {
    date: rawData.drawDate || rawData.date || "",
    firstPrize,
    firstPrizeAmount,
    prizes: staticPrizes,
    dynamicPrizes,
    front3: front3Num,
    front3Amount,
    back3: back3Num,
    back3Amount,
    last2: last2Str,
    last2Amount,
    adjacent: adjacentNum,
    adjacentAmount,
    country: rawData.countryCode || "",
    lotteryName: rawData.lotteryName || "",
  };
}
