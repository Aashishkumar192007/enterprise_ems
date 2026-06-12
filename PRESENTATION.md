---
marp: true
theme: default
paginate: true
---

# THE KUMAR's Enterprise EMS
## Final Project Presentation
**Developed By**: THE KUMAR's Engineering Team

---

# 1. Introduction
- **Goal**: Centralize and digitize core HR operations.
- **Problem**: Traditional manual tracking of employees, leaves, and assets leads to data silos and inefficiency.
- **Solution**: A secure, scalable, role-based web application providing real-time data transparency and control.

---

# 2. System Architecture
- **Frontend**: React.js, Redux, React Router, Recharts
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Security**: JWT Authentication, Bcrypt password hashing, Helmet headers, Express Rate Limiting

---

# 3. Core Features
- **Role-Based Dashboards**: Real-time KPIs tailored to User vs. Admin roles.
- **Leave Management**: Self-service portal for employees; Approval dashboard for HR.
- **Asset Ledger**: Digital tracking of laptops and equipment with dynamic allocation matrices.
- **Responsive UI**: Glassmorphic styling ensuring an intuitive and premium user experience.

---

# 4. Database Design (Prisma)
- Strongly typed relational models for `User`, `Department`, `LeaveApplication`, and `Asset`.
- Enforces strict foreign-key constraints (e.g. allocating assets to valid users).
- Prisma Migration engine tracks schema changes securely for production rollouts.

---

# 5. Technical Challenges & Solutions
- **Challenge**: Managing global application state.
  - *Solution*: Redux Toolkit provided predictable state containers for Auth tokens.
- **Challenge**: Integrating interactive UI charting.
  - *Solution*: Adopted Recharts to parse API statistics directly into SVGs.
- **Challenge**: Enforcing API Security.
  - *Solution*: Built reusable middleware extracting and verifying Bearer JWTs before allowing controller logic to fire.

---

# 6. Deployment Pipeline
1. **Source Control**: GitHub coordinates the main branch.
2. **Database Hosting**: Neon Postgres Serverless tier.
3. **Backend API**: Hosted on Render, automatically syncing with Prisma on build.
4. **Frontend Delivery**: Hosted on Vercel Edge Network, reading from `REACT_APP_API_URL` to securely fetch data from Render.

---

# 7. Learning Outcomes & Future Roadmap
- **Outcomes**: Gained mastery over full-stack debugging, REST API design, state management, and modern CSS structuring.
- **Roadmap**: 
  - Automated email notifications via Nodemailer.
  - Comprehensive CSV/PDF exporting.
  - Microservice scaling for future enterprise modules (Payroll, Recruitment).

---

# Thank You
## Questions?
