import { sendMessage } from "../lib/bot.js"
import { generateTour } from "../lib/openai.js"

type ProcessBody = {
  update?: {
    message?: {
      chat?: { id?: number }
      text?: string
    }
  }
}

export default async function handler(req: any, res: any) {
  const body = (req.body ?? {}) as ProcessBody
  const chatId = body.update?.message?.chat?.id
  const text = body.update?.message?.text

  if (typeof chatId !== "number") {
    return res.status(200).json({ ok: true })
  }

  if (!text || text.trim().length === 0) {
    await sendMessage(chatId, "✍️ Напишите название места текстом")
    return res.status(200).json({ ok: true })
  }

  if (text.length > 500) {
    await sendMessage(chatId, "✂️ Слишком длинный запрос. Напишите только название")
    return res.status(200).json({ ok: true })
  }

  try {
    const tour = await generateTour(text.trim())
    await sendMessage(chatId, tour)
  } catch (err: any) {
    console.error("Gemini error:", err)
    await sendMessage(
      chatId,
      "⚠️ Сервис временно недоступен. Обычно это занимает 2–5 минут, попробуйте ещё раз."
    )
  }

  return res.status(200).json({ ok: true })
}


