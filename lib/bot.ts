import { Bot, Context } from "grammy"
import { Client } from "@upstash/qstash"

const token = process.env.BOT_TOKEN
if (!token) throw new Error("BOT_TOKEN is required")

export const bot = new Bot(token)

function getProcessUrl(): string {
  const raw = process.env.VERCEL_URL
  if (!raw) throw new Error("VERCEL_URL is required")
  const base = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return `${base.replace(/\/+$/, "")}/api/process`
}

async function enqueueForProcessing(ctx: Context): Promise<void> {
  const update = ctx.update

  const qstashToken = process.env.QSTASH_TOKEN
  if (!qstashToken) {
    console.error("QSTASH_TOKEN is not set")
    await ctx.reply("⚠️ Внутренняя ошибка очереди. Попробуйте позже.")
    return
  }

  const client = new Client({ token: qstashToken })
  await client.publishJSON({
    url: getProcessUrl(),
    body: { update },
  })
}

bot.on("callback_query", async (ctx) => {
  // Заглушка для inline-кнопок (реализуем позже)
  await ctx.answerCallbackQuery()
})

bot.on("message:text", async (ctx) => {
  try {
    await enqueueForProcessing(ctx)
    await ctx.reply("⏳ Изучаю информацию...")
  } catch (err) {
    console.error("enqueueForProcessing error:", err)
    await ctx.reply("⚠️ Внутренняя ошибка. Попробуйте чуть позже.")
  }
})

bot.on("message", async (ctx) => {
  await ctx.reply("✍️ Напишите название места текстом")
})

export async function sendMessage(chatId: number, text: string): Promise<void> {
  await bot.api.sendMessage(chatId, text)
}

