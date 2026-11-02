import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB, getDatabaseInfo } from './config/db.js';
import supplierRoutes from './routes/supplierRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/quotations', quotationRoutes);

// Health & Database Diagnostics check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SupplierQuoteCompare API is operational',
    database: getDatabaseInfo(),
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
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
