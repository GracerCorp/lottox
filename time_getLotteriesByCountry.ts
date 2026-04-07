import { getLotteriesByCountry } from './src/lib/services/lotteryService';
async function run() {
  const t0 = Date.now();
  const res = await getLotteriesByCountry('th');
  console.log('Time taken:', Date.now() - t0, 'ms');
  console.log('Got', res ? 'something' : 'nothing');
  process.exit(0);
}
run();
