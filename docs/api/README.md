# API Documentation

## Обзор

YAAI Platform предоставляет RESTful API для управления рекламными кампаниями в Яндекс.Директ. Все API эндпоинты доступны через API Gateway и требуют аутентификации.

## Базовый URL

```
https://api.yaai.platform/api/v1
```

## Аутентификация

API использует JWT токены для аутентификации. Токен должен быть включен в заголовок `Authorization`:

```
Authorization: Bearer <your_jwt_token>
```

### Получение токена

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## API Endpoints

### Campaigns API

#### Получить список кампаний

```http
GET /api/campaigns
```

**Query Parameters:**
- `page` (integer): Номер страницы (default: 1)
- `limit` (integer): Количество записей на странице (default: 20)
- `status` (string): Фильтр по статусу (ACTIVE, PAUSED, ARCHIVED)
- `search` (string): Поиск по названию

**Response:**
```json
{
  "data": [
    {
      "id": "campaign-id",
      "name": "My Campaign",
      "status": "ACTIVE",
      "type": "SEARCH",
      "budget": 10000,
      "dailyBudget": 500,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": null,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### Создать кампанию

```http
POST /api/campaigns
Content-Type: application/json

{
  "name": "New Campaign",
  "type": "SEARCH",
  "budget": 10000,
  "dailyBudget": 500,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "settings": {
    "timeTargeting": {
      "timezone": "Europe/Moscow",
      "schedule": [
        {
          "days": ["MONDAY", "TUESDAY"],
          "hours": [9, 10, 11, 12, 13, 14, 15, 16, 17]
        }
      ]
    },
    "geoTargeting": {
      "regions": [1, 213], // Россия, Москва
      "excludeRegions": []
    }
  }
}
```

#### Обновить кампанию

```http
PUT /api/campaigns/:id
Content-Type: application/json

{
  "name": "Updated Campaign Name",
  "status": "PAUSED",
  "budget": 15000
}
```

#### Удалить кампанию

```http
DELETE /api/campaigns/:id
```

### Keywords API

#### Получить ключевые слова кампании

```http
GET /api/campaigns/:campaignId/keywords
```

#### Добавить ключевые слова

```http
POST /api/campaigns/:campaignId/keywords
Content-Type: application/json

{
  "keywords": [
    {
      "text": "купить обувь",
      "matchType": "PHRASE",
      "bid": 50
    },
    {
      "text": "обувь москва",
      "matchType": "EXACT",
      "bid": 75
    }
  ]
}
```

### Analytics API

#### Получить статистику кампании

```http
GET /api/analytics/campaigns/:campaignId/stats
```

**Query Parameters:**
- `dateFrom` (string): Начальная дата (YYYY-MM-DD)
- `dateTo` (string): Конечная дата (YYYY-MM-DD)
- `groupBy` (string): Группировка (day, week, month)

**Response:**
```json
{
  "data": [
    {
      "date": "2024-01-01",
      "impressions": 1000,
      "clicks": 50,
      "ctr": 5.0,
      "cost": 2500,
      "conversions": 5,
      "conversionRate": 10.0,
      "cpa": 500,
      "roas": 2.5
    }
  ],
  "summary": {
    "totalImpressions": 30000,
    "totalClicks": 1500,
    "avgCtr": 5.0,
    "totalCost": 75000,
    "totalConversions": 150,
    "avgCpa": 500,
    "avgRoas": 2.5
  }
}
```

### AI API

#### Получить рекомендации по оптимизации

```http
GET /api/ai/campaigns/:campaignId/recommendations
```

**Response:**
```json
{
  "recommendations": [
    {
      "type": "BID_OPTIMIZATION",
      "priority": "HIGH",
      "title": "Увеличить ставки на высокоэффективные ключевые слова",
      "description": "Рекомендуется увеличить ставки на 15% для ключевых слов с CTR выше 7%",
      "impact": {
        "estimatedClicksIncrease": 25,
        "estimatedCostIncrease": 1200,
        "estimatedConversionsIncrease": 3
      },
      "keywords": ["купить обувь", "обувь москва"]
    }
  ]
}
```

#### Запустить оптимизацию кампании

```http
POST /api/ai/campaigns/:campaignId/optimize
Content-Type: application/json

{
  "type": "AUTO_BID",
  "settings": {
    "maxBidIncrease": 0.5,
    "minCtr": 3.0,
    "targetRoas": 2.0
  }
}
```

### Users API

#### Получить профиль пользователя

```http
GET /api/users/profile
```

#### Обновить профиль

```http
PUT /api/users/profile
Content-Type: application/json

{
  "name": "New Name",
  "settings": {
    "notifications": {
      "email": true,
      "push": false
    },
    "dashboard": {
      "defaultView": "campaigns",
      "autoRefresh": true
    }
  }
}
```

## Error Handling

API возвращает стандартные HTTP коды статуса:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

## Rate Limiting

API имеет ограничения по количеству запросов:

- **Authenticated users**: 1000 requests per hour
- **Premium users**: 5000 requests per hour

При превышении лимита возвращается статус `429 Too Many Requests`.

## Webhooks

YAAI Platform поддерживает webhooks для уведомлений о событиях:

### Настройка webhook

```http
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["campaign.created", "campaign.updated", "optimization.completed"],
  "secret": "your-webhook-secret"
}
```

### Поддерживаемые события

- `campaign.created` - Создание кампании
- `campaign.updated` - Обновление кампании
- `campaign.paused` - Приостановка кампании
- `optimization.started` - Начало оптимизации
- `optimization.completed` - Завершение оптимизации
- `budget.exceeded` - Превышение бюджета
- `performance.alert` - Алерт по эффективности

## SDK и библиотеки

### JavaScript/TypeScript

```bash
npm install @yaai/sdk
```

```javascript
import { YaaiClient } from '@yaai/sdk';

const client = new YaaiClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.yaai.platform'
});

// Получить кампании
const campaigns = await client.campaigns.list();

// Создать кампанию
const newCampaign = await client.campaigns.create({
  name: 'My Campaign',
  type: 'SEARCH',
  budget: 10000
});
```

### Python

```bash
pip install yaai-sdk
```

```python
from yaai import YaaiClient

client = YaaiClient(
    api_key='your-api-key',
    base_url='https://api.yaai.platform'
)

# Получить кампании
campaigns = client.campaigns.list()

# Создать кампанию
new_campaign = client.campaigns.create(
    name='My Campaign',
    type='SEARCH',
    budget=10000
)
```

## OpenAPI Specification

Полная OpenAPI спецификация доступна по адресу:
```
https://api.yaai.platform/docs/openapi.json
```

Swagger UI:
```
https://api.yaai.platform/docs
```