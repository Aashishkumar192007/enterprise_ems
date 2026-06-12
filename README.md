# THE KUMAR's Enterprise EMS

An Enterprise Employee Management System built with the PERN stack (PostgreSQL, Express, React, Node.js). 

## Features
- **Authentication**: Secure JWT-based login, signup, and role-based access control (Admin vs User).
- **Employee Directory**: View, filter, and manage employee profiles and departments.
- **Leave Management**: Request time off, track balances, and allow Admins to approve/reject applications.
- **Asset Tracking**: Register company assets and allocate them dynamically to employees.
- **Dashboard**: Real-time KPI aggregation and visualizations using Recharts.
- **Security**: Rate limiting, Helmet HTTP headers, Joi input validation, and password hashing via bcrypt.

## Tech Stack
- **Frontend**: React (Create React App), React Router DOM, Redux Toolkit, Axios, Recharts, Lucide Icons, Vanilla CSS (Glassmorphism UI).
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, JWT, Node-Cron, Nodemailer, Winston.

## Installation & Local Setup

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd enterprise_ems
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgres://user:pass@localhost:5432/loginapp"
JWT_SECRET="your_jwt_secret_key"
FRONTEND_URL="http://localhost:3000"
```
Run migrations and start the server:
```bash
npx prisma migrate dev
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL="http://localhost:5000/api"
```
Start the frontend:
```bash
npm start
```

## Production Deployment
### Backend (Render)
1. Push your code to GitHub.
2. Create a new Web Service on Render and connect your repository.
3. Set Build Command: `cd backend && npm install && npx prisma generate`
4. Set Start Command: `cd backend && npm start`
5. Add your `DATABASE_URL`, `JWT_SECRET`, and `FRONTEND_URL` environment variables.

### Frontend (Vercel)
1. Import your GitHub repository into Vercel.
2. Select **React Create React App** as the framework.
3. Set the Root Directory to `frontend`.
4. Add the `REACT_APP_API_URL` environment variable pointing to your deployed Render URL.
5. Deploy!

---
**Developer**: THE KUMAR's Engineering Team
