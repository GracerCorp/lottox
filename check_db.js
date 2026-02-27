// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    select: { id: true, name: true },
  });

  for (const lotto of lotteries) {
    const result = await prisma.lottery_results.findFirst({
      where: {
        lottery_id: lotto.id,
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          {
            some: { status: "verified" },
          },
      },
      include: {
        result_verifications_result_verifications_lottery_result_idTolottery_results:
          {
            where: { status: "verified" },
            take: 1,
          },
      },
    });

    if (
      result &&
      result
        .result_verifications_result_verifications_lottery_result_idTolottery_results
        .length > 0
    ) {
      console.log(`=== ${lotto.name} ===`);
      console.log(
        JSON.stringify(
          result
            .result_verifications_result_verifications_lottery_result_idTolottery_results[0]
            .chosen_data,
          null,
          2,
        ),
      );
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
