import { webhookCallback } from "grammy"
import { bot } from "../lib/bot.js"

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed")
  }

  try {
    // Типы grammY в текущей версии ожидают адаптер строкой,
    // поэтому явно указываем std/http и глушим типизацию.
    const handleUpdate = (webhookCallback as any)(bot, "std/http")
    return await handleUpdate(req, res)
  } catch (err) {
    console.error("Webhook Error:", err)
    return res.status(500).send("Internal Error")
  }
}

