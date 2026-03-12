import { Client } from "@upstash/qstash"
import { sendMessage } from "../lib/bot.js"

type TelegramUpdate = {
  update_id: number
  message?: {
    chat: { id: number }
    text?: string
  }
  callback_query?: unknown
}

async function handleCallback(_callbackQuery: unknown): Promise<void> {
  // Заглушка — реализуем на шаге с inline-кнопками
}

function getProcessUrl(): string {
  const raw = process.env.VERCEL_URL
  if (!raw) throw new Error("VERCEL_URL is required")
  const base = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return `${base.replace(/\/+$/, "")}/api/process`
}

export default async function handler(req: any, res: any) {
  const secret =
    req.headers?.["x-telegram-bot-api-secret-token"] ??
    req.headers?.["X-Telegram-Bot-Api-Secret-Token"]

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const update = req.body as TelegramUpdate

  try {
    // callback_query обрабатываем здесь (быстро, < 1 сек)
    if (update.callback_query) {
      await handleCallback(update.callback_query)
      return res.status(200).json({ ok: true })
    }

    // Текст — кладём в QStash (это быстро и надёжнее делать до ответа 200)
    if (update.message?.text) {
      const qstash = new Client({ token: process.env.QSTASH_TOKEN! })
      await qstash.publishJSON({
        url: getProcessUrl(),
        body: { update },
      })
      return res.status(200).json({ ok: true })
    }

    // message есть, но не текст (фото/стикер/голосовое и т.п.)
    if (update.message?.chat?.id) {
      await sendMessage(update.message.chat.id, "✍️ Напишите название места текстом")
    }
  } catch {
    // намеренно молчим: Telegram получит 200, а диагностику добавим позже
  }

  // ВАЖНО: ответить Telegram 200 всегда
  return res.status(200).json({ ok: true })
}

