/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const results = await prisma.lottery_results.findMany({
    where: { lottery: { name: { contains: "Lao" } } },
    take: 5,
    include: {
      lottery: true,
      result_verifications_result_verifications_lottery_result_idTolottery_results: true
    }
  });

  for (const r of results) {
    console.log(`Lottery: ${r.lottery.name}`);
    console.log(`Verifications: ${r.result_verifications_result_verifications_lottery_result_idTolottery_results.length}`);
    const chosen = r.result_verifications_result_verifications_lottery_result_idTolottery_results[0]?.chosen_data;
    console.log('Chosen Data Keys: ', chosen ? Object.keys(chosen) : 'none');
    console.log('Full Data Keys: ', r.full_data ? Object.keys(r.full_data) : 'none');
    if (r.full_data) {
        console.log("Full Data structure keys:", Object.keys(r.full_data));
        if (r.full_data.lottery_result) {
            console.log("Has lottery_result!");
        }
        if (r.full_data.unified_result) {
            console.log("Has unified_result!");
        }
    }
    console.log('================');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
