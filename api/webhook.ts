import { webhookCallback } from "grammy"
import { bot } from "../lib/bot.js"

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed")
  }

  try {
    // Для Vercel Node.js используем http-адаптер grammY.
    const handleUpdate = (webhookCallback as any)(bot, "http")
    return await handleUpdate(req, res)
  } catch (err) {
    console.error("Webhook Error:", err)
    return res.status(200).send("Error")
  }
}

