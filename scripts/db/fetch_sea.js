import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    where: {
      countries: {
        name: {
          in: ['Vietnam', 'Singapore', 'Malaysia', 'Thailand', 'Philippines', 'Laos']
        }
      }
    },
    select: {
      id: true,
      name: true,
      countries: { select: { name: true } },
      default_prize_amounts: true,
      showing_prizes: true,
    }
  });
  console.log(JSON.stringify(lotteries, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
