import { useState, useEffect, useRef } from 'react'
import questions from '../data/questions'
import { getLesson, formKeyFor } from '../data/lessons'
import { shuffle } from '../lib/shuffle'
import { scoreSession, feedbackBand } from '../lib/scoring'

const QUESTIONS_PER_SESSION = 5
const OPTION_LETTERS = ['A', 'B', 'C', 'D']

const cortexFeedback = {
  high: 'Outstanding! Your recall accuracy shows the technique is working. Your Study DNA reflects strong performance in this session.',
  mid:  'Good effort. You recalled most concepts correctly. A few gaps remain — your Study DNA will show where to focus next.',
  low:  'Interesting result. Lower recall often means the encoding phase needs reinforcement. Your Study DNA will reveal which technique suits your learning style better.',
}

// Every technique gets the same check: the questions the lesson was written from.
// That keeps the comparison fair — only the study method changes between biomes.
function getQuestions(subject, form) {
  const bank = questions[subject]?.[formKeyFor(form)]
  if (!Array.isArray(bank)) return []

  const lesson = getLesson(subject, form)
  if (lesson) {
    return shuffle(lesson.facts.map((fact) => bank[fact.q]).filter(Boolean))
  }

  return shuffle(bank).slice(0, QUESTIONS_PER_SESSION)
}

export default function RecallChallenge({ onNext, onScore, biome = 'mindmap', subject = 'maths', profile }) {
  const form = profile?.form ?? 'Form 1'
  const [questionSet] = useState(() => getQuestions(subject, form))

  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [answers,   setAnswers]   = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [finalData, setFinalData] = useState(null)
  const [error,     setError]     = useState(null)

  const startTime = useRef(0)
  const scoredRef = useRef(false)

  useEffect(() => {
    startTime.current = Date.now()
  }, [current])

  // Guard: nothing to ask for this subject/form — never fall back to another subject silently.
  if (questionSet.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>No questions yet</h2>
        <p style={styles.sub}>There is no {form} question bank for this subject yet. Pick a core subject to continue.</p>
      </div>
    )
  }

  const q = questionSet[current]
  const isLastQuestion = current + 1 >= questionSet.length

  function handleSelect(index) {
    if (submitted) return
    if (index < 0 || index >= q.opts.length) return
    setSelected(index)
  }

  function handleSubmit() {
    if (submitted) return
    if (selected === null) return

    const timeMs = Date.now() - startTime.current
    setAnswers((prev) => [...prev, { correct: selected === q.ans, timeMs }])
    setSubmitted(true)
  }

  function handleNext() {
    if (!submitted) return

    if (!isLastQuestion) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setSubmitted(false)
      return
    }

    // Guard: score exactly once, even on a double click — prevents duplicate rows in Supabase.
    if (scoredRef.current) return

    let tally
    try {
      tally = scoreSession(answers, questionSet.length)
    } catch (err) {
      setError(err.message)
      return
    }

    scoredRef.current = true

    const results = {
      ...tally,
      biome,
      subject,
      form,
      timestamp: new Date().toISOString(),
    }

    setFinalData(results)
    onScore?.(results)
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Could not score this session</h2>
        <p style={styles.errorBox}>{error}</p>
      </div>
    )
  }

  if (finalData) {
    const pct = finalData.score

    return (
      <div style={styles.container}>
        <div style={styles.doneIcon}>🎯</div>
        <h2 style={styles.heading}>Challenge Complete!</h2>
        <p style={styles.sub}>You answered {finalData.correct} out of {finalData.total} correctly.</p>
        <div style={styles.scoreCard}>
          <p style={styles.scorePct}>{pct}%</p>
          <p style={styles.scoreLabel}>Recall Accuracy</p>
          <div style={styles.barBg}><div style={{ ...styles.barFill, width: `${pct}%` }} /></div>
        </div>
        <div style={styles.bubble}>
          <div style={styles.bubbleHeader}>
            <span style={{ fontSize: 18 }}>🤖</span>
            <span style={styles.bubbleName}>Professor Cortex</span>
          </div>
          <p style={styles.bubbleText}>{cortexFeedback[feedbackBand(pct)]}</p>
        </div>
        <button style={styles.btn} onClick={onNext}>View my Study DNA →</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <p style={styles.label}>Memory Recovery Mission</p>
          <h2 style={styles.heading}>Recall Check</h2>
          <p style={styles.checkNote}>Same questions for every technique, so the comparison is fair.</p>
        </div>
        <span style={styles.counter}>{current + 1} / {questionSet.length}</span>
      </div>

      <div style={styles.barBg}>
        <div style={{ ...styles.barFill, width: `${(current / questionSet.length) * 100}%`, transition: 'width 0.4s' }} />
      </div>

      <div style={styles.questionCard}>
        <p style={styles.questionText}>{q.q}</p>
      </div>

      <div style={styles.options}>
        {q.opts.map((opt, i) => {
          let bg = '#ffffff'
          let border = '1px solid #e2e8f0'
          let color = '#1a1a2e'

          if (submitted) {
            if (i === q.ans)         { bg = '#e1f5ee'; border = '2px solid #1D9E75'; color = '#0f6e56' }
            else if (i === selected) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#991b1b' }
          } else if (i === selected) {
            bg = '#f5f3ff'; border = '2px solid #7c3aed'; color = '#3C3489'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              style={{ ...styles.option, background: bg, border, color, cursor: submitted ? 'default' : 'pointer' }}
            >
              <span style={styles.optLetter}>{OPTION_LETTERS[i]}</span>
              {opt}
              {submitted && i === q.ans && <span style={{ marginLeft: 'auto' }}>✅</span>}
              {submitted && i === selected && i !== q.ans && <span style={{ marginLeft: 'auto' }}>❌</span>}
            </button>
          )
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          style={{ ...styles.btn, opacity: selected === null ? 0.4 : 1, cursor: selected === null ? 'not-allowed' : 'pointer' }}
        >
          Submit Answer
        </button>
      ) : (
        <button style={styles.btn} onClick={handleNext}>
          {isLastQuestion ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  )
}

const styles = {
  container:    { maxWidth: 520, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem' },
  headerRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  label:        { margin: '0 0 4px', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed' },
  heading:      { margin: 0, fontSize: 20, fontWeight: 600, color: '#1a1a2e' },
  sub:          { margin: '0.5rem 0 1.5rem', fontSize: 14, color: '#6b7280' },
  checkNote:    { margin: '4px 0 0', fontSize: 12, color: '#6b7280' },
  counter:      { fontSize: 13, fontWeight: 600, color: '#7c3aed', background: '#ede9fe', padding: '4px 12px', borderRadius: 20, whiteSpace: 'nowrap' },
  barBg:        { background: '#e2e8f0', borderRadius: 20, height: 6, marginBottom: '1.5rem', overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 20, background: '#7c3aed' },
  questionCard: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem' },
  questionText: { margin: 0, fontSize: 16, fontWeight: 500, color: '#1a1a2e', lineHeight: 1.6 },
  options:      { display: 'grid', gap: 10, marginBottom: '1.5rem' },
  option:       { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 500, textAlign: 'left', transition: 'all 0.15s' },
  optLetter:    { width: 26, height: 26, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, color: '#475569' },
  doneIcon:     { fontSize: 48, textAlign: 'center', marginBottom: '1rem' },
  scoreCard:    { background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 16, padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' },
  scorePct:     { margin: '0 0 4px', fontSize: 48, fontWeight: 700, color: '#7c3aed' },
  scoreLabel:   { margin: '0 0 1rem', fontSize: 13, color: '#6b7280' },
  bubble:       { background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '0 16px 16px 16px', padding: '1rem 1.25rem', marginBottom: '1.5rem' },
  bubbleHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  bubbleName:   { fontSize: 12, fontWeight: 600, color: '#534AB7' },
  bubbleText:   { margin: 0, fontSize: 14, color: '#26215C', lineHeight: 1.7 },
  errorBox:     { margin: '1rem 0 0', fontSize: 13, color: '#991b1b', background: '#fee2e2', padding: '10px 14px', borderRadius: 10 },
  btn:          { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
}
