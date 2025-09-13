# Yandex Direct Manager

Система управления эффективностью рекламных кампаний в Яндекс.Директ

## Архитектура

Проект построен как монорепозиторий с микросервисной архитектурой, аналогичной watsondocs:

```
yandex-direct-manager/
├── apps/                    # Микросервисы
│   ├── api-gateway/        # API Gateway
│   ├── frontend/           # React Frontend
│   ├── auth-service/       # Аутентификация
│   ├── campaign-service/   # Управление кампаниями
│   ├── analytics-service/  # Аналитика
│   └── job-processor/      # Фоновые задачи
├── modules/                # Общие модули
│   ├── shared/            # Общие утилиты
│   ├── types/             # TypeScript типы
│   └── utils/             # Вспомогательные функции
├── data/                  # Конфигурации БД
├── secrets/               # Секреты и ключи
├── nginx/                 # Nginx конфигурация
└── docker-compose файлы
```

## Технологический стек

### Backend Services
- **Node.js** + **TypeScript** - основной язык разработки
- **Express.js** - веб-фреймворк
- **Prisma** - ORM для работы с базами данных
- **Bull** - очереди задач
- **Redis** - кэширование и очереди

### Frontend
- **React 18** + **TypeScript**
- **Vite** - сборщик
- **Ant Design** - UI компоненты
- **TanStack Query** - управление серверным состоянием
- **Zustand** - управление клиентским состоянием
- **Recharts** - графики и диаграммы

### Databases
- **PostgreSQL** - основная база данных
- **ClickHouse** - аналитическая база данных
- **Redis** - кэш и очереди

### DevOps
- **Docker** + **Docker Compose** - контейнеризация
- **Nginx** - reverse proxy и load balancer
- **ESLint** + **Prettier** + **Stylelint** - качество кода

## Быстрый старт

### Предварительные требования
- Node.js 18+
- Docker и Docker Compose
- Git

### Установка и запуск

1. **Клонирование репозитория:**
```bash
git clone <repository-url>
cd yandex-direct-manager
```

2. **Установка зависимостей:**
```bash
npm run install:all
```

3. **Запуск баз данных:**
```bash
npm run db
```

4. **Запуск в режиме разработки:**
```bash
npm run dev
```

5. **Доступ к приложению:**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- Auth Service: http://localhost:3002
- Campaign Service: http://localhost:3003
- Analytics Service: http://localhost:3004

## Доступные команды

```bash
# Разработка
npm run dev              # Запуск всех сервисов в dev режиме
npm run dev:build        # Пересборка и запуск
npm run db               # Запуск только баз данных

# Продакшн
npm run prod             # Запуск в продакшн режиме

# Управление
npm run logs             # Просмотр логов
npm run clean            # Очистка контейнеров и данных

# Качество кода
npm run lint             # Проверка кода
npm run format           # Форматирование кода
npm run test             # Запуск тестов

# Сборка
npm run build            # Сборка всех приложений
```

## Структура микросервисов

### API Gateway (`apps/api-gateway`)
- Единая точка входа для всех API запросов
- Маршрутизация запросов к соответствующим сервисам
- Аутентификация и авторизация
- Rate limiting и безопасность

### Frontend (`apps/frontend`)
- React приложение с современным UI
- Дашборды для управления кампаниями
- Аналитические отчеты и графики
- Responsive дизайн

### Auth Service (`apps/auth-service`)
- Регистрация и аутентификация пользователей
- JWT токены
- Интеграция с Яндекс.ID
- Управление сессиями

### Campaign Service (`apps/campaign-service`)
- CRUD операции с кампаниями
- Интеграция с Яндекс.Директ API
- Управление ключевыми словами и объявлениями
- Автоматическая оптимизация ставок

### Analytics Service (`apps/analytics-service`)
- Сбор и обработка метрик
- Генерация отчетов
- Машинное обучение для прогнозирования
- Интеграция с Яндекс.Метрика API

### Job Processor (`apps/job-processor`)
- Фоновые задачи и cron jobs
- Синхронизация данных с Яндекс API
- Автоматические уведомления
- Обработка больших объемов данных

## Интеграции

### Яндекс.Директ API
- Управление рекламными кампаниями
- Получение статистики
- Автоматическое управление ставками
- Синхронизация данных

### Яндекс.Метрика API
- Веб-аналитика
- Отслеживание конверсий
- Поведенческие метрики
- ROI анализ

## Мониторинг и логирование

- Централизованное логирование через Winston
- Метрики производительности
- Health checks для всех сервисов
- Error tracking и уведомления

## Безопасность

- JWT аутентификация
- HTTPS/TLS шифрование
- Rate limiting
- CORS настройки
- Валидация входных данных
- Секреты в environment переменных

## Разработка

### Добавление нового сервиса
1. Создать папку в `apps/`
2. Добавить `package.json` с зависимостями
3. Создать `Dockerfile` и `Dockerfile.dev`
4. Добавить сервис в `compose.yaml`
5. Обновить API Gateway для маршрутизации

### Работа с модулями
- `modules/types` - общие TypeScript типы
- `modules/shared` - общие утилиты и константы
- `modules/utils` - вспомогательные функции

## Deployment

Проект готов для развертывания в:
- **Docker Swarm**
- **Kubernetes**
- **Yandex Cloud**
- **AWS/GCP/Azure**

## Лицензия

MIT License
