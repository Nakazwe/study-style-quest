import { studyStyles } from './studyStyles'

export function LessonNotes({ lesson, accent = '#7c3aed', compact = false }) {
  return (
    <div style={{ ...studyStyles.notes, borderColor: accent }}>
      <p style={{ ...studyStyles.notesLabel, color: accent }}>📒 Notes · {lesson.topic}</p>
      <ul style={studyStyles.notesList}>
        {lesson.facts.map((fact) => (
          <li key={fact.q} style={{ ...studyStyles.notesItem, fontSize: compact ? 13 : 14 }}>
            {fact.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function TimerBar({ remaining, total, accent }) {
  const pct = total > 0 ? (remaining / total) * 100 : 0
  return (
    <div style={studyStyles.timerRow}>
      <div style={studyStyles.timerTrack}>
        <div style={{ ...studyStyles.timerFill, width: `${pct}%`, background: accent }} />
      </div>
      <span style={{ ...studyStyles.timerText, color: accent }}>{remaining}s</span>
    </div>
  )
}
