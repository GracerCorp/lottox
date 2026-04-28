import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const lotteries = await prisma.lotteries.findMany({
    where: {
      name: {
        contains: 'lao',
        mode: 'insensitive'
      }
    }
  });
  console.log('Lotteries:', lotteries);
  
  if (lotteries.length > 0) {
    const res = await prisma.lottery_results.findFirst({
      where: {
        lottery_id: lotteries[0].id
      },
      orderBy: {
        draw_date: 'desc'
      }
    });
    console.log('Result:', JSON.stringify(res, null, 2));
  }
}
main().finally(() => prisma.$disconnect())
