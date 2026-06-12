const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  
  const types = ['Sick Leave', 'Casual Leave', 'Annual Leave'];
  for (const t of types) {
    await prisma.leaveType.upsert({
      where: { type_name: t },
      update: {},
      create: { type_name: t }
    });
  }

  // Seed default department
  await prisma.department.upsert({
    where: { department_name: 'General' },
    update: {},
    create: { department_name: 'General' }
  });

  const leaveTypes = await prisma.leaveType.findMany();
  

  // Optionally seed LeaveBalance for Admin
  const users = await prisma.user.findMany();
  for (const user of users) {
    for (const lt of leaveTypes) {
      await prisma.leaveBalance.upsert({
        where: {
          user_id_leave_type_id: { user_id: user.id, leave_type_id: lt.id }
        },
        update: {},
        create: {
          user_id: user.id,
          leave_type_id: lt.id,
          balance: lt.type_name === 'Annual Leave' ? 14 : 7
        }
      });
    }
  }

  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
