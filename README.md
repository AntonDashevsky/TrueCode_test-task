# TrueCode test task

## Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (для запуска через Compose)

## Быстрый старт

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