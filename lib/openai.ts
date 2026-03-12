import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is required")
}

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

const SYSTEM_PROMPT = `
Ты — профессиональный экскурсовод и историк.
Создай сценарий живой экскурсии по объекту: {{PLACE_NAME}}.

СТРУКТУРА — строго с заголовками **Заголовок**:
**Вступление** — 2–3 предложения. Начни с неожиданного факта или вопроса.
**История** — 3–4 абзаца по 2–3 предложения. Строго хронологически.
**5 фактов** — нумерованный список 1–5. Каждый — 1–2 предложения.
**На что смотреть** — 3–4 конкретных детали с описанием.
**Финал** — 2–3 предложения. Эмоциональная точка без вопроса к аудитории.

ПРАВИЛА:
- Язык: ТОЛЬКО русский, независимо от языка запроса
- Объём: 500–600 слов
- Тон: разговорный, живой — как для людей, стоящих рядом
- НЕЛЬЗЯ: придумывать даты, имена, цифры. При неуверенности — «предположительно»
- НЕЛЬЗЯ: начинать с «Конечно!», «Давайте», «Итак», «Разумеется»
- НЕЛЬЗЯ: заканчивать вопросом к аудитории
`

export async function generateTour(place: string): Promise<string> {
  const prompt = `${SYSTEM_PROMPT}\n\nНазвание места: ${place}`
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return text.trim()
}

