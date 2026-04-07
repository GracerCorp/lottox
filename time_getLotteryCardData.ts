import { getLotteryCardData } from './src/lib/services/lotteryService';
async function run() {
  console.log('starting');
  const t0 = Date.now();
  const res = await getLotteryCardData('th');
  console.log('Time taken:', Date.now() - t0, 'ms');
  process.exit(0);
}
run();
