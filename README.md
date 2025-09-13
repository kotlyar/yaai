# YAAI - Yandex Ads AI Management Platform

Платформа для управления эффективностью рекламных кампаний в Яндекс Директ с использованием искусственного интеллекта.

## 🚀 Архитектура

Проект построен на микросервисной архитектуре, вдохновленной лучшими практиками Watson Docs:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Web Dashboard  │  Mobile App  │  Browser Extension         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY                              │
├─────────────────────────────────────────────────────────────┤
│  Authentication  │  Rate Limiting  │  Request Routing       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                  CORE SERVICES                              │
├─────────────────────────────────────────────────────────────┤
│ Campaign Mgmt │ Analytics │ AI Engine │ Optimization       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   DATA LAYER                                │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Redis  │  ClickHouse  │  Elasticsearch     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Основные функции

- **Автоматическое управление кампаниями** - AI-оптимизация ставок и бюджетов
- **Аналитика в реальном времени** - Мониторинг эффективности
- **Прогнозирование** - ML-модели для предсказания результатов
- **Автоматизация** - Правила и триггеры для управления
- **Интеграция с Яндекс.Директ API** - Полная синхронизация данных

## 🛠 Технологический стек

### Backend
- **API Gateway**: Kong/Nginx
- **Core Services**: Node.js/TypeScript, Python (ML)
- **Databases**: PostgreSQL, Redis, ClickHouse
- **Message Queue**: RabbitMQ/Apache Kafka
- **ML/AI**: TensorFlow, PyTorch, scikit-learn

### Frontend
- **Web**: React.js/Next.js, TypeScript
- **Mobile**: React Native
- **State Management**: Redux Toolkit/Zustand
- **UI**: Material-UI/Ant Design

### Infrastructure
- **Containerization**: Docker, Kubernetes
- **Monitoring**: Prometheus, Grafana, ELK Stack
- **CI/CD**: GitHub Actions/GitLab CI

## 📁 Структура проекта

```
yaai/
├── services/                   # Микросервисы
├── apps/                      # Клиентские приложения
├── packages/                  # Общие библиотеки
├── infrastructure/            # Инфраструктура и DevOps
├── docs/                      # Документация
└── tools/                     # Утилиты разработки
```

## 🚦 Быстрый старт

1. Клонируйте репозиторий
2. Установите зависимости: `npm install`
3. Запустите development окружение: `npm run dev`
4. Откройте http://localhost:3000

## 📖 Документация

- [API Reference](./docs/api/)
- [Architecture Guide](./docs/architecture/)
- [Deployment Guide](./docs/deployment/)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Участие в разработке

Мы приветствуем вклад в развитие проекта! Ознакомьтесь с [руководством по участию](./CONTRIBUTING.md).

## 📄 Лицензия

MIT License - см. файл [LICENSE](./LICENSE)