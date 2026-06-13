require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./utils/errorHandler');
const logger = require('./config/logger');
require('./config/cron');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const allowed = [
      'https://frontend-pi-olive-29.vercel.app',
      'https://frontend-bu2o84arw-aashish-s-projects84.vercel.app',
      'https://backend-two-lovat-59.vercel.app',
      process.env.FRONTEND_URL,
      'http://localhost:3000',
    ].filter(Boolean);
    if (allowed.some(a => origin.startsWith(a)) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // allow all for now during development
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Base Routes for direct browser visits
app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to THE KUMAR's EMS API. Access /api-docs for documentation." });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: "THE KUMAR's EMS API is running.", version: "1.0.0" });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Swagger Setup (To be implemented fully later)
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Trigger Render deployment
