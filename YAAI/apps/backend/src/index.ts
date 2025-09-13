import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Routes
import authRoutes from './routes/auth';
import campaignsRoutes from './routes/campaigns';
import analyticsRoutes from './routes/analytics';
import dashboardRoutes from './routes/dashboard';
import reportsRoutes from './routes/reports';
import yandexRoutes from './routes/yandex';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', authMiddleware, campaignsRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/reports', authMiddleware, reportsRoutes);
app.use('/api/yandex', authMiddleware, yandexRoutes);

// Error handling
app.use(errorHandler);

const PORT = config.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`🚀 YAAI Backend API running on port ${PORT}`);
  logger.info(`📊 Environment: ${config.NODE_ENV}`);
});

export default app;