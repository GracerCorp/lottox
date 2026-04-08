/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    include: {
      countries: true
    }
  });
  console.log("Lotteries:", lotteries.map(l => ({ id: l.id, name: l.name, country: l.countries?.name })));

  const res = await prisma.lottery_results.findFirst({
    where: { lottery: { countries: { code: 'th' } } },
    include: {
      result_verifications_result_verifications_lottery_result_idTolottery_results: true
    },
    orderBy: { draw_date: 'desc' }
  });
  console.log("TH result payload length:", JSON.stringify(res.full_data).length);
  if (res.result_verifications_result_verifications_lottery_result_idTolottery_results.length > 0) {
    console.log("TH verification chosen_data length:", JSON.stringify(res.result_verifications_result_verifications_lottery_result_idTolottery_results[0].chosen_data).length);
    console.log("TH verification chosen_data:", JSON.stringify(res.result_verifications_result_verifications_lottery_result_idTolottery_results[0].chosen_data, null, 2).slice(0, 500));
  } else {
    console.log("TH full_data:", JSON.stringify(res.full_data, null, 2).slice(0, 500));
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
