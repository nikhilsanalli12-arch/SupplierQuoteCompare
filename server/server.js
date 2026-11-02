import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB, getDatabaseInfo } from './config/db.js';
import supplierRoutes from './routes/supplierRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

// Allowed Origins for CORS
const clientOrigin = process.env.CLIENT_URL;
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:4173'
];
if (clientOrigin) {
  clientOrigin.split(',').map(s => s.trim()).filter(Boolean).forEach(o => {
    allowedOrigins.push(o);
  });
}

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (tools, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Development allows all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Production: Check allowed origins or render domain
    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not permitted by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/quotations', quotationRoutes);

// Health & Database Diagnostics check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SupplierQuoteCompare API is operational',
    environment: process.env.NODE_ENV || 'development',
    database: getDatabaseInfo(),
    timestamp: new Date().toISOString()
  });
});

// Production: Serve pre-built static frontend assets if dist folder exists
if (fs.existsSync(distPath)) {
  console.log(`Serving static production build from ${distPath}`);
  app.use(express.static(distPath));

  // SPA fallback for non-API routes
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Fallback 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Unhandled server error:', err.stack);
  } else {
    console.error('Unhandled server error:', err.message);
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server after connecting to database
let serverInstance = null;
const startServer = async () => {
  await connectDB();
  serverInstance = app.listen(PORT, () => {
    console.log(`SupplierQuoteCompare backend server running on http://localhost:${PORT}`);
  });
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down server gracefully...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

startServer();
