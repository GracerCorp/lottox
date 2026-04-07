import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const toggles = await prisma.feature_toggles.findMany();
  console.log("TOGGLES:", toggles);
}
main().catch(console.error).finally(() => prisma.$disconnect());
