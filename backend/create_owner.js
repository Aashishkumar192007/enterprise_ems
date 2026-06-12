const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'owner@thekumars.com';
  const password = 'OwnerPassword123!';
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Upsert user so it doesn't fail if ran multiple times
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'Admin',
      verified: true
    },
    create: {
      name: 'Owner Admin',
      email: email,
      password: hashedPassword,
      role: 'Admin',
      verified: true
    }
  });

  // Ensure an employee profile exists
  // We seeded department id 1 earlier, use that.
  await prisma.employeeProfile.upsert({
    where: { user_id: user.id },
    update: {},
    create: {
      user_id: user.id,
      department_id: 1,
      designation: 'Owner',
      salary: 1000000
    }
  });

  console.log(`Successfully created Owner Admin account!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
