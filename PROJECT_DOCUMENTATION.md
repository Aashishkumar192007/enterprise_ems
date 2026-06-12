# THE KUMAR's Enterprise EMS
## Final Project Documentation

### 1. Project Overview
The Enterprise Employee Management System (EMS) is a comprehensive web application designed to streamline HR and organizational operations. The system serves as a central hub for managing employee data, tracking company assets, and processing leave requests securely.

### 2. Modules
- **Authentication**: Secure registration, login, and logout functionalities restricted to authorized personnel.
- **Employee Module**: Capabilities to Create, Update, and Delete employee records with comprehensive profile data.
- **Leave Module**: A dual-portal allowing employees to Apply for leave and Admins to Approve or Reject applications based on available balances.
- **Asset Module**: A robust ledger for HR to Allocate hardware or software resources to employees, and process Returns dynamically.
- **Reports**: Advanced Export, Search, and Filter mechanisms to analyze workforce metrics.

### 3. Database Design
The relational database is constructed in PostgreSQL (Neon) and utilizes the Prisma ORM for type-safe interactions.
- **User**: Stores employee credentials, roles, and profile information.
- **Department**: Manages distinct units within the organization.
- **LeaveType & LeaveBalance**: Catalogs the quota and usage for different leave categories.
- **LeaveApplication**: The transactional log of leave requests and their statuses.
- **Asset & AssetAllocation**: Tracks inventory mapping and lifecycles.

### 4. API Endpoints
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **Health Check**: `GET /api/health`
- **Employees**: `GET /api/employees`, `POST /api/employees`, `PUT /api/employees/:id`, `DELETE /api/employees/:id`
- **Leaves**: `GET /api/leave`, `POST /api/leave/apply`, `PUT /api/leave/:id/approve`
- **Assets**: `GET /api/assets`, `POST /api/assets/allocate`, `POST /api/assets/return/:id`

### 5. Deployment URLs
- **Live Frontend URL**: https://employee-management.vercel.app
- **Live Backend API URL**: https://employee-api.onrender.com
- **Cloud Database / Database Schema**: postgresql://user:password@host/db
- **Source Code**: https://github.com/Aashishkumar192007/enterprise_ems

### 6. Screenshots
(Screenshots are attached in the main repository / final submission `.zip` file, illustrating the Glassmorphism Dashboard, Employee Data Tables, and Responsive Asset Management interfaces.)

### 7. Future Enhancements
- **Email Notifications**: Integrating Nodemailer to actively ping Admins when a leave is requested.
- **Automated Payroll System**: Extending the core schema to calculate detailed attendance metrics against automated payroll logs.
- **Advanced Exporting**: Building robust PDF/CSV generation natively within the platform for complex HR compliance reporting.
