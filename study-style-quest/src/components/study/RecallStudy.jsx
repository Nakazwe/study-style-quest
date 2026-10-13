import { useState } from 'react'
import { READ_SECONDS } from '../../data/lessons'
import { gradeRecall } from '../../lib/grading'
import useReadTimer from './useReadTimer'
import { LessonNotes, TimerBar } from './LessonNotes'
import { studyStyles } from './studyStyles'

const ACCENT = '#0f6e56'

function BlankSentence({ sentence, value, onChange, disabled, index }) {
  const [before, after] = sentence.split('____')
  return (
    <label style={styles.blankRow}>
      <span style={styles.blankNumber}>{index + 1}</span>
      <span style={styles.blankText}>
        {before}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          spellCheck={false}
          aria-label={`Blank ${index + 1}`}
          style={styles.input}
        />
        {after}
      </span>
    </label>
  )
}

export default function RecallStudy({ lesson, onComplete }) {
  const [phase, setPhase]         = useState('read') // read → recall → feedback
  const [responses, setResponses] = useState(() => lesson.facts.map(() => ''))
  const [grade, setGrade]         = useState(null)
  const [error, setError]         = useState(null)

  const remaining = useReadTimer(phase === 'read', READ_SECONDS, () => setPhase('recall'))

  function updateResponse(index, value) {
    setResponses((prev) => prev.map((r, i) => (i === index ? value : r)))
  }

  function handleCheck() {
    if (phase !== 'recall') return
    try {
      setGrade(gradeRecall(responses, lesson.facts))
      setPhase('feedback')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleContinue() {
    if (!grade) return
    onComplete({
      metric:  'Facts recalled unaided',
      correct: grade.correct,
      total:   grade.total,
      score:   grade.score,
      missedConcepts: grade.results.filter((r) => !r.correct).map((r) => lesson.facts[r.index].concept),
    })
  }

  if (error) {
    return <p style={styles.error}>{error}</p>
  }

  if (phase === 'read') {
    return (
      <div>
        <h3 style={studyStyles.heading}>Read carefully — these notes will disappear</h3>
        <TimerBar remaining={remaining} total={READ_SECONDS} accent={ACCENT} />
        <LessonNotes lesson={lesson} accent={ACCENT} />
        <button style={studyStyles.btn} onClick={() => setPhase('recall')}>I've memorised it — hide the notes →</button>
      </div>
    )
  }

  const filled = responses.filter((r) => r.trim()).length

  return (
    <div>
      <h3 style={studyStyles.heading}>{phase === 'recall' ? 'Recall from memory' : 'How much did you recall?'}</h3>
      <p style={studyStyles.sub}>
        {phase === 'recall'
          ? 'No notes and no options. Type the missing word — spelling slips in long words are fine.'
          : 'Green came straight from memory. For anything red, read the full fact once more.'}
      </p>

      {lesson.facts.map((fact, index) => {
        const result = grade?.results[index]
        return (
          <div
            key={fact.q}
            style={{
              ...styles.blankCard,
              borderColor: result ? (result.correct ? '#6ee7b7' : '#fca5a5') : '#e2e8f0',
              background:  result ? (result.correct ? '#ecfdf5' : '#fef2f2') : '#ffffff',
            }}
          >
            <BlankSentence
              sentence={fact.blank}
              value={responses[index]}
              onChange={(value) => updateResponse(index, value)}
              disabled={phase !== 'recall'}
              index={index}
            />
            {result && !result.correct && <p style={styles.correction}>✗ {fact.text}</p>}
            {result?.correct && <p style={{ ...styles.correction, color: ACCENT }}>✓ Recalled</p>}
          </div>
        )
      })}

      {phase === 'recall' ? (
        <button style={studyStyles.btn} onClick={handleCheck}>
          {filled === 0 ? "I can't remember any — show me" : `Check my ${filled} ${filled === 1 ? 'answer' : 'answers'}`}
        </button>
      ) : (
        <>
          <div style={{ ...studyStyles.summary, background: '#e1f5ee', borderColor: '#6ee7b7' }}>
            <p style={studyStyles.summaryText}>
              🌲 You recalled <strong>{grade.correct} of {grade.total}</strong> facts with no hints.
            </p>
          </div>
          <button style={studyStyles.btn} onClick={handleContinue}>Continue to Recall Check →</button>
        </>
      )}
    </div>
  )
}

const styles = {
  blankCard:   { border: '1px solid', borderRadius: 12, padding: '10px 12px', marginBottom: 10, transition: 'all 0.2s' },
  blankRow:    { display: 'flex', alignItems: 'flex-start', gap: 10 },
  blankNumber: { width: 22, height: 22, borderRadius: '50%', background: '#e1f5ee', color: ACCENT, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 },
  blankText:   { fontSize: 14, color: '#1a1a2e', lineHeight: 2 },
  input:       { width: 130, maxWidth: '45vw', margin: '0 6px', padding: '4px 8px', fontSize: 14, border: 'none', borderBottom: `2px solid ${ACCENT}`, background: 'transparent', outline: 'none', color: '#1a1a2e' },
  correction:  { margin: '6px 0 0 32px', fontSize: 13, color: '#991b1b', lineHeight: 1.5 },
  error:       { fontSize: 13, color: '#991b1b', background: '#fee2e2', padding: '10px 14px', borderRadius: 10 },
}
