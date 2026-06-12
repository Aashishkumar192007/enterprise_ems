# Enterprise Employee Management System (EMS)

## Project Overview
The Enterprise EMS is a comprehensive solution designed to streamline HR and organizational operations. It serves as a central hub for managing employee data, tracking company assets, and processing leave requests securely.

## Features
- **Login / Authentication**: Signup, Login, and Logout features with JWT token security.
- **Employee Module**: Create, Update, and Delete employee profiles dynamically.
- **Leave Module**: Employees can Apply for leave; Admins can Approve and Reject leave applications.
- **Asset Module**: Allocate assets to employees and Return them when not in use.
- **Reports**: Export, Search, and Filter functionality for comprehensive HR reporting.

## Tech Stack
- **Frontend**: React, React Router, Redux Toolkit, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Cloud database hosted on Neon)
- **ORM**: Prisma
- **Security**: JWT Authentication, bcrypt, express-rate-limit, Helmet, CORS

## Installation Steps
1. Clone the repository: `git clone https://github.com/Aashishkumar192007/enterprise_ems.git`
2. Backend Setup:
   ```bash
   cd backend
   npm install
   # Create .env with DATABASE_URL and JWT_SECRET
   npm start
   ```
3. Frontend Setup:
   ```bash
   cd frontend
   npm install
   # Create .env with REACT_APP_API_URL=http://localhost:5000/api
   npm start
   ```

## Deployment URLs
- **Source Code GitHub Repository**: https://github.com/Aashishkumar192007/enterprise_ems
- **Live Frontend URL**: https://frontend-pi-olive-29.vercel.app
- **Live Backend API URL**: https://backend-two-lovat-59.vercel.app/api
- **Cloud Database (Neon)**: postgresql://user:password@host/db

## Developer Name
**Developer**: THE KUMAR's / Aashishkumar192007
