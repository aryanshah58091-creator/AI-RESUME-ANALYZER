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

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS: supports custom CLIENT_URL, local dev, or open for cloud previews
const clientUrl = process.env.CLIENT_URL;
app.use(
  cors({
    origin: clientUrl ? [clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'] : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve frontend static assets if built together (e.g. single service deploy)
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

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

// SPA client fallback (serves index.html for non-API web routes if frontend/dist exists)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

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
