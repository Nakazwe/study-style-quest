import { useState, useEffect, useRef } from 'react'
import questions from '../data/questions'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getQuestions(subject, form) {
  const formKey     = form ? 'form' + form.replace('Form ', '') : 'form1'
  const subjectBank = questions[subject] ?? questions.maths
  const all         = subjectBank[formKey] ?? subjectBank.form1
  return shuffle(all).slice(0, 5)
}

const cortexFeedback = {
  high: "Outstanding! Your recall accuracy shows the technique is working. Your Study DNA reflects strong performance in this session.",
  mid:  "Good effort. You recalled most concepts correctly. A few gaps remain — your Study DNA will show where to focus next.",
  low:  "Interesting result. Lower recall often means the encoding phase needs reinforcement. Your Study DNA will reveal which technique suits your learning style better.",
}

export default function RecallChallenge({ onNext, onScore, biome = 'mindmap', subject = 'maths', profile }) {
  const form        = profile?.form ?? 'Form 1'
  const [questionSet] = useState(() => getQuestions(subject, form))

  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [answers,   setAnswers]   = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [finalData, setFinalData] = useState(null)
  const startTime = useRef(Date.now())

  useEffect(() => { startTime.current = Date.now() }, [current])

  const q = questionSet[current]

  function handleSelect(i) { if (!submitted) setSelected(i) }

  function handleSubmit() {
    if (selected === null) return
    const timeMs  = Date.now() - startTime.current
    const isRight = selected === q.ans
    setAnswers(prev => [...prev, { correct: isRight, timeMs }])
    setSubmitted(true)
  }

  function handleNext() {
    const updatedAnswers = [...answers]
    // answers already has the last entry from handleSubmit
    const isLast = current + 1 >= questionSet.length

    if (isLast) {
      const totalCorrect = updatedAnswers.filter(a => a.correct).length
      const finalPct     = Math.round((totalCorrect / questionSet.length) * 100)
      const avgMs        = Math.round(updatedAnswers.reduce((s, a) => s + a.timeMs, 0) / updatedAnswers.length)

      const results = {
        score:         finalPct,
        correct:       totalCorrect,
        total:         questionSet.length,
        avgResponseMs: avgMs,
        biome,
        subject,
        form,
        timestamp:     new Date().toISOString(),
      }

      setFinalData(results)
      onScore(results)
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setSubmitted(false)
    }
  }

  // Show results screen
  if (finalData) {
    const pct      = finalData.score
    const feedback = pct >= 80 ? cortexFeedback.high : pct >= 50 ? cortexFeedback.mid : cortexFeedback.low

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
          <p style={styles.bubbleText}>{feedback}</p>
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
          <h2 style={styles.heading}>Recall Challenge</h2>
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
          let bg = '#ffffff', border = '1px solid #e2e8f0', color = '#1a1a2e'
          if (submitted) {
            if (i === q.ans)         { bg = '#e1f5ee'; border = '2px solid #1D9E75'; color = '#0f6e56' }
            else if (i === selected) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#991b1b' }
          } else if (i === selected) {
            bg = '#f5f3ff'; border = '2px solid #7c3aed'; color = '#3C3489'
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              style={{ ...styles.option, background: bg, border, color }}>
              <span style={styles.optLetter}>{['A','B','C','D'][i]}</span>
              {opt}
              {submitted && i === q.ans        && <span style={{ marginLeft: 'auto' }}>✅</span>}
              {submitted && i === selected && i !== q.ans && <span style={{ marginLeft: 'auto' }}>❌</span>}
            </button>
          )
        })}
      </div>

      {!submitted
        ? <button onClick={handleSubmit} disabled={selected === null}
            style={{ ...styles.btn, opacity: selected === null ? 0.4 : 1, cursor: selected === null ? 'not-allowed' : 'pointer' }}>
            Submit Answer
          </button>
        : <button style={styles.btn} onClick={handleNext}>
            {current + 1 >= questionSet.length ? 'See Results →' : 'Next Question →'}
          </button>
      }
    </div>
  )
}

const styles = {
  container:    { maxWidth: 520, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem' },
  headerRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  label:        { margin: '0 0 4px', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed' },
  heading:      { margin: 0, fontSize: 20, fontWeight: 600, color: '#1a1a2e' },
  sub:          { margin: '0 0 1.5rem', fontSize: 14, color: '#6b7280' },
  counter:      { fontSize: 13, fontWeight: 600, color: '#7c3aed', background: '#ede9fe', padding: '4px 12px', borderRadius: 20 },
  barBg:        { background: '#e2e8f0', borderRadius: 20, height: 6, marginBottom: '1.5rem', overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 20, background: '#7c3aed' },
  questionCard: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem' },
  questionText: { margin: 0, fontSize: 16, fontWeight: 500, color: '#1a1a2e', lineHeight: 1.6 },
  options:      { display: 'grid', gap: 10, marginBottom: '1.5rem' },
  option:       { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' },
  optLetter:    { width: 26, height: 26, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, color: '#475569' },
  doneIcon:     { fontSize: 48, textAlign: 'center', marginBottom: '1rem' },
  scoreCard:    { background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 16, padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem' },
  scorePct:     { margin: '0 0 4px', fontSize: 48, fontWeight: 700, color: '#7c3aed' },
  scoreLabel:   { margin: '0 0 1rem', fontSize: 13, color: '#6b7280' },
  bubble:       { background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '0 16px 16px 16px', padding: '1rem 1.25rem', marginBottom: '1.5rem' },
  bubbleHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  bubbleName:   { fontSize: 12, fontWeight: 600, color: '#534AB7' },
  bubbleText:   { margin: 0, fontSize: 14, color: '#26215C', lineHeight: 1.7 },
  btn:          { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
}
