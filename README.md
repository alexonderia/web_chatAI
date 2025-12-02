# web_chatAI

Веб-клиент для сервера [WebAPIChatAI](https://github.com/Elena-Shalaumova/WebAPIChatAI). Интерфейс покрывает ключевые функции API:

- **Диалог** с моделями (endpoint `/chat/completions`) с поддержкой системного промпта, температуры, top-p и опционального стриминга.
- **Список доступных моделей** (`/models`) с быстрым переключением в UI.
- **История сессии** (`/chat/history/{sessionId}`) и сохранение идентификатора сессии между перезагрузками.
- **Мониторинг состояния сервера** (`/health`) прямо из нижней панели.

Проект написан на React + Vite + TypeScript, использует React Query для работы с сетью и разнесён на фичи по принципам clean architecture.

## Быстрый старт (локально)

```bash
npm install
npm run dev
```

По умолчанию фронтенд ожидает API на `http://localhost:8080`. Настроить адрес можно через переменную окружения `VITE_API_BASE_URL` (см. `.env.example`).

## Docker

Фронтенд полностью собирается внутри контейнера, все зависимости подтягиваются в build-стадии.

```bash
# сборка образа
docker build -t web-chat-ai .

# запуск на 80 порту
docker run -p 8080:80 --env VITE_API_BASE_URL=http://api:8080 web-chat-ai
```

## Структура

```
src/
  app/           # обёртка приложения и каркас
  features/
    chat/        # чат, список моделей, история, статус
    settings/    # панель настроек запроса
  lib/           # вспомогательные утилиты, клиент API
public/
```

## Скрин и UX

- Левый сайдбар — текущая сессия, история диалога.
- Центр — лента сообщений и поле ввода с горячей клавишей Enter для отправки.
- Правый столбец — параметры запроса (системный промпт, температура, top-p, поток).
- Нижняя панель — статус `/health` и адрес API.

## Разработка

- Стили находятся в `src/styles.css` и `src/app/App.css`.
- Общий клиент API — `src/lib/apiClient.ts`.
- Работа с данными чата — `src/features/chat/hooks/ChatSessionProvider.tsx`.
- Запросы к серверу — `src/features/chat/api/chatApi.ts`.

### Скрипты

- `npm run dev` — старт dev-сервера Vite
- `npm run build` — сборка в `dist`
- `npm run lint` — проверка ESLint