import { useState } from 'react'
import { READ_SECONDS, MIN_EXPLANATION_WORDS } from '../../data/lessons'
import { gradeExplanation } from '../../lib/grading'
import useReadTimer from './useReadTimer'
import { LessonNotes, TimerBar } from './LessonNotes'
import { studyStyles } from './studyStyles'

const ACCENT = '#92400e'

function countWords(text) {
  return (text.match(/[\p{L}\p{N}]+/gu) ?? []).length
}

export default function FeynmanStudy({ lesson, onComplete }) {
  const [phase, setPhase]             = useState('read') // read → explain → review
  const [explanation, setExplanation] = useState('')
  const [grade, setGrade]             = useState(null)
  const [error, setError]             = useState(null)

  const remaining = useReadTimer(phase === 'read', READ_SECONDS, () => setPhase('explain'))
  const wordCount = countWords(explanation)
  const longEnough = wordCount >= MIN_EXPLANATION_WORDS

  function handleCheck() {
    if (phase !== 'explain') return
    if (!longEnough) return
    try {
      setGrade(gradeExplanation(explanation, lesson.facts))
      setPhase('review')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleContinue() {
    if (!grade) return
    onComplete({
      metric:  'Key ideas explained',
      correct: grade.correct,
      total:   grade.total,
      score:   grade.score,
      missedConcepts: grade.missed.map((index) => lesson.facts[index].concept),
    })
  }

  if (error) {
    return <p style={styles.error}>{error}</p>
  }

  if (phase === 'read') {
    return (
      <div>
        <h3 style={studyStyles.heading}>Step 1 · Study the concept</h3>
        <p style={studyStyles.sub}>Read for understanding, not memorising — next you will teach it.</p>
        <TimerBar remaining={remaining} total={READ_SECONDS} accent={ACCENT} />
        <LessonNotes lesson={lesson} accent={ACCENT} />
        <button style={studyStyles.btn} onClick={() => setPhase('explain')}>I understand it — let me explain →</button>
      </div>
    )
  }

  if (phase === 'explain') {
    return (
      <div>
        <h3 style={studyStyles.heading}>Step 2 · Explain it simply</h3>
        <p style={studyStyles.sub}>
          Teach <strong>{lesson.topic}</strong> to a Form 1 student who has never heard of it. Use your own words and short sentences.
        </p>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={7}
          placeholder="Imagine you're explaining this to a younger student…"
          aria-label="Your explanation"
          style={styles.textarea}
        />
        <p style={{ ...styles.counter, color: longEnough ? ACCENT : '#9ca3af' }}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
          {!longEnough && ` · at least ${MIN_EXPLANATION_WORDS} needed`}
        </p>
        <button
          onClick={handleCheck}
          disabled={!longEnough}
          style={{ ...studyStyles.btn, opacity: longEnough ? 1 : 0.4, cursor: longEnough ? 'pointer' : 'not-allowed' }}
        >
          Find the gaps →
        </button>
      </div>
    )
  }

  const coveredFacts = grade.covered.map((index) => lesson.facts[index])
  const missedFacts  = grade.missed.map((index) => lesson.facts[index])

  return (
    <div>
      <h3 style={studyStyles.heading}>Step 3 · Find the gaps</h3>

      <div style={{ ...studyStyles.summary, background: '#fef3c7', borderColor: '#fcd34d' }}>
        <p style={studyStyles.summaryText}>
          🏛 Your explanation covered <strong>{grade.correct} of {grade.total}</strong> key ideas
          {grade.simple ? ' — and you kept it simple.' : '. Try shorter sentences next time — the Feynman test is whether a beginner could follow you.'}
        </p>
      </div>

      {coveredFacts.map((fact) => (
        <div key={fact.q} style={{ ...studyStyles.row, background: '#ecfdf5', color: '#065f46' }}>
          <span>✓</span><span><strong>{fact.concept}</strong></span>
        </div>
      ))}

      {missedFacts.length > 0 && (
        <>
          <h3 style={{ ...studyStyles.heading, marginTop: '1rem' }}>Step 4 · Review the gaps</h3>
          {missedFacts.map((fact) => (
            <div key={fact.q} style={{ ...studyStyles.row, background: '#fef2f2', color: '#7f1d1d' }}>
              <span>✗</span><span><strong>{fact.concept}:</strong> {fact.text}</span>
            </div>
          ))}
        </>
      )}

      <button style={{ ...studyStyles.btn, marginTop: '0.75rem' }} onClick={handleContinue}>Continue to Recall Check →</button>
    </div>
  )
}

const styles = {
  textarea: { width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: 14, lineHeight: 1.6, fontFamily: 'inherit', border: '1px solid #fcd34d', borderRadius: 12, outline: 'none', resize: 'vertical', color: '#1a1a2e', background: '#fffdf7' },
  counter:  { margin: '6px 0 12px', fontSize: 12, fontWeight: 600 },
  error:    { fontSize: 13, color: '#991b1b', background: '#fee2e2', padding: '10px 14px', borderRadius: 10 },
}
