const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const leaveTypes = await prisma.leaveType.findMany();

  for (const user of users) {
    const balances = await prisma.leaveBalance.findMany({ where: { user_id: user.id } });
    if (balances.length === 0) {
      console.log(`Adding leave balances for ${user.email}`);
      for (const lt of leaveTypes) {
        let defaultBalance = 15; // default 15 days
        if (lt.type_name === 'Sick Leave') defaultBalance = 10;
        else if (lt.type_name === 'Casual Leave') defaultBalance = 12;

        await prisma.leaveBalance.create({
          data: {
            user_id: user.id,
            leave_type_id: lt.id,
            balance: defaultBalance
          }
        });
      }
    }
  }

  console.log('Finished updating leave balances.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
