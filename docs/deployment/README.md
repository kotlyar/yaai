# Руководство по развертыванию YAAI Platform

## Предварительные требования

### Системные требования

**Minimum:**
- CPU: 4 cores
- RAM: 8GB
- Storage: 100GB SSD
- Network: 100 Mbps

**Recommended (Production):**
- CPU: 8+ cores
- RAM: 32GB+
- Storage: 500GB+ NVMe SSD
- Network: 1 Gbps

### Программное обеспечение

- Docker 20.10+
- Docker Compose 2.0+
- Kubernetes 1.24+ (для production)
- Node.js 18+ (для development)
- Python 3.9+ (для AI Engine)

## Development Environment

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-org/yaai-platform.git
cd yaai-platform
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
# Database
DATABASE_URL=postgresql://yaai_user:yaai_password@localhost:5432/yaai
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

# Yandex Direct API
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret

# Services URLs
CAMPAIGN_SERVICE_URL=http://localhost:3001
ANALYTICS_SERVICE_URL=http://localhost:3002
AI_ENGINE_URL=http://localhost:3003
OPTIMIZATION_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3005
USER_SERVICE_URL=http://localhost:3006

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Monitoring
LOG_LEVEL=info
PROMETHEUS_ENABLED=true
```

### 3. Запуск с Docker Compose

```bash
# Запуск всех сервисов
docker-compose up -d

# Запуск только баз данных
docker-compose up -d postgres redis clickhouse elasticsearch rabbitmq

# Запуск в development режиме
npm install
npm run dev
```

### 4. Инициализация базы данных

```bash
# Миграции
npm run migrate

# Seed данные
npm run seed
```

### 5. Проверка работоспособности

```bash
# Health check всех сервисов
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# Веб-интерфейс
open http://localhost:3100
```

## Staging Environment

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Настройка SSL сертификатов

```bash
# Установка Certbot
sudo apt install certbot

# Получение SSL сертификата
sudo certbot certonly --standalone -d api.yaai-staging.com -d app.yaai-staging.com
```

### 3. Настройка Nginx

```nginx
# /etc/nginx/sites-available/yaai-staging
server {
    listen 80;
    server_name api.yaai-staging.com app.yaai-staging.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yaai-staging.com;
    
    ssl_certificate /etc/letsencrypt/live/api.yaai-staging.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yaai-staging.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name app.yaai-staging.com;
    
    ssl_certificate /etc/letsencrypt/live/app.yaai-staging.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.yaai-staging.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Развертывание

```bash
# Клонирование кода
git clone https://github.com/your-org/yaai-platform.git
cd yaai-platform

# Настройка переменных окружения
cp .env.staging .env

# Запуск
docker-compose -f docker-compose.staging.yml up -d

# Проверка логов
docker-compose logs -f
```

## Production Environment (Kubernetes)

### 1. Подготовка кластера

```bash
# Создание namespace
kubectl create namespace yaai

# Применение манифестов
kubectl apply -f infrastructure/kubernetes/
```

### 2. Настройка секретов

```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: yaai-secrets
  namespace: yaai
type: Opaque
stringData:
  database-url: postgresql://user:password@postgres:5432/yaai
  jwt-secret: your-super-secret-jwt-key
  yandex-client-id: your-yandex-client-id
  yandex-client-secret: your-yandex-client-secret
```

```bash
kubectl apply -f secrets.yaml
```

### 3. Настройка Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: yaai-ingress
  namespace: yaai
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - api.yaai.com
    - app.yaai.com
    secretName: yaai-tls
  rules:
  - host: api.yaai.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-gateway-service
            port:
              number: 3000
  - host: app.yaai.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-dashboard-service
            port:
              number: 3100
```

### 4. Настройка автомасштабирования

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
  namespace: yaai
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 5. Мониторинг

```bash
# Установка Prometheus Operator
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Установка Grafana dashboards
kubectl apply -f infrastructure/monitoring/grafana/
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build Docker images
      run: |
        docker build -t yaai/api-gateway:${{ github.sha }} services/api-gateway/
        docker build -t yaai/campaign-service:${{ github.sha }} services/campaign-service/
        # ... other services
    
    - name: Push to registry
      run: |
        docker push yaai/api-gateway:${{ github.sha }}
        # ... other images

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/api-gateway api-gateway=yaai/api-gateway:${{ github.sha }} -n yaai
        kubectl rollout status deployment/api-gateway -n yaai
```

## Backup и Recovery

### Database Backup

```bash
# Автоматический backup PostgreSQL
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="yaai"

# Создание backup
pg_dump -h localhost -U yaai_user -d $DB_NAME > $BACKUP_DIR/yaai_$DATE.sql

# Сжатие
gzip $BACKUP_DIR/yaai_$DATE.sql

# Удаление старых backup (старше 30 дней)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Загрузка в S3
aws s3 cp $BACKUP_DIR/yaai_$DATE.sql.gz s3://yaai-backups/postgres/
```

### Восстановление

```bash
# Восстановление из backup
gunzip -c yaai_20240101_120000.sql.gz | psql -h localhost -U yaai_user -d yaai
```

## Troubleshooting

### Общие проблемы

#### Сервис не запускается

```bash
# Проверка логов
docker-compose logs service-name

# Проверка ресурсов
docker stats

# Проверка сети
docker network ls
docker network inspect yaai-network
```

#### База данных недоступна

```bash
# Проверка подключения
psql -h localhost -U yaai_user -d yaai -c "SELECT 1;"

# Проверка логов PostgreSQL
docker-compose logs postgres
```

#### Высокая нагрузка

```bash
# Мониторинг ресурсов
htop
iotop
nethogs

# Проверка метрик в Prometheus
curl http://localhost:9090/api/v1/query?query=up
```

### Производительность

#### Оптимизация базы данных

```sql
-- Анализ медленных запросов
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Создание индексов
CREATE INDEX CONCURRENTLY idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX CONCURRENTLY idx_campaigns_status ON campaigns(status);
```

#### Настройка кэширования

```javascript
// Redis кэширование
const redis = new Redis(process.env.REDIS_URL);

// Кэширование на 1 час
await redis.setex(`campaign:${id}`, 3600, JSON.stringify(campaign));
```

### Безопасность

#### Аудит безопасности

```bash
# Сканирование Docker образов
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image yaai/api-gateway

# Проверка зависимостей
npm audit
npm audit fix
```

#### Обновление зависимостей

```bash
# Обновление всех зависимостей
npm update

# Проверка устаревших пакетов
npm outdated
```

## Мониторинг и алерты

### Ключевые метрики

- **Availability**: Uptime сервисов > 99.9%
- **Response Time**: P95 < 200ms для API
- **Error Rate**: < 0.1% ошибок
- **Database Performance**: Queries < 100ms
- **Resource Usage**: CPU < 80%, Memory < 85%

### Настройка алертов

```yaml
# alerting-rules.yml
groups:
- name: yaai-alerts
  rules:
  - alert: ServiceDown
    expr: up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "Service {{ $labels.instance }} is down"
      
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
    for: 2m
    labels:
      severity: warning
    annotations:
      summary: "High error rate on {{ $labels.service }}"
```