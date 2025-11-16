import uploadRoutes from './routes/upload.routes';
import authRoutes from './routes/auth.routes';
import analyticsRoutes from './routes/analytics.routes';
import aiTrainingRoutes from './routes/ai-training.routes';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import mongoSanitize from 'express-mongo-sanitize'; // Temporarily disabled - incompatible with Express 5.x

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin resources
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization against NoSQL injection
// app.use(mongoSanitize()); // Temporarily disabled - incompatible with Express 5.x

// Static files for uploaded media
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai-training', aiTrainingRoutes);

// Test route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Intelligent Storage API is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server (using file-based storage - no database connection needed)
const startServer = async () => {
  // MongoDB connection disabled - using file-based JSON storage
  console.log('💾 Using file-based storage for users (no MongoDB required)');

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Storage directory: ${path.join(__dirname, '../storage')}`);
    console.log(`👤 User data: ${path.join(__dirname, '../storage/users.json')}`);
  });
};

startServer();

export default app;