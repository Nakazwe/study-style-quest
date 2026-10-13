// Pure grading for the study phase of each technique.
// Fill-in-the-blank answers (Recall Forest) and free-text explanations (Feynman City).

const LEADING_ARTICLE = /^(the|a|an) /

function baseNormalize(value) {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[−–—]/g, '-')
    .replace(/×/g, ' x ')
    .replace(/(?<=[a-z])-(?=[a-z])/g, '') // counter-argument → counterargument, half-life → halflife
    .replace(/[^a-z0-9/=.\-±+ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Normalises a typed answer: case, accents, dashes, punctuation, leading articles, "x = 5" → "5". */
export function normalizeAnswer(value) {
  if (typeof value !== 'string') return ''

  let text = baseNormalize(value).replace(/\.+$/, '').replace(LEADING_ARTICLE, '')
  if (text.includes('=')) {
    text = text.slice(text.lastIndexOf('=') + 1).trim()
  }
  return text.replace(/ /g, '')
}

function editDistance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diagonal = previous[0]
    previous[0] = i
    for (let j = 1; j <= b.length; j++) {
      const above = previous[j]
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
      diagonal = above
    }
  }
  return previous[b.length]
}

function allowedTypos(answer) {
  if (!/^[a-z]+$/.test(answer)) return 0 // numbers and formulas must be exact
  if (answer.length >= 8) return 2
  if (answer.length >= 5) return 1
  return 0
}

/**
 * True when the typed answer matches any accepted answer, allowing small spelling slips in longer words.
 */
export function isAnswerCorrect(input, acceptedAnswers) {
  if (!Array.isArray(acceptedAnswers) || acceptedAnswers.length === 0) {
    throw new TypeError('At least one accepted answer is required')
  }

  const given = normalizeAnswer(input)
  if (!given) return false

  return acceptedAnswers.some((accepted) => {
    const target = normalizeAnswer(accepted)
    if (!target) return false
    if (given === target) return true
    return editDistance(given, target) <= allowedTypos(target)
  })
}

/**
 * Grades Recall Forest blanks. One response per fact, in the same order.
 */
export function gradeRecall(responses, facts) {
  if (!Array.isArray(facts) || facts.length === 0) {
    throw new RangeError('A lesson must contain at least one fact')
  }
  if (!Array.isArray(responses)) {
    throw new TypeError('Responses must be an array')
  }
  if (responses.length !== facts.length) {
    throw new RangeError(
      `Responses and facts must have the same length (expected ${facts.length}, received ${responses.length})`
    )
  }

  const results = facts.map((fact, index) => ({
    index,
    given: typeof responses[index] === 'string' ? responses[index].trim() : '',
    correct: isAnswerCorrect(responses[index], fact.answers),
  }))

  const correct = results.filter((r) => r.correct).length
  return {
    correct,
    total: facts.length,
    score: Math.round((correct / facts.length) * 100),
    results,
  }
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function mentions(spacedText, compactText, keyword) {
  const spacedKeyword = baseNormalize(keyword)
  if (!spacedKeyword) return false

  // Word-start boundary only, so "translat" matches "translation" and "hint" matches "hinted".
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(spacedKeyword)}`)
  if (pattern.test(spacedText)) return true

  // Formulas like "F = ma" should match "f=ma" too.
  const hasSymbol = /[^a-z ]/.test(spacedKeyword)
  return hasSymbol && compactText.includes(spacedKeyword.replace(/ /g, ''))
}

function countWords(text) {
  return (text.match(/[\p{L}\p{N}]+/gu) ?? []).length
}

/**
 * Grades a Feynman explanation: which of the lesson's key ideas it mentions, and whether it is said simply.
 */
export function gradeExplanation(text, facts) {
  if (!Array.isArray(facts) || facts.length === 0) {
    throw new RangeError('A lesson must contain at least one fact')
  }
  if (typeof text !== 'string') {
    throw new TypeError('Explanation must be text')
  }

  const spaced = baseNormalize(text)
  const compact = spaced.replace(/ /g, '')
  const wordCount = countWords(text)

  const covered = []
  const missed = []
  facts.forEach((fact, index) => {
    const hit = Array.isArray(fact.keywords) && fact.keywords.some((keyword) => mentions(spaced, compact, keyword))
    ;(hit ? covered : missed).push(index)
  })

  const sentences = text.split(/[.!?]+/).filter((s) => countWords(s) > 0)
  const avgSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : wordCount

  return {
    wordCount,
    covered,
    missed,
    correct: covered.length,
    total: facts.length,
    score: Math.round((covered.length / facts.length) * 100),
    avgSentenceLength,
    simple: avgSentenceLength <= 20,
  }
}
