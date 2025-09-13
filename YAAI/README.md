# YAAI - Yandex Ads Analytics Intelligence

🚀 Платформа для анализа эффективности рекламных кампаний в Яндекс Директе

## 🎯 Основные возможности

- **📊 Аналитика кампаний** - детальный анализ показателей эффективности
- **💰 ROI оптимизация** - рекомендации по улучшению окупаемости
- **📈 Прогнозирование** - ML-модели для предсказания результатов
- **🎨 Интерактивные дашборды** - визуализация данных в реальном времени
- **🔄 Автоматизация** - автоматические отчеты и оптимизация ставок
- **📱 Multi-platform** - веб, мобильное приложение, API

## 🏗️ Архитектура

### Monorepo структура:
```
YAAI/
├── apps/
│   ├── backend/         # Node.js + TypeScript API
│   ├── frontend/        # React + TypeScript Dashboard
│   ├── mobile/          # React Native приложение
│   └── analytics/       # Python ML сервисы
├── packages/
│   ├── shared/          # Общие типы и утилиты
│   ├── ui/              # UI компоненты
│   └── yandex-api/      # SDK для Yandex Direct API
└── infrastructure/     # Docker, K8s, CI/CD
```

### Технологический стек:
- **Backend**: Node.js, TypeScript, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, Next.js, TailwindCSS
- **Analytics**: Python, pandas, scikit-learn, TensorFlow
- **Infrastructure**: Docker, Kubernetes, Redis, ClickHouse
- **APIs**: Yandex Direct API v5, OpenAI API

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в dev режиме
npm run dev

# Сборка продакшн версии
npm run build

# Запуск через Docker
npm run docker:up
```

## 📦 Основные пакеты

- `@yaai/backend` - REST API и бизнес-логика
- `@yaai/frontend` - Веб-интерфейс дашборда
- `@yaai/mobile` - Мобильное приложение
- `@yaai/analytics` - ML модели и аналитика
- `@yaai/shared` - Общие типы и утилиты
- `@yaai/ui` - Переиспользуемые UI компоненты
- `@yaai/yandex-api` - SDK для работы с Yandex Direct

## 🔧 Конфигурация

Создайте `.env` файл:
```env
DATABASE_URL="postgresql://..."
YANDEX_DIRECT_TOKEN="..."
OPENAI_API_KEY="..."
REDIS_URL="redis://..."
```

## 📊 Основные метрики

- **CTR** (Click-Through Rate)
- **CPC** (Cost Per Click) 
- **ROI** (Return on Investment)
- **ROAS** (Return on Ad Spend)
- **Quality Score**
- **Conversion Rate**
- **LTV** (Lifetime Value)

## 🎨 Дашборды

1. **Обзор кампаний** - общая статистика
2. **Анализ ключевых слов** - эффективность запросов
3. **Географическая аналитика** - региональные показатели
4. **Временные тренды** - динамика по времени
5. **Конкурентный анализ** - сравнение с рынком
6. **Прогнозы и рекомендации** - ML-инсайты