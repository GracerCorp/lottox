import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const lotteries = await prisma.lotteries.findMany({
    include: { countries: true }
  });
  
  const formatted = lotteries.map(l => ({
    id: l.id,
    name: l.name,
    country: l.countries ? l.countries.name : 'Unknown',
    region: l.countries ? l.countries.region : 'Unknown'
  }));
  
  console.log(console.table(formatted));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
