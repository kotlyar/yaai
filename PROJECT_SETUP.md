# Руководство по настройке проекта

## Быстрый старт

### Предварительные требования

- **Python 3.11+**
- **Node.js 18+**
- **Docker & Docker Compose**
- **Git**

### 1. Клонирование и настройка репозитория

```bash
# Клонирование репозитория
git clone <repository-url>
cd yandex-direct-manager

# Создание структуры проекта
mkdir -p {backend,frontend,docs,scripts,k8s}
```

### 2. Настройка Backend

```bash
cd backend

# Создание виртуального окружения
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или
venv\Scripts\activate  # Windows

# Установка Poetry
pip install poetry

# Создание pyproject.toml
poetry init
poetry add fastapi uvicorn sqlalchemy alembic psycopg2-binary redis celery pydantic
poetry add --group dev pytest pytest-asyncio black isort mypy

# Создание структуры проекта
mkdir -p {app,tests,alembic}
mkdir -p app/{models,routes,services,core}
```

#### pyproject.toml
```toml
[tool.poetry]
name = "yandex-direct-backend"
version = "0.1.0"
description = "Backend for Yandex Direct campaign management"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.104.1"
uvicorn = {extras = ["standard"], version = "^0.24.0"}
sqlalchemy = "^2.0.23"
alembic = "^1.12.1"
psycopg2-binary = "^2.9.9"
redis = "^5.0.1"
celery = "^5.3.4"
pydantic = "^2.5.0"
pydantic-settings = "^2.1.0"
httpx = "^0.25.2"
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
passlib = {extras = ["bcrypt"], version = "^1.7.4"}
python-multipart = "^0.0.6"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.3"
pytest-asyncio = "^0.21.1"
black = "^23.11.0"
isort = "^5.12.0"
mypy = "^1.7.1"
pre-commit = "^3.6.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.black]
line-length = 88
target-version = ['py311']

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

#### Основные файлы Backend

**app/main.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import auth, campaigns, analytics

app = FastAPI(
    title="Yandex Direct Manager API",
    description="API for managing Yandex Direct campaigns",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(campaigns.router, prefix="/api/v1/campaigns", tags=["campaigns"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])

@app.get("/")
async def root():
    return {"message": "Yandex Direct Manager API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

**app/core/config.py**
```python
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/yandex_direct"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Yandex API
    YANDEX_DIRECT_API_URL: str = "https://api.direct.yandex.com/json/v5"
    YANDEX_METRIKA_API_URL: str = "https://api-metrika.yandex.net"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 3. Настройка Frontend

```bash
cd frontend

# Создание React приложения с Vite
npm create vite@latest . -- --template react-ts
npm install

# Установка дополнительных зависимостей
npm install @tanstack/react-query zustand antd @ant-design/icons
npm install recharts axios date-fns
npm install -D @types/node tailwindcss postcss autoprefixer
npm install -D @vitejs/plugin-react

# Настройка Tailwind CSS
npx tailwindcss init -p
```

#### package.json
```json
{
  "name": "yandex-direct-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@ant-design/icons": "^5.2.6",
    "@tanstack/react-query": "^5.8.4",
    "antd": "^5.12.5",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "recharts": "^2.8.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### 4. Docker Configuration

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/yandex_direct
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: yandex_direct
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  clickhouse:
    image: clickhouse/clickhouse-server:latest
    ports:
      - "8123:8123"
      - "9000:9000"
    volumes:
      - clickhouse_data:/var/lib/clickhouse
      - ./clickhouse/config.xml:/etc/clickhouse-server/config.xml

  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A app.core.celery worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/yandex_direct
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

volumes:
  postgres_data:
  redis_data:
  clickhouse_data:
```

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Установка Poetry
RUN pip install poetry

# Копирование файлов зависимостей
COPY pyproject.toml poetry.lock ./

# Настройка Poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev

# Копирование кода приложения
COPY . .

# Создание пользователя для безопасности
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host"]
```

### 5. Настройка базы данных

#### Alembic Configuration
```bash
cd backend
alembic init alembic
```

**alembic.ini**
```ini
[alembic]
script_location = alembic
prepend_sys_path = .
version_path_separator = os
sqlalchemy.url = postgresql://postgres:password@localhost/yandex_direct

[post_write_hooks]
hooks = black
black.type = console_scripts
black.entrypoint = black
black.options = -l 79 REVISION_SCRIPT_FILENAME

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

### 6. Переменные окружения

#### Backend .env
```bash
# backend/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/yandex_direct
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-super-secret-key-here-change-in-production
YANDEX_DIRECT_API_URL=https://api.direct.yandex.com/json/v5
YANDEX_METRIKA_API_URL=https://api-metrika.yandex.net
ALLOWED_HOSTS=["http://localhost:3000"]
```

#### Frontend .env
```bash
# frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=Yandex Direct Manager
```

### 7. Запуск проекта

```bash
# Запуск всех сервисов
docker-compose up -d

# Или запуск в режиме разработки
docker-compose up

# Применение миграций базы данных
docker-compose exec backend alembic upgrade head

# Создание суперпользователя
docker-compose exec backend python scripts/create_superuser.py
```

### 8. Полезные скрипты

#### scripts/create_superuser.py
```python
import asyncio
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash

async def create_superuser():
    db = next(get_db())
    
    admin_user = User(
        email="admin@example.com",
        password_hash=get_password_hash("admin123"),
        is_active=True,
        is_superuser=True
    )
    
    db.add(admin_user)
    db.commit()
    print("Superuser created successfully!")

if __name__ == "__main__":
    asyncio.run(create_superuser())
```

#### Makefile
```makefile
.PHONY: dev build test lint clean

dev:
	docker-compose up

build:
	docker-compose build

test:
	docker-compose exec backend pytest
	cd frontend && npm test

lint:
	docker-compose exec backend black . && isort .
	cd frontend && npm run lint

clean:
	docker-compose down -v
	docker system prune -f

migrate:
	docker-compose exec backend alembic upgrade head

create-migration:
	docker-compose exec backend alembic revision --autogenerate -m "$(message)"

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend python

psql:
	docker-compose exec postgres psql -U postgres -d yandex_direct
```

### 9. Настройка IDE

#### VSCode settings.json
```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": true,
  "python.formatting.provider": "black",
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### 10. Git Hooks (Pre-commit)

#### .pre-commit-config.yaml
```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files

  - repo: https://github.com/psf/black
    rev: 23.11.0
    hooks:
      - id: black
        language_version: python3.11

  - repo: https://github.com/pycqa/isort
    rev: 5.12.0
    hooks:
      - id: isort

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.53.0
    hooks:
      - id: eslint
        files: \.(js|ts|tsx)$
        types: [file]
```

Теперь ваш проект готов к разработке! Запустите `make dev` для начала работы.