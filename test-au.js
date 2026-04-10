const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const lotteries = await prisma.lotteries.findMany({
    where: { 
      countries: { code: { equals: "au", mode: "insensitive" } } 
    }
  });

  for (const lo of lotteries) {
     console.log(`\n=== Lottery: ${lo.name} ===`);
     const results = await prisma.lottery_results.findMany({
       where: { lottery_id: lo.id },
       orderBy: { draw_date: "desc" },
       take: 2,
       include: {
         result_verifications_result_verifications_lottery_result_idTolottery_results: true
       }
     });
     if (results.length === 0) {
        console.log("  No results found in DB!");
     }
     for(const r of results) {
        console.log(`  Draw Date: ${r.draw_date}, Draw Number: ${r.draw_period}`);
        console.log(`  Verifications count: ${r.result_verifications_result_verifications_lottery_result_idTolottery_results.length}`);
        for(const v of r.result_verifications_result_verifications_lottery_result_idTolottery_results) {
           console.log(`    -> Status: ${v.status}`);
        }
     }
  }
}
main().catch(console.error).finally(()=>prisma.$disconnect());
