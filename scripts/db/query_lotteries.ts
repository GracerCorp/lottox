import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    where: {
      name: {
          contains: 'Lao',
          mode: 'insensitive'
      }
    }
  })
  
  console.log(JSON.stringify(lotteries, null, 2))
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
