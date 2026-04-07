import { getLotteryCardData } from './src/lib/services/lotteryService';
import { getLotteriesByCountry } from './src/lib/services/lotteryService';
async function run() {
  console.time('getLotteriesByCountry');
  await getLotteriesByCountry('th');
  console.timeEnd('getLotteriesByCountry');

  console.time('getLotteryCardData');
  await getLotteryCardData('th');
  console.timeEnd('getLotteryCardData');
}
run().catch(console.error).finally(() => process.exit(0));
