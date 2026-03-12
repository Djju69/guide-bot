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

export default async function handler(req: any, res: any) {
  const secret =
    req.headers?.["x-telegram-bot-api-secret-token"] ??
    req.headers?.["X-Telegram-Bot-Api-Secret-Token"]

  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const update = req.body as TelegramUpdate

  // ВАЖНО: ответить Telegram сразу, до любой тяжёлой работы
  res.status(200).json({ ok: true })

  void (async () => {
    try {
      if (update.callback_query) {
        await handleCallback(update.callback_query)
        return
      }

      if (update.message?.text) {
        const qstash = new Client({ token: process.env.QSTASH_TOKEN! })
        await qstash.publishJSON({
          url: `${process.env.VERCEL_URL}/api/process`,
          body: { update },
        })
        return
      }

      // message есть, но не текст (фото/стикер/голосовое и т.п.)
      if (update.message?.chat?.id) {
        await sendMessage(update.message.chat.id, "✍️ Напишите название места текстом")
      }
    } catch {
      // Здесь намеренно молчим: webhook уже ответил 200, а логирование добавим позже
    }
  })()
}

