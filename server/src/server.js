import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import tailorerRoutes from './routes/tailorerRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import diagnosticsRoutes from './routes/diagnosticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (port 5173) and any local origins
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareerConnect AI Node Backend',
    timestamp: new Date().toISOString(),
    features: ['Resume ATS Parser', 'JD Tailorer', 'AI Mock Interview', 'ATS Diagnostics'],
  });
});

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/tailorer', tailorerRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/diagnostics', diagnosticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred',
  });
});

// Start Express server and connect database
async function startServer() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 CareerConnect Node.js Server running on http://localhost:${PORT}`);
  });
}

startServer();
