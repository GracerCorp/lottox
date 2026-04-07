const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    select: { id: true, name: true, countries: { select: { code: true } } }
  });
  console.log(lotteries.slice(0, 10));
}

main().catch(console.error).finally(() => prisma.$disconnect());
