/**
 * Usage (PowerShell):
 *   cd guide-bot
 *   node .\set-webhook.js
 *
 * Required env vars:
 *   BOT_TOKEN
 * Optional (defaults shown below):
 *   WEBHOOK_URL=https://guide-bot-nu.vercel.app/api/webhook
 *   WEBHOOK_SECRET=6F3Yc9z6stzCi61WEkVP2cc4sgJlpEYG
 */

const BOT_TOKEN = process.env.BOT_TOKEN
if (!BOT_TOKEN) {
  console.error("BOT_TOKEN is required")
  process.exit(1)
}

const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://guide-bot-nu.vercel.app/api/webhook"
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "6F3Yc9z6stzCi61WEkVP2cc4sgJlpEYG"

const url = new URL(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`)
url.searchParams.set("url", WEBHOOK_URL)
url.searchParams.set("secret_token", WEBHOOK_SECRET)

const resp = await fetch(url.toString(), { method: "POST" })
const data = await resp.json().catch(() => null)

console.log(JSON.stringify(data, null, 2))
if (!resp.ok || !data?.ok) process.exit(1)

