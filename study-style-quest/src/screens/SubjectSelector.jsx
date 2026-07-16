import { useState } from 'react'

const FORMS = ['Form 1', 'Form 2', 'Form 3', 'Form 4']

const SUBJECTS = {
  core: [
    { id: 'maths', label: 'Mathematics', emoji: '📐' },
    { id: 'english', label: 'English', emoji: '📖' },
    { id: 'science', label: 'Science', emoji: '🔬' },
    { id: 'biology', label: 'Biology', emoji: '🧬' },
  ],
  optional: [
    { id: 'geography', label: 'Geography', emoji: '🌍' },
    { id: 'history', label: 'History', emoji: '🏛' },
    { id: 'civics', label: 'Civic Education', emoji: '⚖️' },
    { id: 'computer', label: 'Computer Studies', emoji: '💻' },
    { id: 'physics', label: 'Physics', emoji: '⚡' },
    { id: 'chemistry', label: 'Chemistry', emoji: '⚗️' },
    { id: 'agriculture', label: 'Agriculture', emoji: '🌱' },
    { id: 'art', label: 'Art & Design', emoji: '🎨' },
  ],
}

export default function SubjectSelector({ onNext, onSave }) {
  const [selectedForm, setSelectedForm] = useState(null)
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [step, setStep] = useState(1)

  function toggleSubject(id) {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  function handleFormNext() {
    if (!selectedForm) return
    setStep(2)
  }

  function handleFinish() {
    if (selectedSubjects.length === 0) return
    onSave({ form: selectedForm, subjects: selectedSubjects })
    onNext()
  }

  const coreIds = SUBJECTS.core.map((s) => s.id)

  return (
    <div style={styles.container}>
      <div style={styles.dots}>
        {[1, 2].map((n) => (
          <div
            key={n}
            style={{
              ...styles.dot,
              background: step === n ? '#534AB7' : step > n ? '#7F77DD' : '#e2e8f0',
            }}
          />
        ))}
      </div>

      {step === 1 && (
        <>
          <p style={styles.label}>Step 1 of 2</p>
          <h2 style={styles.heading}>What form are you in?</h2>
          <p style={styles.sub}>This helps us match questions to exactly what you are studying this year.</p>

          <div style={styles.formGrid}>
            {FORMS.map((form) => (
              <button
                key={form}
                onClick={() => setSelectedForm(form)}
                style={{
                  ...styles.formCard,
                  border: selectedForm === form ? '2px solid #534AB7' : '1px solid #e2e8f0',
                  background: selectedForm === form ? '#f5f3ff' : '#ffffff',
                }}
              >
                <span style={styles.formEmoji}>📚</span>
                <p style={styles.formLabel}>{form}</p>
                <p style={styles.formSub}>Zambia O-Level</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleFormNext}
            disabled={!selectedForm}
            style={{
              ...styles.btn,
              opacity: selectedForm ? 1 : 0.4,
              cursor: selectedForm ? 'pointer' : 'not-allowed',
            }}
          >
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p style={styles.label}>Step 2 of 2</p>
          <h2 style={styles.heading}>Which subjects are you taking?</h2>
          <p style={styles.sub}>Core subjects are already included. Add any optional subjects you study.</p>

          <div style={styles.sectionLabel}>
            <span style={styles.sectionTitle}>Core subjects</span>
            <span style={styles.sectionBadge}>Always included</span>
          </div>
          <div style={styles.subjectGrid}>
            {SUBJECTS.core.map((s) => (
              <div key={s.id} style={styles.subjectCardLocked}>
                <span style={styles.subjectEmoji}>{s.emoji}</span>
                <p style={styles.subjectName}>{s.label}</p>
                <span style={styles.checkmark}>✓</span>
              </div>
            ))}
          </div>

          <div style={{ ...styles.sectionLabel, marginTop: '1.25rem' }}>
            <span style={styles.sectionTitle}>Optional subjects</span>
            <span style={styles.sectionCount}>{selectedSubjects.filter((s) => !coreIds.includes(s)).length} selected</span>
          </div>
          <div style={styles.subjectGrid}>
            {SUBJECTS.optional.map((s) => {
              const active = selectedSubjects.includes(s.id)
              return (
                <button
                  key={s.id}
                  onClick={() => toggleSubject(s.id)}
                  style={{
                    ...styles.subjectCard,
                    border: active ? '2px solid #534AB7' : '1px solid #e2e8f0',
                    background: active ? '#f5f3ff' : '#ffffff',
                  }}
                >
                  <span style={styles.subjectEmoji}>{s.emoji}</span>
                  <p style={styles.subjectName}>{s.label}</p>
                  {active && <span style={styles.checkmark}>✓</span>}
                </button>
              )
            })}
          </div>

          {selectedForm && (
            <div style={styles.summary}>
              <p style={styles.summaryText}>
                <strong>{selectedForm}</strong> · {4 + selectedSubjects.filter((s) => !coreIds.includes(s)).length} subjects selected
              </p>
            </div>
          )}

          <div style={styles.btnRow}>
            <button style={styles.btnGhost} onClick={() => setStep(1)}>
              ← Back
            </button>
            <button onClick={handleFinish} style={{ ...styles.btn, flex: 1 }}>
              Start learning →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 560,
    margin: '0 auto',
    fontFamily: 'Inter, system-ui, sans-serif',
    paddingBottom: '2rem',
  },
  dots: {
    display: 'flex',
    gap: 8,
    marginBottom: '1.5rem',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    transition: 'background 0.2s',
  },
  label: {
    margin: '0 0 4px',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#7c3aed',
  },
  heading: {
    margin: '0 0 8px',
    fontSize: 22,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  sub: {
    margin: '0 0 1.5rem',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.6,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
    marginBottom: '1.5rem',
  },
  formCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.25rem 1rem',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'center',
  },
  formEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  formLabel: {
    margin: '0 0 4px',
    fontSize: 15,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  formSub: {
    margin: 0,
    fontSize: 11,
    color: '#9ca3af',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 10px',
    borderRadius: 20,
    background: '#e1f5ee',
    color: '#0f6e56',
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: 600,
    padding: '2px 10px',
    borderRadius: 20,
    background: '#ede9fe',
    color: '#534AB7',
  },
  subjectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 10,
  },
  subjectCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0.75rem',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'center',
    position: 'relative',
  },
  subjectCardLocked: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 0.75rem',
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    background: '#f8fafc',
    textAlign: 'center',
    position: 'relative',
    opacity: 0.85,
  },
  subjectEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  subjectName: {
    margin: 0,
    fontSize: 12,
    fontWeight: 500,
    color: '#1a1a2e',
    lineHeight: 1.3,
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 8,
    fontSize: 11,
    fontWeight: 700,
    color: '#534AB7',
  },
  summary: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '0.75rem 1rem',
    margin: '1.25rem 0',
  },
  summaryText: {
    margin: 0,
    fontSize: 14,
    color: '#374151',
  },
  btnRow: {
    display: 'flex',
    gap: 10,
    marginTop: '0.5rem',
  },
  btn: {
    background: '#534AB7',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '13px 24px',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
  },
  btnGhost: {
    background: 'transparent',
    color: '#6b7280',
    border: '1px solid #e2e8f0',
    borderRadius: 12,
    padding: '13px 18px',
    fontSize: 14,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
}