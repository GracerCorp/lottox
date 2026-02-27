"use client";

import { DrawResult } from "@/components/lottery/DrawResult";
import { useApi } from "@/lib/hooks/useApi";

interface DrawDetailContentProps {
  country: string;
  lottery: string;
  date: string;
}

export default function DrawDetailContent({
  country,
  lottery,
  date,
}: DrawDetailContentProps) {
  // Fetching data. Assuming API endpoint supports date filter or single result
  // If not, we might need to fetch history and find the date, or use a specific endpoint
  // For now, let's assume we can fetch by date: /api/results/{lottery}/{date}
  // OR if the API is /api/results/{lottery} we might need to filter.
  // Let's try to fetch specific draw endpoint if it exists, or fallback to filtering.

  // Based on api-types check, there is no explicit strict date endpoint documented yet fully,
  // but let's assume /api/results/{type}/{date} might be implemented or we can implement it.
  // For now, I will use a placeholder fetch.

  // Constructing a hypothetical endpoint
  const endpoint = `/api/results/${lottery}/${date}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, loading, error } = useApi<any>(endpoint); // using any for now as response shape for single draw might vary

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-900 dark:text-white">
        Loading draw details...
      </div>
    );
  }

  if (error || !data) {
    // Return a basic placeholder if API fails or not impl yet
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-navy-900 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Results for {date}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Could not load specific results for this date (API: {endpoint})
          </p>
        </div>
      </div>
    );
  }

  // Normalize data
  // Assuming data structure similar to what we passed to DrawResult
  // If data returned is single object
  const resultData = data.data || data;

  const getPrizeNum = (category: string, names: string[]) => {
    if (resultData?.prizes && Array.isArray(resultData.prizes)) {
      const p = resultData.prizes.find(
        (x: any) =>
          x.category === category ||
          x.id === category ||
          names.includes(x.prizeName),
      );
      if (p) {
        const v = p.winningNumbers || p.number;
        return Array.isArray(v) ? v : [v];
      }
    }
    return null;
  };

  const getPrizeAmount = (category: string, names: string[]) => {
    if (resultData?.prizes && Array.isArray(resultData.prizes)) {
      const p = resultData.prizes.find(
        (x: any) =>
          x.category === category ||
          x.id === category ||
          names.includes(x.prizeName),
      );
      return p?.amount || p?.prizeAmount || p?.reward || "";
    }
    return "";
  };

  const p1Names = ["Prize 1", "รางวัลที่ 1", "Special Prize"];
  const p1Num = getPrizeNum("prize_1", p1Names) ||
    getPrizeNum("prizeFirst", p1Names) || [
      resultData?.first || resultData?.firstPrize,
    ];
  const firstPrize =
    p1Num && p1Num.length > 0 && p1Num[0] !== undefined ? p1Num[0] : "-";
  const firstPrizeAmount =
    getPrizeAmount("prize_1", p1Names) ||
    getPrizeAmount("prizeFirst", p1Names) ||
    resultData?.firstPrizeAmount ||
    "6,000,000";

  const pFront3Names = ["3 Front", "เลขหน้า 3 ตัว", "รางวัลเลขหน้า 3 ตัว"];
  const front3Num =
    getPrizeNum("running_number_front_3", pFront3Names) ||
    getPrizeNum("prizeLast3Front", pFront3Names) ||
    resultData?.first3?.number ||
    resultData?.last3f ||
    resultData?.front3 ||
    [];

  const pBack3Names = ["3 Back", "เลขท้าย 3 ตัว", "รางวัลเลขท้าย 3 ตัว"];
  const back3Num =
    getPrizeNum("running_number_back_3", pBack3Names) ||
    getPrizeNum("prizeLast3Back", pBack3Names) ||
    resultData?.last3?.number ||
    resultData?.last3b ||
    resultData?.back3 ||
    [];

  const p2Names = ["2 Bottom", "เลขท้าย 2 ตัว", "รางวัลเลขท้าย 2 ตัว"];
  const l2Num = getPrizeNum("running_number_back_2", p2Names) ||
    getPrizeNum("prizeLast2", p2Names) ||
    resultData?.last2?.number || [resultData?.last2];
  const last2 = Array.isArray(l2Num) ? l2Num[0] : l2Num;

  const pAdjNames = [
    "Adjacent Prizes",
    "รางวัลข้างเคียงรางวัลที่ 1",
    "รางวัลข้างเคียง",
  ];
  const adjacentNum =
    getPrizeNum("nearby_prize_1", pAdjNames) || resultData?.adjacent || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
          {country} - {lottery.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Draw Date: {date}</p>
      </div>

      <DrawResult
        country={country}
        lotteryName={lottery.replace(/-/g, " ").toUpperCase()}
        date={date}
        drawId={data.drawNo || resultData.drawNo || "-"}
        firstPrize={String(firstPrize || "-")}
        firstPrizeAmount={String(firstPrizeAmount)}
        front3={(Array.isArray(front3Num) ? front3Num : [front3Num])
          .map(String)
          .filter((s) => s !== "undefined")}
        front3Amount={String(
          getPrizeAmount("running_number_front_3", pFront3Names) ||
            getPrizeAmount("prizeLast3Front", pFront3Names) ||
            resultData?.first3?.amount ||
            resultData?.front3Amount ||
            "4,000",
        )}
        back3={(Array.isArray(back3Num) ? back3Num : [back3Num])
          .map(String)
          .filter((s) => s !== "undefined")}
        back3Amount={String(
          getPrizeAmount("running_number_back_3", pBack3Names) ||
            getPrizeAmount("prizeLast3Back", pBack3Names) ||
            resultData?.last3?.amount ||
            resultData?.back3Amount ||
            "4,000",
        )}
        last2={String(last2 || "-")}
        last2Amount={String(
          getPrizeAmount("running_number_back_2", p2Names) ||
            getPrizeAmount("prizeLast2", p2Names) ||
            resultData?.last2?.amount ||
            resultData?.last2Amount ||
            "2,000",
        )}
        adjacent={(Array.isArray(adjacentNum) ? adjacentNum : [adjacentNum])
          .map(String)
          .filter((s) => s !== "undefined")}
        adjacentAmount={String(
          getPrizeAmount("nearby_prize_1", pAdjNames) ||
            resultData?.adjacentAmount ||
            "100,000",
        )}
      />
    </div>
  );
}
