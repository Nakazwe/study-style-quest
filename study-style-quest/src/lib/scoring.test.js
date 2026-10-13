import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scoreSession, gradeFor, feedbackBand, summariseTechniques, rankTechniques } from './scoring.js'

const answer = (correct, timeMs = 1000) => ({ correct, timeMs })
const TECHNIQUES = ['mindmap', 'recall', 'feynman']

test('scoreSession totals correct answers, percentage and average time', () => {
  const result = scoreSession([answer(true, 2000), answer(true, 4000), answer(false, 3000)], 3)
  assert.deepEqual(result, { correct: 2, total: 3, score: 67, avgResponseMs: 3000 })
})

test('scoreSession handles all correct and all wrong', () => {
  assert.equal(scoreSession([answer(true), answer(true)], 2).score, 100)
  assert.equal(scoreSession([answer(false), answer(false)], 2).score, 0)
})

test('scoreSession rejects an empty session', () => {
  assert.throws(() => scoreSession([], 0), /at least one question/)
})

test('scoreSession rejects a length mismatch (the double-count bug)', () => {
  assert.throws(
    () => scoreSession([answer(true), answer(true), answer(true)], 2),
    /same length \(expected 2, received 3\)/
  )
  assert.throws(() => scoreSession([answer(true)], 2), /same length/)
})

test('scoreSession rejects malformed answers', () => {
  assert.throws(() => scoreSession([answer(true), null], 2), /Answer 2 is malformed/)
  assert.throws(() => scoreSession([{ correct: 'yes', timeMs: 10 }], 1), /malformed/)
  assert.throws(() => scoreSession([{ correct: true, timeMs: -5 }], 1), /malformed/)
  assert.throws(() => scoreSession('not an array', 1), /must be an array/)
})

test('gradeFor maps score bands and guards invalid input', () => {
  assert.equal(gradeFor(100).grade, 'S')
  assert.equal(gradeFor(80).grade, 'S')
  assert.equal(gradeFor(79).grade, 'A')
  assert.equal(gradeFor(65).grade, 'A')
  assert.equal(gradeFor(50).grade, 'B')
  assert.equal(gradeFor(0).grade, 'C')
  assert.equal(gradeFor(125).grade, '—')
  assert.equal(gradeFor(undefined).grade, '—')
  assert.equal(gradeFor(NaN).grade, '—')
})

test('feedbackBand thresholds', () => {
  assert.equal(feedbackBand(80), 'high')
  assert.equal(feedbackBand(50), 'mid')
  assert.equal(feedbackBand(49), 'low')
  assert.equal(feedbackBand(null), 'low')
})

test('summariseTechniques averages real sessions and leaves untested techniques empty', () => {
  const history = [
    { biome: 'mindmap', score: 60 },
    { biome: 'mindmap', score: 80 },
    { biome: 'recall', score: 100 },
  ]
  assert.deepEqual(summariseTechniques(history, TECHNIQUES), [
    { id: 'mindmap', sessions: 2, average: 70, best: 80, studyAverage: null },
    { id: 'recall', sessions: 1, average: 100, best: 100, studyAverage: null },
    { id: 'feynman', sessions: 0, average: null, best: null, studyAverage: null },
  ])
})

test('summariseTechniques skips bad rows instead of counting them as zero', () => {
  const history = [
    { biome: 'mindmap', score: 90 },
    { biome: 'unknown', score: 10 },
    { biome: 'mindmap', score: 125 },
    { biome: 'mindmap', score: null },
    null,
  ]
  const [mindmap] = summariseTechniques(history, TECHNIQUES)
  assert.deepEqual(mindmap, { id: 'mindmap', sessions: 1, average: 90, best: 90, studyAverage: null })
})

test('summariseTechniques tolerates missing history and rejects missing technique list', () => {
  assert.equal(summariseTechniques(undefined, TECHNIQUES).every((t) => t.sessions === 0), true)
  assert.throws(() => summariseTechniques([], []), /At least one technique/)
})

test('rankTechniques puts the strongest measured technique first, not the one just played', () => {
  const summary = summariseTechniques(
    [
      { biome: 'mindmap', score: 40 },
      { biome: 'recall', score: 100 },
    ],
    TECHNIQUES
  )
  const ranked = rankTechniques(summary)
  assert.deepEqual(ranked.map((t) => t.id), ['recall', 'mindmap'])
})

test('rankTechniques breaks ties by number of sessions', () => {
  const summary = summariseTechniques(
    [
      { biome: 'feynman', score: 80 },
      { biome: 'mindmap', score: 80 },
      { biome: 'mindmap', score: 80 },
    ],
    TECHNIQUES
  )
  assert.deepEqual(rankTechniques(summary).map((t) => t.id), ['mindmap', 'feynman'])
})

test('summariseTechniques averages study-phase scores separately and skips missing or invalid ones', () => {
  const history = [
    { biome: 'feynman', score: 60, studyScore: 80 },
    { biome: 'feynman', score: 80, studyScore: 40 },
    { biome: 'feynman', score: 70, studyScore: null },
    { biome: 'feynman', score: 70, studyScore: 300 },
  ]
  const feynman = summariseTechniques(history, TECHNIQUES).find((t) => t.id === 'feynman')
  assert.equal(feynman.sessions, 4)
  assert.equal(feynman.average, 70)
  assert.equal(feynman.studyAverage, 60)
})
