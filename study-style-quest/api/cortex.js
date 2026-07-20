export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { score, subject, form, biome, correct, total, avgResponseMs } = req.body

  if (!score === undefined || !subject || !form || !biome) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const biomeNames = {
    mindmap: 'Mind Mapping',
    recall:  'Active Recall',
    feynman: 'Feynman Technique',
  }

  const prompt = `You are Professor Cortex, an encouraging and insightful AI study mentor for secondary school students in Zambia. You speak warmly but directly. You never use hollow praise.

A student just completed a study session. Here are their results:
- Subject: ${subject}
- Form: ${form}
- Study technique used: ${biomeNames[biome] ?? biome}
- Score: ${score}% (${correct} out of ${total} questions correct)
- Average response time: ${avgResponseMs ? (avgResponseMs / 1000).toFixed(1) + ' seconds' : 'not recorded'}

Write a personalised 3-sentence response as Professor Cortex that:
1. Acknowledges their specific score and subject honestly
2. Gives one specific insight about what their performance reveals about their learning style
3. Gives one concrete actionable tip for their next study session

Keep it under 80 words. Do not use bullet points. Speak directly to the student as "you".`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            process.env.ANTHROPIC_API_KEY,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 200,
        messages:   [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      return res.status(500).json({ error: error.error?.message ?? 'Claude API error' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? 'Keep going — every session builds your Study DNA.'

    return res.status(200).json({ message: text })
  } catch (err) {
    console.error('Cortex API error:', err)
    return res.status(500).json({ error: 'Failed to reach Professor Cortex' })
  }
}
