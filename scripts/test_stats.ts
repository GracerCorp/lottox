import { apiClient } from "../src/lib/services/lotteryResultService";

async function main() {
  console.log("--- Testing getStatsOverview ---");
  const overview = await apiClient.getStatsOverview();
  console.log(JSON.stringify(overview, null, 2));

  console.log("\n--- Testing getStatsFrequency (th) ---");
  const freqTh = await apiClient.getStatsFrequency("th", 5);
  console.log(`Trends (th, 5 draws):`);
  console.log("Hot:", freqTh.trends.hot);
  console.log("Cold:", freqTh.trends.cold);
  console.log("Total unique numbers found:", Object.keys(freqTh.frequency).length);

  console.log("\n--- Testing getStatsFrequency (la) ---");
  const freqLao = await apiClient.getStatsFrequency("la", 5);
  console.log(`Trends (la, 5 draws):`);
  console.log("Hot:", freqLao.trends.hot);
  console.log("Cold:", freqLao.trends.cold);
  console.log("Total unique numbers found:", Object.keys(freqLao.frequency).length);
}

main().catch(console.error);
