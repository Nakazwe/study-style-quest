export default function SubjectPicker({ onNext, onSubject, profile }) {
  const coreSubjects = [
    { id: 'maths',   label: 'Mathematics', emoji: '📐', desc: 'Numbers, algebra, geometry' },
    { id: 'english', label: 'English',     emoji: '📖', desc: 'Language, writing, literature' },
    { id: 'science', label: 'Science',     emoji: '🔬', desc: 'Physics, chemistry, earth science' },
    { id: 'biology', label: 'Biology',     emoji: '🧬', desc: 'Cells, organisms, ecosystems' },
  ]

  const optionalSubjects = [
    { id: 'geography',   label: 'Geography',        emoji: '🌍', desc: 'Maps, environments, resources' },
    { id: 'history',     label: 'History',           emoji: '🏛',  desc: 'Events, people, civilisations' },
    { id: 'civics',      label: 'Civic Education',   emoji: '⚖️',  desc: 'Government, rights, democracy' },
    { id: 'computer',    label: 'Computer Studies',  emoji: '💻', desc: 'Technology, programming, systems' },
    { id: 'physics',     label: 'Physics',           emoji: '⚡', desc: 'Forces, energy, motion' },
    { id: 'chemistry',   label: 'Chemistry',         emoji: '⚗️',  desc: 'Elements, reactions, compounds' },
    { id: 'agriculture', label: 'Agriculture',       emoji: '🌱', desc: 'Farming, soils, crop production' },
    { id: 'art',         label: 'Art & Design',      emoji: '🎨', desc: 'Creativity, colour, composition' },
  ]

  const studentOptionals = profile?.subjects?.filter(
    (s) => !['maths', 'english', 'science', 'biology'].includes(s)
  ) ?? []

  const availableOptionals = optionalSubjects.filter((s) =>
    studentOptionals.includes(s.id)
  )

  function handlePick(id) {
    onSubject(id)
    onNext()
  }

  return (
    <div style={styles.container}>

      <p style={styles.label}>Study Session</p>
      <h2 style={styles.heading}>What are you studying today?</h2>
      <p style={styles.sub}>
        {profile?.form ?? 'Your form'} · Pick the subject you want to work on right now.
      </p>

      <div style={styles.bubble}>
        <div style={styles.bubbleHeader}>
          <span style={{ fontSize: 16 }}>🤖</span>
          <span style={styles.bubbleName}>Professor Cortex</span>
        </div>
        <p style={styles.bubbleText}>
          Choose the subject you need to study most today. We will then
          pick a technique world that helps you learn it in the way that
          works best for your brain.
        </p>
      </div>

      <p style={styles.sectionTitle}>Core subjects</p>
      <div style={styles.grid}>
        {coreSubjects.map((s) => (
          <button
            key={s.id}
            onClick={() => handlePick(s.id)}
            style={styles.card}
          >
            <span style={styles.emoji}>{s.emoji}</span>
            <p style={styles.cardName}>{s.label}</p>
            <p style={styles.cardDesc}>{s.desc}</p>
          </button>
        ))}
      </div>

      {availableOptionals.length > 0 && (
        <>
          <p style={{ ...styles.sectionTitle, marginTop: '1.5rem' }}>
            Your optional subjects
          </p>
          <div style={styles.grid}>
            {availableOptionals.map((s) => (
              <button
                key={s.id}
                onClick={() => handlePick(s.id)}
                style={styles.card}
              >
                <span style={styles.emoji}>{s.emoji}</span>
                <p style={styles.cardName}>{s.label}</p>
                <p style={styles.cardDesc}>{s.desc}</p>
              </button>
            ))}
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
    padding: '2rem 1.5rem',
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
  bubble: {
    background: '#f5f3ff',
    border: '1px solid #c4b5fd',
    borderRadius: '0 16px 16px 16px',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
  },
  bubbleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  bubbleName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#534AB7',
  },
  bubbleText: {
    margin: 0,
    fontSize: 14,
    color: '#26215C',
    lineHeight: 1.7,
  },
  sectionTitle: {
    margin: '0 0 10px',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: 12,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.25rem 1rem',
    borderRadius: 14,
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.15s',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardName: {
    margin: '0 0 4px',
    fontSize: 13,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  cardDesc: {
    margin: 0,
    fontSize: 11,
    color: '#9ca3af',
    lineHeight: 1.4,
  },
}