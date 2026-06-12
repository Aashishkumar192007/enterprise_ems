---
marp: true
theme: default
class: lead
backgroundColor: #ffffff
---

# Enterprise Employee Management System (EMS)
### Final Project Presentation
**Developer:** Aashishkumar192007 (THE KUMAR's)

---

# 1. Introduction
The Enterprise EMS is a powerful, full-stack HR and corporate management platform.
- **Objective:** Centralize employee data, track leave requests, and manage company assets dynamically.
- **Impact:** Decreased administrative overhead and increased operational transparency.

---

# 2. Architecture
The application employs a standard 3-Tier Architecture.
- **Frontend (Client):** React.js + Redux Toolkit
- **Backend (Server):** Node.js + Express.js API
- **Database (Data Layer):** PostgreSQL managed by Prisma ORM

---

# 3. Database
Robust relational database hosted on **Neon Serverless Postgres**.
- **Entities:** `User`, `Department`, `LeaveBalance`, `LeaveApplication`, `Asset`, `AssetAllocation`
- **Security:** Hashed credentials and Role-Based Access mapping.

---

# 4. Features
- **Authentication:** JWT-secured signup, login, logout.
- **Employee Module:** Create, Update, Delete records with live search.
- **Leave Module:** Dual-portal for applying (Employees) and approving/rejecting (Admins).
- **Asset Module:** Dynamic hardware assignment and returns.
- **Reports:** Comprehensive exporting and filtering dashboards.

---

# 5. Challenges
- **State Management:** Keeping Redux state synchronized with backend asset allocations.
- **Database Migrations:** Maintaining relational integrity between Leaves and Users using Prisma.
- **Security:** Mitigating vulnerabilities using Helmet, Express-Rate-Limit, and secure JWT strategies.

---

# 6. Deployment
The project utilizes modern cloud infrastructure.
- **Backend API:** Deployed on Render (`https://employee-api.onrender.com`)
- **Frontend UI:** Deployed on Vercel (`https://employee-management.vercel.app`)
- **CI/CD:** Connected to GitHub for seamless integration and deployment.

---

# 7. Learning Outcomes
- Advanced full-stack integration with React and Node.js.
- Cloud deployment and environment variable management in Production.
- Secure, token-based API development and CORS configuration.
- Relational database schema design using Prisma ORM.

---

# Thank You!
**GitHub Repository:** https://github.com/Aashishkumar192007/enterprise_ems
