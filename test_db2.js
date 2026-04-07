const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.lottery_results.findFirst({
    where: { lottery_id: 1 },
    orderBy: { draw_date: 'desc' },
    include: { result_verifications_result_verifications_lottery_result_idTolottery_results: true }
  });
  if (result) {
    const chosen = result.result_verifications_result_verifications_lottery_result_idTolottery_results[0]?.chosen_data;
    console.log('Chosen:', JSON.stringify(chosen, null, 2));
    console.log('Full Data:', JSON.stringify(result.full_data, null, 2));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
