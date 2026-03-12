import { Bot } from "grammy"

export function getBot(): Bot {
  const token = process.env.BOT_TOKEN
  if (!token) throw new Error("BOT_TOKEN is required")
  return new Bot(token)
}

type SendMessageArgs = { chat_id: number; text: string }

export async function sendMessage(chatId: number, text: string): Promise<void> {
  const token = process.env.BOT_TOKEN
  if (!token) throw new Error("BOT_TOKEN is required")

  const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text } satisfies SendMessageArgs),
  })

  if (!resp.ok) {
    const body = await resp.text().catch(() => "")
    throw new Error(`Telegram sendMessage failed: ${resp.status} ${body}`)
  }
}

