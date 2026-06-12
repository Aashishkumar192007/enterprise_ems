# THE KUMAR's Enterprise EMS
## Final Project Documentation

### 1. Project Overview
The Enterprise Employee Management System (EMS) is a comprehensive web application designed to streamline HR and organizational operations. The system serves as a central hub for managing employee data, tracking company assets, and processing leave requests securely.

### 2. Architecture & Tech Stack
The application follows a standard **Three-Tier Architecture**:
- **Presentation Layer (Frontend)**: Built with React.js using standard Create React App. State is managed via Redux Toolkit. UI features modern glassmorphic elements and interactive charts using Recharts.
- **Application Layer (Backend)**: Built with Node.js and Express. It acts as a RESTful API exposing services for auth, employees, assets, leaves, and dashboard stats. Security is fortified with Helmet, Joi (validation), and JWT.
- **Data Layer (Database)**: PostgreSQL handles relational data storage, managed robustly via Prisma ORM for schema synchronization and type-safe querying.

### 3. Core Modules
- **Authentication & Authorization**: Secure registration, login, and JWT-based session handling. Role-Based Access Control (RBAC) restricts sensitive actions to Admins/HR.
- **Employee Directory**: Allows Admins to view, filter, and manage staff records across departments.
- **Leave Management**: A dual-portal allowing employees to submit leave requests and view balances, while Admins receive a dashboard to approve or reject them.
- **Asset Tracking**: Inventory ledger allowing HR to register company equipment (laptops, phones) and assign them to specific personnel dynamically.
- **Dashboard**: A live telemetry page aggregating total employees, departments, and pending leaves, plotted alongside interactive Recharts graphs.

### 4. Database Schema
The database uses Prisma models with the following key entities:
- **User**: Stores employee credentials, roles (`Admin`, `HR`, `User`), and personal information.
- **Department**: Organizational units linked to users.
- **LeaveType & LeaveBalance**: Tracks the categories of leaves (Sick, Casual) and the quota available to each user.
- **LeaveApplication**: The transactional record of a leave request including its status (`Pending`, `Approved`, `Rejected`).
- **Asset & AssetAllocation**: Tracks inventory items (Name, Type, Serial) and maps them chronologically to users.

### 5. Deployment Setup
- **Database**: Provisioned on Neon Serverless Postgres.
- **Backend**: Hosted on Render, executing `npm start` with `DATABASE_URL` pointing to Neon. Cross-Origin Resource Sharing (CORS) is configured to whitelist the frontend domain.
- **Frontend**: Hosted on Vercel via GitHub integration, dynamically pointing to the Render API url using `REACT_APP_API_URL`.

### 6. Future Enhancements
- **Email Notifications**: Integrating Nodemailer to ping Admins when a leave is requested.
- **Automated Payroll**: Extending the schema to calculate attendance metrics against payroll records.
- **Exporting**: Adding PDF and CSV generation for HR reporting.
