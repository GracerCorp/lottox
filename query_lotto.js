/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    include: {
        lottery_results: {
            take: 1,
            orderBy: { draw_date: "desc" },
            include: {
                result_verifications_result_verifications_lottery_result_idTolottery_results: {
                    take: 1,
                    orderBy: { created_at: "desc" }
                }
            }
        }
    }
  });

  for (const l of lotteries) {
    console.log(`Lottery: ${l.name}`);
    if (l.lottery_results && l.lottery_results.length > 0) {
        const r = l.lottery_results[0];
        const chosen = r.result_verifications_result_verifications_lottery_result_idTolottery_results[0]?.chosen_data;
        if (chosen) {
            console.log("CHOSEN:", JSON.stringify(chosen, null, 2).substring(0, 100));
        } else if (r.full_data) {
            console.log("FULL:", JSON.stringify(r.full_data, null, 2).substring(0, 200));
        }
    }
    console.log("===============================");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
