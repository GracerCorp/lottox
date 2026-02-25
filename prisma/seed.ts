import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Let's first make sure there are core active countries set up
  const thaiCountry = await prisma.countries.upsert({
    where: { code: "th" },
    update: {},
    create: {
      code: "th",
      name: "Thailand",
      flag: "https://flagcdn.com/w320/th.png",
      is_active: true,
    },
  });

  const laoCountry = await prisma.countries.upsert({
    where: { code: "la" },
    update: {},
    create: {
      code: "la",
      name: "Laos",
      flag: "https://flagcdn.com/w320/la.png",
      is_active: true,
    },
  });

  // Ensure there are some lotteries metadata
  // Use findFirst + create pattern since there's no unique slug field
  let thaiLottoMetadata = await prisma.lotteries.findFirst({
    where: { name: "Thai Lotto", country_id: thaiCountry.id },
  });
  if (!thaiLottoMetadata) {
    thaiLottoMetadata = await prisma.lotteries.create({
      data: {
        name: "Thai Lotto",
        country_id: thaiCountry.id,
        currency: "THB",
        is_active: true,
      },
    });
  }

  let laoLottoMetadata = await prisma.lotteries.findFirst({
    where: { name: "Lao Lotto", country_id: laoCountry.id },
  });
  if (!laoLottoMetadata) {
    laoLottoMetadata = await prisma.lotteries.create({
      data: {
        name: "Lao Lotto",
        country_id: laoCountry.id,
        currency: "LAK",
        is_active: true,
      },
    });
  }

  // Ensure there are some lottery jobs (cron jobs)
  let thaiLottoJob = await prisma.lottery_jobs.findFirst({
    where: { name: "THAI", lottery_id: thaiLottoMetadata.id },
  });
  if (!thaiLottoJob) {
    thaiLottoJob = await prisma.lottery_jobs.create({
      data: {
        name: "THAI",
        lottery_id: thaiLottoMetadata.id,
        url: "https://example.com/thai",
        cron_schedule: "0 16 1,16 * *",
      },
    });
  }

  // Insert some basic results matching the new schema
  // lottery_results.lottery_id -> lotteries.id
  const existingThaiResult = await prisma.lottery_results.findFirst({
    where: { lottery_id: thaiLottoMetadata.id, draw_date: "2026-02-16" },
  });

  if (!existingThaiResult) {
    await prisma.lottery_results.create({
      data: {
        lottery_id: thaiLottoMetadata.id,
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
  }

  let laoLottoJob = await prisma.lottery_jobs.findFirst({
    where: { name: "LAO", lottery_id: laoLottoMetadata.id },
  });
  if (!laoLottoJob) {
    laoLottoJob = await prisma.lottery_jobs.create({
      data: {
        name: "LAO",
        lottery_id: laoLottoMetadata.id,
        url: "https://example.com/lao",
        cron_schedule: "30 20 * * 1,3,5",
      },
    });
  }

  const existingLaoResult = await prisma.lottery_results.findFirst({
    where: { lottery_id: laoLottoMetadata.id, draw_date: "2026-02-13" },
  });

  if (!existingLaoResult) {
    await prisma.lottery_results.create({
      data: {
        lottery_id: laoLottoMetadata.id,
        draw_date: "2026-02-13",
        draw_period: "#18/2569",
        full_data: {
          digit4: "4045",
          digit3: "045",
          digit2: "45",
        },
      },
    });
  }

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
