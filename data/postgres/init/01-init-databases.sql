-- Создание баз данных для каждого сервиса
CREATE DATABASE yandex_direct_auth;
CREATE DATABASE yandex_direct_campaigns;
CREATE DATABASE yandex_direct_analytics;
CREATE DATABASE yandex_direct_jobs;

-- Создание пользователей (опционально)
-- CREATE USER auth_user WITH PASSWORD 'auth_password';
-- CREATE USER campaigns_user WITH PASSWORD 'campaigns_password';
-- CREATE USER analytics_user WITH PASSWORD 'analytics_password';
-- CREATE USER jobs_user WITH PASSWORD 'jobs_password';

-- GRANT ALL PRIVILEGES ON DATABASE yandex_direct_auth TO auth_user;
-- GRANT ALL PRIVILEGES ON DATABASE yandex_direct_campaigns TO campaigns_user;
-- GRANT ALL PRIVILEGES ON DATABASE yandex_direct_analytics TO analytics_user;
-- GRANT ALL PRIVILEGES ON DATABASE yandex_direct_jobs TO jobs_user;