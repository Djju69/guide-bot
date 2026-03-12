import { sendMessage } from "../lib/bot.js"

type ProcessBody = {
  update?: {
    message?: { chat?: { id?: number } }
  }
}

export default async function handler(req: any, res: any) {
  try {
    const body = (req.body ?? {}) as ProcessBody
    const chatId = body.update?.message?.chat?.id
    if (typeof chatId === "number") {
      await sendMessage(chatId, "⏳ Изучаю информацию...")
    }
  } catch {
    // На этапе проверки цепочки просто отвечаем 200, чтобы QStash не ретраил бесконечно
  }

  return res.status(200).json({ ok: true })
}

