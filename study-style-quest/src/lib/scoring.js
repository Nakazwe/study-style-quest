// Pure scoring logic for Study Style Quest.
// No React and no Supabase in here, so every function can be tested with plain Node.
// Guard clauses run first and fail loudly; callers decide how to show the error.

const MIN_SCORE = 0
const MAX_SCORE = 100

const GRADE_BANDS = [
  { min: 80, grade: 'S', color: '#7c3aed' },
  { min: 65, grade: 'A', color: '#0f6e56' },
  { min: 50, grade: 'B', color: '#92400e' },
  { min: 0,  grade: 'C', color: '#dc2626' },
]

function isValidScore(value) {
  return Number.isFinite(value) && value >= MIN_SCORE && value <= MAX_SCORE
}

function isValidAnswer(answer) {
  return (
    answer !== null &&
    typeof answer === 'object' &&
    typeof answer.correct === 'boolean' &&
    Number.isFinite(answer.timeMs) &&
    answer.timeMs >= 0
  )
}

/**
 * Totals one recall session.
 *
 * @param {{ correct: boolean, timeMs: number }[]} answers  one entry per answered question
 * @param {number} questionCount                           number of questions in the session
 * @returns {{ correct: number, total: number, score: number, avgResponseMs: number }}
 */
export function scoreSession(answers, questionCount) {
  if (!Array.isArray(answers)) {
    throw new TypeError('Answers must be an array')
  }
  if (!Number.isInteger(questionCount) || questionCount <= 0) {
    throw new RangeError('Session must contain at least one question')
  }
  if (answers.length !== questionCount) {
    throw new RangeError(
      `Answers and questions must have the same length (expected ${questionCount}, received ${answers.length})`
    )
  }

  const malformedIndex = answers.findIndex((answer) => !isValidAnswer(answer))
  if (malformedIndex !== -1) {
    throw new TypeError(`Answer ${malformedIndex + 1} is malformed`)
  }

  const correct = answers.filter((answer) => answer.correct).length
  const totalTimeMs = answers.reduce((sum, answer) => sum + answer.timeMs, 0)

  return {
    correct,
    total: questionCount,
    score: Math.round((correct / questionCount) * 100),
    avgResponseMs: Math.round(totalTimeMs / questionCount),
  }
}

/**
 * Maps a 0–100 score to the grade shown on the Study DNA screen.
 * Invalid input gets a neutral placeholder instead of a misleading "C".
 */
export function gradeFor(score) {
  if (!isValidScore(score)) {
    return { grade: '—', color: '#6b7280' }
  }
  return GRADE_BANDS.find((band) => score >= band.min)
}

/**
 * Feedback band used for Professor Cortex's fallback messages.
 */
export function feedbackBand(score) {
  if (!isValidScore(score)) return 'low'
  if (score >= 80) return 'high'
  if (score >= 50) return 'mid'
  return 'low'
}

/**
 * Averages saved sessions per technique.
 * Rows with an unknown technique or an out-of-range score are skipped, not counted as zero.
 *
 * @param {{ biome: string, score: number }[]} history
 * @param {string[]} techniqueIds
 * @returns {{ id: string, sessions: number, average: number | null, best: number | null }[]}
 */
export function summariseTechniques(history, techniqueIds) {
  if (!Array.isArray(techniqueIds) || techniqueIds.length === 0) {
    throw new RangeError('At least one technique id is required')
  }

  const rows = Array.isArray(history) ? history : []
  const validRows = rows.filter(
    (row) => row !== null && typeof row === 'object' && techniqueIds.includes(row.biome) && isValidScore(row.score)
  )

  return techniqueIds.map((id) => {
    const scores = validRows.filter((row) => row.biome === id).map((row) => row.score)

    if (scores.length === 0) {
      return { id, sessions: 0, average: null, best: null }
    }

    const sum = scores.reduce((total, score) => total + score, 0)
    return {
      id,
      sessions: scores.length,
      average: Math.round(sum / scores.length),
      best: Math.max(...scores),
    }
  })
}

/**
 * Orders tested techniques from strongest to weakest.
 * Ties on average go to the technique with more sessions behind it.
 */
export function rankTechniques(summary) {
  if (!Array.isArray(summary)) return []

  return summary
    .filter((technique) => technique.sessions > 0)
    .sort((a, b) => b.average - a.average || b.sessions - a.sessions)
}
