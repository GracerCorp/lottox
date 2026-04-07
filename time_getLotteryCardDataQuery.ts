import { prisma } from './src/lib/prisma';
async function run() {
  console.log('starting query');
  const t0 = Date.now();
  const lotteries = await prisma.lotteries.findMany({
    where: {
      is_active: true,
      countries: { code: { equals: "th", mode: "insensitive" } },
    },
    include: {
      countries: { select: { code: true, name: true, flag: true, bg_image: true } },

      lottery_jobs: {
        where: { status: "active" },
        take: 1,
        select: { cron_schedule: true },
      },
      lottery_results: {
        orderBy: { draw_date: "desc" },
        take: 1,
        include: {
          result_verifications_result_verifications_lottery_result_idTolottery_results:
            {
              where: { status: "verified" },
              orderBy: { created_at: "desc" },
              take: 1,
              select: { chosen_data: true },
            },
        },
      },
    },
  });
  console.log('Time taken:', Date.now() - t0, 'ms');
  process.exit(0);
}
run();
