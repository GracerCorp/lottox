import { apiClient } from "@/lib/services/lotteryResultService";

async function main() {
  const data = await apiClient.getGlobalResults({ limit: 5 });
  const lao = data.draws.find((d: { countryCode: string }) => d.countryCode === 'la');
  console.log(JSON.stringify(lao, null, 2));
}

main();
