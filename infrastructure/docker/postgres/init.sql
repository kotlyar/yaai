-- Create databases for different services
CREATE DATABASE yaai_campaigns;
CREATE DATABASE yaai_users;
CREATE DATABASE yaai_analytics;

-- Create users
CREATE USER campaign_service WITH PASSWORD 'campaign_password';
CREATE USER user_service WITH PASSWORD 'user_password';
CREATE USER analytics_service WITH PASSWORD 'analytics_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE yaai_campaigns TO campaign_service;
GRANT ALL PRIVILEGES ON DATABASE yaai_users TO user_service;
GRANT ALL PRIVILEGES ON DATABASE yaai_analytics TO analytics_service;

-- Create extensions
\c yaai_campaigns;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

\c yaai_users;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c yaai_analytics;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "timescaledb";