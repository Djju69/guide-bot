# Guide Bot — Worklog

## Что я сделал (Шаг 1: инициализация)

Создал новый подпроект `guide-bot/` (не трогая существующий код в корне репозитория) со структурой и конфигами под ТЗ:

- `guide-bot/package.json`
  - зависимости по ТЗ: `grammy`, `@upstash/qstash`, `@supabase/supabase-js`, `openai`, `axios`, `md5`
  - dev-зависимости по ТЗ: `typescript`, `@types/node`, `@types/md5`, `ts-node`, `vercel`
- `guide-bot/tsconfig.json`
  - TypeScript `strict: true`, серверные настройки без JSX
- `guide-bot/vercel.json`
  - `maxDuration: 10` для `api/webhook.ts` и `api/process.ts`
- `guide-bot/.env.local`
  - полный список переменных окружения из ТЗ
- папки и файлы-скелеты под дальнейшие шаги:
  - `guide-bot/api/webhook.ts`
  - `guide-bot/api/process.ts`
  - `guide-bot/lib/bot.ts`
  - `guide-bot/lib/openai.ts`
  - `guide-bot/lib/supabase.ts`
  - `guide-bot/lib/scraper.ts`
  - `guide-bot/lib/hash.ts`
  - `guide-bot/lib/limits.ts`

Дополнительно:

- Выполнил `npm install` в `guide-bot/` (шаг 2 по ТЗ) — зависимости поставились.
- Прогнал `npm run typecheck` — TypeScript компиляция проходит (пока в файлах только скелеты).

## Что осталось сделать дальше (по ТЗ)

- Шаг 1 (Supabase SQL): выполнить SQL из ТЗ в Supabase SQL Editor.
- Шаг 3: реализовать `api/webhook.ts` (проверка secret header, мгновенный 200 OK, обработка callback_query, постановка text в QStash).
- Шаг 4: реализовать `api/process.ts` (verify QStash signature, idempotency locks, лимиты, кэш, scraper URL, OpenAI, Supabase, ответ с inline-кнопками).
- Шаги 5–10: промпт, URL, TTS, клавиатуры, /start /help, обработка ошибок.
- Шаг 11–12: деплой на Vercel и установка webhook в Telegram.

## Статус (последние изменения)

- Реализован Шаг 3: `api/webhook.ts` по порядку из ТЗ (проверка `X-Telegram-Bot-Api-Secret-Token`, мгновенный `200`, затем callback-заглушка / QStash / ответ на нетекст).
- Добавлена минимальная заглушка `api/process.ts`: отправляет пользователю «⏳ Изучаю информацию...», чтобы проверить цепочку Telegram → Vercel → QStash → пользователь.
- Обновлён build под Vercel: `tsc` теперь **делает emit** (в `dist/`), `noEmit: false`, добавлен `outDir: "dist"`.
- Добавлена папка `public/` (пустая, через `.gitkeep`) — чтобы Vercel не падал с ошибкой “No Output Directory named public”.
- Добавлен скрипт `set-webhook.js` для переустановки Telegram webhook (через `setWebhook` + `secret_token`).

- Trigger commit for Vercel autodeploy (2026-03-12).

