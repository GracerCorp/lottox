const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    where: { id: { in: [1, 5, 16, 19] } } // Thai, Lao, Magnum 4D, Singapore 4D
  });
  
  console.log(JSON.stringify(lotteries, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
