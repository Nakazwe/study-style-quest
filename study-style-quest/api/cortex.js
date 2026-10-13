/* global process */

const MODEL = 'claude-sonnet-4-6'
const REQUEST_TIMEOUT_MS = 9000
const MAX_TEXT_LENGTH = 60

const BIOME_NAMES = {
  mindmap: 'Mind Mapping',
  recall:  'Active Recall',
  feynman: 'Feynman Technique',
}

function isShortText(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_TEXT_LENGTH
}

// Returns an error message for the first invalid field, or null when the payload is usable.
function validatePayload(body) {
  if (!body || typeof body !== 'object') return 'Request body must be a JSON object'

  const { score, subject, form, biome, correct, total, avgResponseMs } = body

  if (!Number.isFinite(score) || score < 0 || score > 100) return 'score must be a number from 0 to 100'
  if (!isShortText(subject)) return 'subject must be 1 to ' + MAX_TEXT_LENGTH + ' characters'
  if (!isShortText(form)) return 'form must be 1 to ' + MAX_TEXT_LENGTH + ' characters'
  if (!Object.hasOwn(BIOME_NAMES, biome)) return 'biome must be one of: ' + Object.keys(BIOME_NAMES).join(', ')
  if (!Number.isInteger(total) || total <= 0) return 'total must be a positive whole number'
  if (!Number.isInteger(correct) || correct < 0 || correct > total) return 'correct must be a whole number between 0 and total'
  if (avgResponseMs !== undefined && avgResponseMs !== null && (!Number.isFinite(avgResponseMs) || avgResponseMs < 0)) {
    return 'avgResponseMs must be a positive number when provided'
  }

  return null
}

function buildPrompt({ score, subject, form, biome, correct, total, avgResponseMs }) {
  const avgTime = Number.isFinite(avgResponseMs) && avgResponseMs > 0
    ? (avgResponseMs / 1000).toFixed(1) + ' seconds'
    : 'not recorded'

  return `You are Professor Cortex, an encouraging and insightful AI study mentor for secondary school students in Zambia. You speak warmly but directly. You never use hollow praise.

A student just completed a study session. Here are their results:
- Subject: ${subject}
- Form: ${form}
- Study technique used: ${BIOME_NAMES[biome]}
- Score: ${score}% (${correct} out of ${total} questions correct)
- Average response time: ${avgTime}

Write a personalised 3-sentence response as Professor Cortex that:
1. Acknowledges their specific score and subject honestly
2. Gives one specific insight about what their performance reveals about their learning style
3. Gives one concrete actionable tip for their next study session

Keep it under 80 words. Do not use bullet points. Speak directly to the student as "you".`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Cortex API error: ANTHROPIC_API_KEY is not set for this deployment')
    return res.status(503).json({ error: 'Professor Cortex is not configured on the server' })
  }

  const validationError = validatePayload(req.body)
  if (validationError) {
    return res.status(400).json({ error: validationError })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 200,
        messages:   [{ role: 'user', content: buildPrompt(req.body) }],
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      const detail = await response.json().catch(() => null)
      const message = detail?.error?.message ?? `Claude API returned ${response.status}`
      console.error('Cortex API error:', message)
      return res.status(502).json({ error: message })
    }

    const data = await response.json()
    const text = data.content?.find((block) => block.type === 'text')?.text

    if (!text) {
      return res.status(502).json({ error: 'Claude API returned no text' })
    }

    return res.status(200).json({ message: text })
  } catch (err) {
    const timedOut = err?.name === 'TimeoutError'
    console.error('Cortex API error:', timedOut ? 'request timed out' : err)
    return res.status(timedOut ? 504 : 500).json({
      error: timedOut ? 'Professor Cortex took too long to respond' : 'Failed to reach Professor Cortex',
    })
  }
}
