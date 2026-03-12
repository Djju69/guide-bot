import { webhookCallback } from "grammy"
import { bot } from "../lib/bot.js"

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed")
  }

  try {
    const handleUpdate = webhookCallback(bot)
    return await handleUpdate(req, res)
  } catch (err) {
    console.error("Webhook Error:", err)
    return res.status(500).send("Internal Error")
  }
}

