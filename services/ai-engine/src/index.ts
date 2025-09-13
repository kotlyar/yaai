import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { predictionRoutes } from './controllers/prediction';
import { optimizationRoutes } from './controllers/optimization';
import { analyticsRoutes } from './controllers/analytics';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    models: ['bid_optimizer', 'ctr_predictor', 'keyword_recommender']
  });
});

// Routes
app.use('/predictions', predictionRoutes);
app.use('/optimization', optimizationRoutes);
app.use('/analytics', analyticsRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`AI Engine running on port ${PORT}`);
});

export default app;