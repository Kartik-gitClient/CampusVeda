import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import conflictRoutes from './routes/conflictRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Config & DB
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();

// ─── Core Middleware ────────────────────────────────────────────
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PRITHVEDA API is running perfectly!',
  });
});

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/conflicts', conflictRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auditlogs', auditRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// ─── Global Error Handler ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
