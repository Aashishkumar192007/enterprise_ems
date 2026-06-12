const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await prisma.user.count({ where: { role: { not: 'Admin' } } });
    const departments = await prisma.department.count();
    const pendingLeaves = await prisma.leaveApplication.count({ where: { status: 'Pending' } });

    // Mocking some trends until full history is populated
    const employeeTrendData = [
      { name: 'Jan', employees: totalEmployees > 0 ? totalEmployees - 10 : 0 },
      { name: 'Feb', employees: totalEmployees > 0 ? totalEmployees - 5 : 0 },
      { name: 'Mar', employees: totalEmployees }
    ];

    const departmentData = await prisma.department.findMany({
      include: { _count: { select: { employeeProfiles: true } } }
    });

    const formattedDeptData = departmentData.map(d => ({
      name: d.department_name,
      value: d._count.employeeProfiles
    }));

    // If no employees, show default
    if (formattedDeptData.length === 0) {
      formattedDeptData.push({ name: 'Engineering', value: 45 }, { name: 'Sales', value: 25 });
    }

    const leaveTrends = [
      { name: 'Week 1', leaves: 2 },
      { name: 'Week 2', leaves: pendingLeaves }
    ];

    const assetAllocations = [
      { name: 'Laptops', count: 12 },
      { name: 'Monitors', count: 8 }
    ];

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments: departments,
        pendingLeaves,
        employeeTrendData,
        departmentData: formattedDeptData,
        leaveTrends,
        assetAllocations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load dashboard stats', error: error.message });
  }
};
