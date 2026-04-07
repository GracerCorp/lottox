const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const results = await prisma.lottery_results.findMany({
    where: { lottery: { name: { contains: "Thai" } } },
    take: 1,
    include: {
      lottery: true,
      result_verifications_result_verifications_lottery_result_idTolottery_results: true
    }
  });

  for (const r of results) {
    console.log(`Lottery: ${r.lottery.name}`);
    const chosen = r.result_verifications_result_verifications_lottery_result_idTolottery_results[0]?.chosen_data;
    console.log('Chosen Data Keys: ', chosen ? Object.keys(chosen) : 'none');
    if (chosen?.prizes) {
      console.log('Prizes:', JSON.stringify(chosen.prizes, null, 2));
    }
    console.log('Full Data Keys: ', r.full_data ? Object.keys(r.full_data) : 'none');
    console.log('================');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
