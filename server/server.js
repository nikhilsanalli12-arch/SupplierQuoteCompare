import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
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


// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'SupplierQuoteCompare API is operational',
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
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`SupplierQuoteCompare backend server running on http://localhost:${PORT}`);
  });
};

startServer();
