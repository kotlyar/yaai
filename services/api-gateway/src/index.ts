import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3100'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Compression and parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Service proxies with authentication
const serviceRoutes = [
  {
    path: '/api/campaigns',
    target: process.env.CAMPAIGN_SERVICE_URL || 'http://localhost:3001',
    requireAuth: true
  },
  {
    path: '/api/analytics',
    target: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3002',
    requireAuth: true
  },
  {
    path: '/api/ai',
    target: process.env.AI_ENGINE_URL || 'http://localhost:3003',
    requireAuth: true
  },
  {
    path: '/api/optimization',
    target: process.env.OPTIMIZATION_SERVICE_URL || 'http://localhost:3004',
    requireAuth: true
  },
  {
    path: '/api/notifications',
    target: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005',
    requireAuth: false
  },
  {
    path: '/api/users',
    target: process.env.USER_SERVICE_URL || 'http://localhost:3006',
    requireAuth: false // Auth endpoints don't require authentication
  }
];

// Setup proxy routes
serviceRoutes.forEach(({ path, target, requireAuth }) => {
  const middlewares = requireAuth ? [authMiddleware] : [];
  
  app.use(
    path,
    ...middlewares,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: {
        [`^${path}`]: ''
      },
      onError: (err, req, res) => {
        logger.error('Proxy error:', err);
        res.status(502).json({ error: 'Service temporarily unavailable' });
      },
      onProxyReq: (proxyReq, req) => {
        // Forward user info to services
        if (req.user) {
          proxyReq.setHeader('x-user-id', req.user.id);
          proxyReq.setHeader('x-user-role', req.user.role);
        }
      }
    })
  );
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

export default app;