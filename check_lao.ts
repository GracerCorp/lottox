import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.lottery_results.findFirst({
    where: {
      lottery: {
        countries: {
          code: 'la'
        }
      }
    },
    orderBy: { draw_date: 'desc' }
  })
  console.log(JSON.stringify(result?.full_data, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
