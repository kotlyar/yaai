import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Yandex Direct API
  YANDEX_DIRECT_TOKEN: process.env.YANDEX_DIRECT_TOKEN!,
  YANDEX_DIRECT_API_URL: 'https://api.direct.yandex.com/json/v5',
  YANDEX_DIRECT_REPORTS_URL: 'https://api.direct.yandex.com/v4/json/',
  
  // OpenAI for insights
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  
  // Frontend
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // Analytics
  CLICKHOUSE_URL: process.env.CLICKHOUSE_URL,
  ANALYTICS_BATCH_SIZE: parseInt(process.env.ANALYTICS_BATCH_SIZE || '1000', 10),
  
  // Caching
  CACHE_TTL: parseInt(process.env.CACHE_TTL || '300', 10), // 5 minutes
  
  // Rate limiting
  YANDEX_API_RATE_LIMIT: parseInt(process.env.YANDEX_API_RATE_LIMIT || '10', 10), // requests per second
} as const;

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'YANDEX_DIRECT_TOKEN',
  'OPENAI_API_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}