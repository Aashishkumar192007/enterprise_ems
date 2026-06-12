const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    let admin = await prisma.user.findFirst({
      where: { role: 'Admin' }
    });

    if (admin) {
      
      
      
    } else {
      
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      admin = await prisma.user.create({
        data: {
          name: 'System Admin',
          email: 'admin@isoftzone.com',
          password: hashedPassword,
          role: 'Admin',
          verified: true
        }
      });
      
      
      
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
