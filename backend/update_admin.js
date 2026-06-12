const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'admin@isoftzone.com' },
    data: { email: 'admin@thekumars.com' }
  });
  console.log('Updated admin email to admin@thekumars.com');
}
main().finally(() => prisma.$disconnect());
