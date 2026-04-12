const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.countries.findFirst({where: {code: 'vn'}}).then(r => console.log("DB RESULT:", r)).finally(() => prisma.$disconnect());
