const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminHash = await bcrypt.hash('admin123', 10);
  const ownerHash = await bcrypt.hash('owner123', 10);
  const userHash = await bcrypt.hash('user123', 10);

  // ─── USERS ───────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@thekumars.com' },
    update: { verified: true },
    create: { name: 'Admin Kumar', email: 'admin@thekumars.com', password: adminHash, role: 'Admin', verified: true },
  });
  const owner = await prisma.user.upsert({
    where: { email: 'owner@thekumars.com' },
    update: { verified: true },
    create: { name: 'Owner Kumar', email: 'owner@thekumars.com', password: ownerHash, role: 'Admin', verified: true },
  });
  const hr = await prisma.user.upsert({
    where: { email: 'hr@thekumars.com' },
    update: { verified: true },
    create: { name: 'Priya Sharma', email: 'hr@thekumars.com', password: userHash, role: 'HR', verified: true },
  });
  const manager = await prisma.user.upsert({
    where: { email: 'manager@thekumars.com' },
    update: { verified: true },
    create: { name: 'Raj Patel', email: 'manager@thekumars.com', password: userHash, role: 'Manager', verified: true },
  });
  const emp1 = await prisma.user.upsert({
    where: { email: 'arjun@thekumars.com' },
    update: { verified: true },
    create: { name: 'Arjun Singh', email: 'arjun@thekumars.com', password: userHash, role: 'User', verified: true },
  });
  const emp2 = await prisma.user.upsert({
    where: { email: 'sneha@thekumars.com' },
    update: { verified: true },
    create: { name: 'Sneha Reddy', email: 'sneha@thekumars.com', password: userHash, role: 'User', verified: true },
  });
  const emp3 = await prisma.user.upsert({
    where: { email: 'vikram@thekumars.com' },
    update: { verified: true },
    create: { name: 'Vikram Nair', email: 'vikram@thekumars.com', password: userHash, role: 'User', verified: true },
  });

  const allUsers = [admin, owner, hr, manager, emp1, emp2, emp3];
  console.log('Users seeded:', allUsers.length);

  // ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
  const deptNames = ['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];
  const depts = {};
  for (const deptName of deptNames) {
    depts[deptName] = await prisma.department.upsert({
      where: { department_name: deptName },
      update: {},
      create: { department_name: deptName },
    });
  }
  console.log('Departments seeded:', deptNames.length);

  // ─── SKILLS ──────────────────────────────────────────────────────────────────
  const skillNames = ['JavaScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Project Management', 'HR Management', 'Marketing'];
  const skills = {};
  for (const skillName of skillNames) {
    skills[skillName] = await prisma.skill.upsert({
      where: { skill_name: skillName },
      update: {},
      create: { skill_name: skillName },
    });
  }
  console.log('Skills seeded:', skillNames.length);

  // ─── EMPLOYEE PROFILES ───────────────────────────────────────────────────────
  const profiles = [
    { user: admin,   dept: 'Engineering', phone: '+91-9876543210', designation: 'CTO',               salary: 250000, address: '12 MG Road, Bangalore' },
    { user: owner,   dept: 'Engineering', phone: '+91-9876543211', designation: 'CEO',               salary: 300000, address: '5 Park Street, Mumbai' },
    { user: hr,      dept: 'HR',          phone: '+91-9876543212', designation: 'HR Manager',        salary: 80000,  address: '34 Anna Nagar, Chennai' },
    { user: manager, dept: 'Engineering', phone: '+91-9876543213', designation: 'Engineering Manager',salary: 120000, address: '8 Salt Lake, Kolkata' },
    { user: emp1,    dept: 'Engineering', phone: '+91-9876543214', designation: 'Senior Developer',  salary: 95000,  address: '22 Banjara Hills, Hyderabad' },
    { user: emp2,    dept: 'Marketing',   phone: '+91-9876543215', designation: 'Marketing Lead',    salary: 75000,  address: '15 Jayanagar, Bangalore' },
    { user: emp3,    dept: 'Finance',     phone: '+91-9876543216', designation: 'Finance Analyst',   salary: 70000,  address: '9 Connaught Place, Delhi' },
  ];

  for (const p of profiles) {
    const existing = await prisma.employeeProfile.findUnique({ where: { user_id: p.user.id } });
    if (!existing) {
      await prisma.employeeProfile.create({
        data: {
          user_id: p.user.id,
          department_id: depts[p.dept].id,
          phone: p.phone,
          designation: p.designation,
          salary: p.salary,
          address: p.address,
        },
      });
    }
  }
  console.log('Employee profiles seeded:', profiles.length);

  // ─── LEAVE TYPES ─────────────────────────────────────────────────────────────
  const leaveTypeNames = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'];
  const leaveTypes = {};
  for (const typeName of leaveTypeNames) {
    leaveTypes[typeName] = await prisma.leaveType.upsert({
      where: { type_name: typeName },
      update: {},
      create: { type_name: typeName },
    });
  }
  console.log('Leave types seeded:', leaveTypeNames.length);

  // ─── LEAVE BALANCES ──────────────────────────────────────────────────────────
  const leaveAllotments = {
    'Casual Leave': 12,
    'Sick Leave': 10,
    'Earned Leave': 18,
    'Maternity Leave': 90,
  };

  for (const user of allUsers) {
    for (const [typeName, balance] of Object.entries(leaveAllotments)) {
      await prisma.leaveBalance.upsert({
        where: { user_id_leave_type_id: { user_id: user.id, leave_type_id: leaveTypes[typeName].id } },
        update: {},
        create: { user_id: user.id, leave_type_id: leaveTypes[typeName].id, balance },
      });
    }
  }
  console.log('Leave balances seeded for all users');

  // ─── ASSETS ──────────────────────────────────────────────────────────────────
  const assetData = [
    { asset_name: 'MacBook Pro 14"',      asset_type: 'Laptop',    serial_number: 'MBP-2024-001' },
    { asset_name: 'MacBook Pro 14"',      asset_type: 'Laptop',    serial_number: 'MBP-2024-002' },
    { asset_name: 'Dell XPS 15',          asset_type: 'Laptop',    serial_number: 'DXPS-2024-003' },
    { asset_name: 'HP EliteBook 840',     asset_type: 'Laptop',    serial_number: 'HPE-2024-004' },
    { asset_name: 'iPhone 15 Pro',        asset_type: 'Mobile',    serial_number: 'IP15-2024-001' },
    { asset_name: 'Samsung Galaxy S24',   asset_type: 'Mobile',    serial_number: 'SGS-2024-002' },
    { asset_name: 'Dell 27" Monitor',     asset_type: 'Monitor',   serial_number: 'DM27-2024-001' },
    { asset_name: 'LG 24" Monitor',       asset_type: 'Monitor',   serial_number: 'LG24-2024-002' },
    { asset_name: 'Herman Miller Chair',  asset_type: 'Furniture', serial_number: 'HMC-2024-001' },
    { asset_name: 'Standing Desk',        asset_type: 'Furniture', serial_number: 'STD-2024-001' },
    { asset_name: 'Logitech MX Keys',     asset_type: 'Peripheral',serial_number: 'LMK-2024-001' },
    { asset_name: 'Sony WH-1000XM5',      asset_type: 'Peripheral',serial_number: 'SWHN-2024-001' },
  ];

  const assets = [];
  for (const a of assetData) {
    const asset = await prisma.asset.upsert({
      where: { serial_number: a.serial_number },
      update: {},
      create: a,
    });
    assets.push(asset);
  }
  console.log('Assets seeded:', assets.length);

  // ─── ASSET ALLOCATIONS ───────────────────────────────────────────────────────
  const allocations = [
    { assetIdx: 0, user: admin,   date: new Date('2024-01-15') },
    { assetIdx: 1, user: owner,   date: new Date('2024-01-15') },
    { assetIdx: 2, user: manager, date: new Date('2024-02-01') },
    { assetIdx: 3, user: emp1,    date: new Date('2024-03-10') },
    { assetIdx: 4, user: admin,   date: new Date('2024-01-20') },
    { assetIdx: 5, user: emp2,    date: new Date('2024-04-05') },
    { assetIdx: 6, user: emp1,    date: new Date('2024-03-15') },
    { assetIdx: 7, user: emp3,    date: new Date('2024-05-01') },
  ];

  for (const alloc of allocations) {
    const existing = await prisma.assetAllocation.findFirst({
      where: { asset_id: assets[alloc.assetIdx].id, user_id: alloc.user.id, return_date: null },
    });
    if (!existing) {
      await prisma.assetAllocation.create({
        data: { asset_id: assets[alloc.assetIdx].id, user_id: alloc.user.id, allocated_date: alloc.date },
      });
    }
  }
  console.log('Asset allocations seeded:', allocations.length);

  // ─── ATTENDANCE (last 7 days) ─────────────────────────────────────────────────
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    if (day === 0 || day === 6) continue; // skip weekends

    const clockIn = new Date(date);
    clockIn.setHours(9, Math.floor(Math.random() * 30), 0, 0);
    const clockOut = new Date(date);
    clockOut.setHours(18, Math.floor(Math.random() * 30), 0, 0);

    for (const user of allUsers) {
      await prisma.attendance.upsert({
        where: { user_id_date: { user_id: user.id, date } },
        update: {},
        create: { user_id: user.id, date, clock_in: clockIn, clock_out: clockOut, status: 'Present' },
      });
    }
  }
  console.log('Attendance seeded for last 7 weekdays');

  // ─── JOBS ────────────────────────────────────────────────────────────────────
  const jobs = [
    { title: 'Senior Full Stack Developer', description: 'Build scalable web apps using React and Node.js', location: 'Bangalore (Hybrid)', department: 'Engineering' },
    { title: 'HR Business Partner',         description: 'Partner with business teams on HR strategy',      location: 'Mumbai (On-site)',    department: 'HR' },
    { title: 'Digital Marketing Manager',   description: 'Lead digital campaigns and SEO strategy',         location: 'Remote',              department: 'Marketing' },
    { title: 'Finance Controller',          description: 'Oversee financial reporting and compliance',       location: 'Delhi (On-site)',     department: 'Finance' },
  ];

  for (const job of jobs) {
    const existing = await prisma.job.findFirst({ where: { title: job.title } });
    if (!existing) {
      await prisma.job.create({ data: { ...job, is_active: true } });
    }
  }
  console.log('Jobs seeded:', jobs.length);

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
  for (const user of allUsers) {
    const existing = await prisma.notification.count({ where: { user_id: user.id } });
    if (existing === 0) {
      await prisma.notification.createMany({
        data: [
          { user_id: user.id, title: 'Welcome to THE KUMAR\'s EMS!', message: 'Your account has been set up. Explore the dashboard to get started.', is_read: false },
          { user_id: user.id, title: 'Leave Balances Updated', message: 'Your annual leave balances have been credited for FY 2024-25.', is_read: false },
        ],
      });
    }
  }
  console.log('Notifications seeded');

  console.log('\n✅ Seed completed successfully!');
  console.log('Admin:   admin@thekumars.com   / admin123');
  console.log('Owner:   owner@thekumars.com   / owner123');
  console.log('HR:      hr@thekumars.com      / user123');
  console.log('Manager: manager@thekumars.com / user123');
  console.log('Employees: arjun / sneha / vikram @thekumars.com / user123');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
