.PHONY: help install dev dev-build prod db db-stop logs clean lint format test build

# Показать доступные команды
help:
	@echo "Доступные команды:"
	@echo "  install     - Установить все зависимости"
	@echo "  dev         - Запустить в режиме разработки"
	@echo "  dev-build   - Пересобрать и запустить в dev режиме"
	@echo "  prod        - Запустить в продакшн режиме"
	@echo "  db          - Запустить только базы данных"
	@echo "  db-stop     - Остановить базы данных"
	@echo "  logs        - Показать логи"
	@echo "  clean       - Очистить контейнеры и данные"
	@echo "  lint        - Проверить код"
	@echo "  format      - Форматировать код"
	@echo "  test        - Запустить тесты"
	@echo "  build       - Собрать все приложения"

# Установить все зависимости
install:
	npm install
	npm run install:all

# Запуск в режиме разработки
dev:
	docker-compose -f compose.yaml -f compose.dev.yaml up

# Пересборка и запуск в dev режиме
dev-build:
	docker-compose -f compose.yaml -f compose.dev.yaml up --build

# Запуск в продакшн режиме
prod:
	docker-compose -f compose.yaml up -d

# Запуск только баз данных
db:
	docker-compose -f compose.db.yaml up -d

# Остановка баз данных
db-stop:
	docker-compose -f compose.db.yaml down

# Просмотр логов
logs:
	docker-compose logs -f

# Очистка
clean:
	docker-compose down -v
	docker-compose -f compose.db.yaml down -v
	docker system prune -f

# Проверка кода
lint:
	npm run lint

# Форматирование кода
format:
	npm run format

# Тесты
test:
	npm run test

# Сборка
build:
	npm run build

# Перезапуск сервиса
restart-service:
	@if [ -z "$(SERVICE)" ]; then echo "Использование: make restart-service SERVICE=service-name"; exit 1; fi
	docker-compose restart $(SERVICE)

# Подключение к базе данных
psql:
	docker-compose -f compose.db.yaml exec postgres psql -U postgres -d yandex_direct

# Подключение к Redis
redis-cli:
	docker-compose -f compose.db.yaml exec redis redis-cli

# Мониторинг ресурсов
stats:
	docker stats

# Создание миграции
migration:
	@if [ -z "$(NAME)" ]; then echo "Использование: make migration NAME=migration_name"; exit 1; fi
	docker-compose exec campaign-service npx prisma migrate dev --name $(NAME)

# Применение миграций
migrate:
	docker-compose exec auth-service npx prisma migrate deploy
	docker-compose exec campaign-service npx prisma migrate deploy
	docker-compose exec analytics-service npx prisma migrate deploy