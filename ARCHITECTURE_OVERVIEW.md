# Архитектурный обзор системы управления рекламными кампаниями

## Общая архитектура системы

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  React + TypeScript │ Ant Design │ Recharts │ TanStack Query   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API Gateway                             │
├─────────────────────────────────────────────────────────────────┤
│           Nginx + Load Balancer + SSL Termination              │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend Services                           │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI │ Auth Service │ Campaign Service │ Analytics Service  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PostgreSQL   │ │    Redis     │ │ ClickHouse   │ │ External APIs│
│ (Main DB)    │ │ (Cache/Jobs) │ │ (Analytics)  │ │ (Yandex)     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

## Микросервисная архитектура

### 1. Authentication Service
```python
# Сервис аутентификации и авторизации
services/
├── auth/
│   ├── models/
│   │   ├── user.py
│   │   └── token.py
│   ├── routes/
│   │   ├── login.py
│   │   └── register.py
│   ├── middleware/
│   │   └── jwt_middleware.py
│   └── main.py
```

**Функции:**
- JWT токены
- OAuth интеграция с Яндекс.ID
- Управление пользователями
- Ролевая модель доступа

### 2. Campaign Management Service
```python
# Сервис управления кампаниями
services/
├── campaigns/
│   ├── models/
│   │   ├── campaign.py
│   │   ├── ad_group.py
│   │   └── keyword.py
│   ├── routes/
│   │   ├── campaigns.py
│   │   └── optimization.py
│   ├── integrations/
│   │   └── yandex_direct.py
│   └── main.py
```

**Функции:**
- CRUD операции с кампаниями
- Интеграция с Яндекс.Директ API
- Автоматическая оптимизация ставок
- Управление ключевыми словами

### 3. Analytics Service
```python
# Сервис аналитики
services/
├── analytics/
│   ├── models/
│   │   ├── metrics.py
│   │   └── reports.py
│   ├── routes/
│   │   ├── dashboard.py
│   │   └── reports.py
│   ├── processors/
│   │   └── data_processor.py
│   └── main.py
```

**Функции:**
- Сбор и обработка метрик
- Генерация отчетов
- Прогнозирование эффективности
- A/B тестирование

## База данных

### PostgreSQL Schema
```sql
-- Пользователи
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    yandex_client_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Рекламные кампании
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    yandex_campaign_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    budget DECIMAL(10,2),
    daily_budget DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Группы объявлений
CREATE TABLE ad_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    yandex_ad_group_id BIGINT UNIQUE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ключевые слова
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_group_id UUID REFERENCES ad_groups(id),
    yandex_keyword_id BIGINT UNIQUE,
    keyword TEXT NOT NULL,
    bid DECIMAL(10,2),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### ClickHouse Schema (Analytics)
```sql
-- Метрики кампаний (временные ряды)
CREATE TABLE campaign_metrics (
    date Date,
    campaign_id String,
    impressions UInt64,
    clicks UInt64,
    cost Float64,
    conversions UInt32,
    revenue Float64
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (campaign_id, date);

-- Метрики ключевых слов
CREATE TABLE keyword_metrics (
    date Date,
    keyword_id String,
    impressions UInt64,
    clicks UInt64,
    cost Float64,
    position Float32,
    quality_score UInt8
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (keyword_id, date);
```

## API Endpoints

### Campaign Management API
```python
from fastapi import FastAPI, Depends
from typing import List

app = FastAPI(title="Campaign Management API")

@app.get("/campaigns", response_model=List[Campaign])
async def get_campaigns(
    user_id: str = Depends(get_current_user_id)
):
    """Получить список кампаний пользователя"""
    pass

@app.post("/campaigns", response_model=Campaign)
async def create_campaign(
    campaign: CampaignCreate,
    user_id: str = Depends(get_current_user_id)
):
    """Создать новую кампанию"""
    pass

@app.put("/campaigns/{campaign_id}/optimize")
async def optimize_campaign(
    campaign_id: str,
    optimization_params: OptimizationParams
):
    """Оптимизировать кампанию"""
    pass
```

### Analytics API
```python
@app.get("/analytics/dashboard")
async def get_dashboard_data(
    user_id: str = Depends(get_current_user_id),
    date_from: date = Query(...),
    date_to: date = Query(...)
):
    """Получить данные для дашборда"""
    pass

@app.get("/analytics/reports/{report_type}")
async def generate_report(
    report_type: ReportType,
    filters: ReportFilters = Depends()
):
    """Сгенерировать отчет"""
    pass
```

## Интеграция с Яндекс.Директ API

### Конфигурация клиента
```python
from yandex_direct import YandexDirectClient

class DirectAPIClient:
    def __init__(self, token: str):
        self.client = YandexDirectClient(token)
    
    async def get_campaigns(self) -> List[Campaign]:
        """Получить кампании из Яндекс.Директ"""
        response = await self.client.campaigns().get({
            "SelectionCriteria": {},
            "FieldNames": ["Id", "Name", "Status", "StatusPayment"]
        })
        return response.get("Campaigns", [])
    
    async def update_bids(self, keyword_bids: List[KeywordBid]):
        """Обновить ставки ключевых слов"""
        await self.client.keywords().set_bids({
            "KeywordBids": [
                {
                    "KeywordId": bid.keyword_id,
                    "SearchBid": bid.search_bid,
                    "ContextBid": bid.context_bid
                }
                for bid in keyword_bids
            ]
        })
```

### Фоновые задачи (Celery)
```python
from celery import Celery

celery_app = Celery("yandex_direct_manager")

@celery_app.task
def sync_campaigns_data(user_id: str):
    """Синхронизировать данные кампаний"""
    # Получить токен пользователя
    # Загрузить данные из Яндекс.Директ
    # Обновить базу данных
    pass

@celery_app.task
def optimize_campaign_bids(campaign_id: str):
    """Оптимизировать ставки кампании"""
    # Анализ производительности ключевых слов
    # Расчет оптимальных ставок
    # Обновление ставок через API
    pass

@celery_app.task
def generate_daily_reports():
    """Генерировать ежедневные отчеты"""
    pass
```

## Frontend Architecture

### React Component Structure
```typescript
// src/components/Dashboard/Dashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col } from 'antd';
import { MetricsChart } from './MetricsChart';
import { CampaignsList } from './CampaignsList';

export const Dashboard: React.FC = () => {
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData
  });

  return (
    <div className="dashboard">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Метрики кампаний">
            <MetricsChart data={dashboardData?.metrics} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Список кампаний">
            <CampaignsList campaigns={dashboardData?.campaigns} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
```

### State Management (Zustand)
```typescript
// src/store/campaignStore.ts
import { create } from 'zustand';
import { Campaign } from '../types';

interface CampaignStore {
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  loading: boolean;
  setCampaigns: (campaigns: Campaign[]) => void;
  selectCampaign: (campaign: Campaign) => void;
  optimizeCampaign: (campaignId: string) => Promise<void>;
}

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  
  setCampaigns: (campaigns) => set({ campaigns }),
  
  selectCampaign: (campaign) => set({ selectedCampaign: campaign }),
  
  optimizeCampaign: async (campaignId) => {
    set({ loading: true });
    try {
      await optimizeCampaignAPI(campaignId);
      // Обновить данные кампании
    } finally {
      set({ loading: false });
    }
  }
}));
```

## Deployment Configuration

### Docker Compose для разработки
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/yandex_direct
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=yandex_direct
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  clickhouse:
    image: yandex/clickhouse-server
    ports:
      - "8123:8123"
    volumes:
      - clickhouse_data:/var/lib/clickhouse

volumes:
  postgres_data:
  clickhouse_data:
```

### Kubernetes Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: yandex-direct-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Мониторинг и логирование

### Prometheus Metrics
```python
# backend/monitoring.py
from prometheus_client import Counter, Histogram, Gauge

# Метрики API
api_requests_total = Counter(
    'api_requests_total',
    'Total API requests',
    ['method', 'endpoint', 'status']
)

api_request_duration = Histogram(
    'api_request_duration_seconds',
    'API request duration'
)

# Бизнес-метрики
active_campaigns = Gauge(
    'active_campaigns_total',
    'Total number of active campaigns'
)

daily_spend = Gauge(
    'daily_spend_rubles',
    'Daily advertising spend in rubles'
)
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Yandex Direct Manager",
    "panels": [
      {
        "title": "API Requests per Second",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(api_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Active Campaigns",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_campaigns_total"
          }
        ]
      }
    ]
  }
}
```

Эта архитектура обеспечивает масштабируемость, надежность и высокую производительность системы управления рекламными кампаниями в Яндекс.Директ.