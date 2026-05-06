/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres:520ad9c68ca95ecf724a@199.21.173.165:5432/lottox?sslmode=disable"
    }
  }
});

async function run() {
  try {
    const result = await prisma.$executeRawUnsafe(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = 'lottox'
        AND pid <> pg_backend_pid();
    `);
    console.log("Terminated connections:", result);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
