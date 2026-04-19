# TrueCode test task

## Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (для запуска через Compose)
- либо локально: **Node.js 22+**, **PostgreSQL 16+**

## Быстрый старт (Docker Compose)

1. (Необязательно) Скопируйте переменные окружения. При пропуске шага в docker-compose подставятся значения по умолчанию:

   ```bash
   cp .env.example .env
   ```

2. Запустите сервисы из корня репозитория:

   ```bash
   docker compose up --build
   ```

3. Откройте в браузере:

   - http://localhost:5173 порт задаётся `FRONTEND_PORT` в `.env`

Загруженные файлы монтируются в каталог **`uploads/`** в корне проекта.

## Локальный запуск (без Docker)

Нужен запущенный PostgreSQL и файлы `.env` в `backend/` и `frontend/` (см. `backend/.env.example`, `frontend/.env.example`).

```bash
# Backend
cd backend
npm install
npm run start:dev
```

```bash
# Frontend (в другом терминале)
cd frontend
npm install
npm run dev
```

## Полезные команды

```bash
docker compose down          # остановить
docker compose logs -f     # логи всех сервисов
```
