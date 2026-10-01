import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/students.routes.js';
import interventionRoutes from './routes/interventions.routes.js';
import courseRoutes from './routes/courses.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import studyPlansRoutes from './routes/study-plans.routes.js';
import goalsRoutes from './routes/goals.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import dataImportRoutes from './routes/data-import.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Agentic Student Success Intelligence Platform (ASSIP)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/study-plans', studyPlansRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/data-import', dataImportRoutes);
app.use('/api/admin', adminRoutes);

import path from 'path';
import fs from 'fs';

const clientDistPath = fs.existsSync(path.resolve(process.cwd(), '../client/dist'))
  ? path.resolve(process.cwd(), '../client/dist')
  : path.resolve(process.cwd(), 'client/dist');

// Serve static frontend assets if built
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred in the intelligence engine.'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ASSIP Backend Server active on http://localhost:${PORT}`);
  console.log(` AI Multi-Agent Orchestrator Ready`);
  console.log(`=======================================================`);
});

export default app;
