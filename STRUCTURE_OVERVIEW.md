# Обзор созданной структуры проекта

## 📁 Структура проекта (аналогичная watsondocs)

```
yandex-direct-manager/
├── 📱 apps/                           # Микросервисы
│   ├── api-gateway/                   # API Gateway и маршрутизация
│   │   ├── package.json
│   │   └── Dockerfile.dev
│   ├── frontend/                      # React приложение
│   │   ├── package.json
│   │   └── Dockerfile.dev
│   ├── auth-service/                  # Сервис аутентификации
│   │   └── package.json
│   ├── campaign-service/              # Управление кампаниями
│   │   └── package.json
│   ├── analytics-service/             # Аналитика и отчеты
│   │   └── package.json
│   └── job-processor/                 # Фоновые задачи
│       └── package.json
├── 📦 modules/                        # Общие модули
│   ├── shared/                        # Общие утилиты
│   │   └── package.json
│   ├── types/                         # TypeScript типы
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/index.ts
│   └── utils/                         # Вспомогательные функции
│       └── package.json
├── 🗄️ data/                           # Конфигурации баз данных
│   ├── postgres/
│   │   └── init/01-init-databases.sql
│   ├── redis/
│   │   └── redis.conf
│   └── clickhouse/
│       └── config.xml
├── 🔐 secrets/                        # Секреты (пустая папка)
├── 🌐 public/                         # Статические файлы
├── 🐚 shell/                          # Shell скрипты
├── 🔧 nginx/                          # Nginx конфигурация
├── 🐳 Docker конфигурации
│   ├── compose.yaml                   # Основной compose файл
│   ├── compose.dev.yaml               # Настройки для разработки
│   └── compose.db.yaml                # Только базы данных
├── 🔧 Конфигурационные файлы
│   ├── package.json                   # Корневой package.json для монорепо
│   ├── .eslintrc.json                 # ESLint конфигурация
│   ├── .eslintignore                  # ESLint игнорирование
│   ├── .stylelintrc                   # Stylelint конфигурация
│   ├── .editorconfig                  # EditorConfig
│   ├── .gitignore                     # Git игнорирование
│   ├── .gitattributes                 # Git атрибуты
│   ├── .npmrc                         # NPM конфигурация
│   ├── dev.env                        # Development окружение
│   ├── prod.env                       # Production окружение
│   └── Makefile                       # Команды для управления
└── 📚 Документация
    ├── README.md                      # Основная документация
    ├── TECH_STACK.md                  # Технологический стек
    ├── ARCHITECTURE_OVERVIEW.md       # Архитектурный обзор
    ├── PROJECT_SETUP.md               # Настройка проекта
    └── STRUCTURE_OVERVIEW.md          # Этот файл
```

## 🎯 Ключевые особенности созданной структуры

### 1. Монорепозиторий с workspaces
- Единый `package.json` в корне управляет всеми зависимостями
- Каждый сервис и модуль имеет свой `package.json`
- Общие зависимости устанавливаются в корне
- Использование npm workspaces для управления

### 2. Микросервисная архитектура
- **API Gateway** - единая точка входа
- **Frontend** - React SPA
- **Auth Service** - аутентификация и авторизация
- **Campaign Service** - управление рекламными кампаниями
- **Analytics Service** - аналитика и отчеты
- **Job Processor** - фоновые задачи

### 3. Общие модули
- **@yandex-direct/types** - TypeScript типы для всего проекта
- **@yandex-direct/shared** - общие утилиты и константы
- **@yandex-direct/utils** - вспомогательные функции

### 4. Docker Compose конфигурация
- **compose.yaml** - базовая продакшн конфигурация
- **compose.dev.yaml** - настройки для разработки (hot reload)
- **compose.db.yaml** - только базы данных для локальной разработки

### 5. Качество кода
- **ESLint** - статический анализ JavaScript/TypeScript
- **Prettier** - форматирование кода (через ESLint)
- **Stylelint** - проверка CSS/SCSS
- **EditorConfig** - единые настройки редактора

## 🚀 Команды для работы с проектом

### Основные команды
```bash
# Установка всех зависимостей
make install
# или
npm run install:all

# Запуск в режиме разработки
make dev
# или
npm run dev

# Запуск только баз данных
make db
# или
npm run db

# Просмотр логов
make logs
# или
npm run logs

# Очистка
make clean
# или
npm run clean
```

### Команды качества кода
```bash
# Проверка кода
make lint
# или
npm run lint

# Форматирование кода
make format
# или
npm run format

# Тесты
make test
# или
npm run test
```

## 🔧 Технологический стек

### Backend (Node.js + TypeScript)
- **Express.js** - веб-фреймворк
- **Prisma** - ORM
- **Bull** - очереди задач
- **Redis** - кэш и очереди
- **JWT** - аутентификация

### Frontend (React + TypeScript)
- **Vite** - сборщик
- **Ant Design** - UI компоненты
- **TanStack Query** - управление серверным состоянием
- **Zustand** - управление клиентским состоянием
- **Recharts** - графики и диаграммы

### Databases
- **PostgreSQL** - основная реляционная БД
- **ClickHouse** - аналитическая OLAP БД
- **Redis** - кэш, сессии, очереди

### DevOps
- **Docker** + **Docker Compose** - контейнеризация
- **Nginx** - reverse proxy (готов к настройке)

## 🔌 Интеграции

### Яндекс API
- **Яндекс.Директ API v5** - управление кампаниями
- **Яндекс.Метрика API** - веб-аналитика
- **Yandex Cloud API** - облачные сервисы

### Внешние сервисы
- JWT токены для аутентификации
- HTTP клиенты для API интеграций
- WebSocket для real-time уведомлений

## 📊 Архитектура данных

### PostgreSQL (основные данные)
- `yandex_direct_auth` - пользователи и сессии
- `yandex_direct_campaigns` - кампании, группы, ключевые слова
- `yandex_direct_analytics` - агрегированная аналитика
- `yandex_direct_jobs` - задачи и их статусы

### ClickHouse (аналитические данные)
- Временные ряды метрик кампаний
- Детальная статистика по ключевым словам
- Данные для машинного обучения

### Redis (кэш и очереди)
- База 0: общий кэш
- База 1: сессии пользователей
- База 2: кэш аналитических данных
- База 3: очереди задач

## 🛡️ Безопасность

### Аутентификация и авторизация
- JWT токены с коротким временем жизни
- Refresh токены в HTTP-only cookies
- Роли и разрешения пользователей

### API Security
- Rate limiting на уровне API Gateway
- CORS настройки
- Валидация входных данных через Joi
- Helmet.js для HTTP заголовков безопасности

### Данные
- Шифрование паролей через bcrypt
- Секреты в environment переменных
- Отдельные базы данных для каждого сервиса

## 📈 Масштабируемость

### Горизонтальное масштабирование
- Каждый сервис может масштабироваться независимо
- Stateless архитектура
- Load balancing через Nginx

### Производительность
- Кэширование на разных уровнях (Redis)
- Аналитические запросы в ClickHouse
- Асинхронная обработка через очереди

### Мониторинг
- Health checks для всех сервисов
- Централизованное логирование
- Метрики производительности

## 🎯 Следующие шаги

1. **Реализация базовых сервисов:**
   - API Gateway с маршрутизацией
   - Auth Service с JWT
   - Frontend с базовыми компонентами

2. **Интеграция с Яндекс API:**
   - Настройка OAuth для Яндекс.Директ
   - Синхронизация данных кампаний
   - Получение статистики

3. **Аналитика и оптимизация:**
   - Дашборды с метриками
   - Автоматическая оптимизация ставок
   - Отчеты и прогнозы

4. **DevOps и мониторинг:**
   - CI/CD pipeline
   - Monitoring и alerting
   - Backup стратегия

Структура проекта готова для начала разработки! 🚀