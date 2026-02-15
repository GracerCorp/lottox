import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Thai Lotto Data
  await prisma.lotteryResult.create({
    data: {
      type: "THAI",
      date: "2026-02-16", // Future date for testing
      drawDate: new Date("2026-02-16T00:00:00Z"),
      drawNo: "#40/2569",
      data: JSON.stringify({
        first: "123456",
        last2: "99",
        last3f: ["111", "222"],
        last3b: ["333", "444"],
        prize2: ["555555"],
        prize3: ["666666"],
        prize4: ["777777"],
        prize5: ["888888"],
        adjacent: ["123455", "123457"],
      }),
    },
  });

  // Lao Lotto Data
  await prisma.lotteryResult.create({
    data: {
      type: "LAO",
      date: "2026-02-13",
      drawDate: new Date("2026-02-13T00:00:00Z"),
      drawNo: "#18/2569",
      data: JSON.stringify({
        digit4: "4045",
        digit3: "045",
        digit2: "45",
      }),
    },
  });

  console.log("Seed data inserted");
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
