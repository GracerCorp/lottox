import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Let's first make sure there are core active countries set up
  let thaiCountry = await prisma.countries.upsert({
    where: { code: "TH" },
    update: {},
    create: {
      code: "TH",
      name: "Thailand",
      flag: "🇹🇭",
      is_active: true,
    },
  });

  let laoCountry = await prisma.countries.upsert({
    where: { code: "LA" },
    update: {},
    create: {
      code: "LA",
      name: "Laos",
      flag: "🇱🇦",
      is_active: true,
    },
  });

  // Ensure there are some lottery jobs
  let thaiLottoJob = await prisma.lottery_jobs.findFirst({
    where: { name: "THAI", country_id: thaiCountry.id },
  });
  if (!thaiLottoJob) {
    thaiLottoJob = await prisma.lottery_jobs.create({
      data: {
        name: "THAI",
        country_id: thaiCountry.id,
        url: "https://example.com/thai",
        cron_schedule: "0 16 1,16 * *",
      },
    });
  }

  // Insert some basic results matching the new schema
  // We use stringified JSON for full_data
  await prisma.lottery_results.create({
    data: {
      lottery_id: thaiLottoJob.id,
      draw_date: "2026-02-16",
      draw_period: "#40/2569",
      full_data: {
        first: "123456",
        last2: "99",
        last3f: ["111", "222"],
        last3b: ["333", "444"],
        adjacent: ["123455", "123457"],
      },
    },
  });

  let laoLottoJob = await prisma.lottery_jobs.findFirst({
    where: { name: "LAO", country_id: laoCountry.id },
  });
  if (!laoLottoJob) {
    laoLottoJob = await prisma.lottery_jobs.create({
      data: {
        name: "LAO",
        country_id: laoCountry.id,
        url: "https://example.com/lao",
        cron_schedule: "30 20 * * 1,3,5",
      },
    });
  }

  await prisma.lottery_results.create({
    data: {
      lottery_id: laoLottoJob.id,
      draw_date: "2026-02-13",
      draw_period: "#18/2569",
      full_data: {
        digit4: "4045",
        digit3: "045",
        digit2: "45",
      },
    },
  });

  console.log("Seed data inserted with new schema!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
