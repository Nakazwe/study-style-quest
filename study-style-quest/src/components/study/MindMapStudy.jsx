import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../../lib/shuffle'
import { LessonNotes } from './LessonNotes'
import { studyStyles } from './studyStyles'

const BRANCH_COLORS = {
  A: { color: '#7c3aed', bg: '#f5f3ff' },
  B: { color: '#0f6e56', bg: '#e1f5ee' },
}

export default function MindMapStudy({ lesson, onComplete }) {
  const [cards] = useState(() => shuffle(lesson.facts.map((fact) => ({ ...fact, id: `card-${fact.q}` }))))
  const [placed, setPlaced]         = useState({})          // { cardId: branchId } — only correct placements
  const [missed, setMissed]         = useState(() => new Set()) // cards that had at least one wrong attempt
  const [selectedId, setSelectedId] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [shake, setShake]           = useState(null)
  const shakeTimer = useRef(null)

  useEffect(() => () => clearTimeout(shakeTimer.current), [])

  const branches = Object.entries(lesson.branches).map(([id, label]) => ({ id, label, ...BRANCH_COLORS[id] }))
  const unplaced = cards.filter((card) => !placed[card.id])
  const done     = cards.every((card) => placed[card.id] === card.branch)
  const firstTry = cards.filter((card) => !missed.has(card.id)).length

  function placeCard(cardId, branchId) {
    if (!cardId || !branchId) return
    if (placed[cardId]) return

    const card = cards.find((c) => c.id === cardId)
    if (!card) return
    if (!lesson.branches[branchId]) return

    if (card.branch !== branchId) {
      setMissed((prev) => new Set(prev).add(cardId))
      setShake((prev) => ({ id: cardId, tick: (prev?.tick ?? 0) + 1 }))
      clearTimeout(shakeTimer.current)
      shakeTimer.current = setTimeout(() => setShake(null), 450)
      return
    }

    setPlaced((prev) => ({ ...prev, [cardId]: branchId }))
    setSelectedId(null)
  }

  function handleDrop(event, branchId) {
    event.preventDefault()
    const cardId = event.dataTransfer.getData('text/plain') || draggingId
    setDraggingId(null)
    placeCard(cardId, branchId)
  }

  function handleContinue() {
    if (!done) return
    onComplete({
      metric:  'Ideas mapped first try',
      correct: firstTry,
      total:   cards.length,
      score:   Math.round((firstTry / cards.length) * 100),
      missedConcepts: cards.filter((card) => missed.has(card.id)).map((card) => card.concept),
    })
  }

  return (
    <div>
      <LessonNotes lesson={lesson} accent="#7c3aed" compact />

      <p style={studyStyles.sub}>Drag each idea onto its branch — or tap the idea, then tap the branch.</p>

      <div style={styles.map}>
        {branches.map((branch, index) => {
          const branchCards = cards.filter((card) => placed[card.id] === branch.id)
          const isTarget = selectedId !== null
          return (
            <div key={branch.id} style={{ ...styles.branchColumn, order: index === 0 ? 0 : 2 }}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`Place on branch ${branch.label}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, branch.id)}
                onClick={() => placeCard(selectedId, branch.id)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  placeCard(selectedId, branch.id)
                }}
                style={{
                  ...styles.branch,
                  borderColor: branchCards.length > 0 || isTarget ? branch.color : '#cbd5e1',
                  background:  branchCards.length > 0 ? branch.bg : '#f8fafc',
                  cursor:      isTarget ? 'pointer' : 'default',
                }}
              >
                <p style={{ ...styles.branchLabel, color: branch.color }}>{branch.label}</p>
                {branchCards.length === 0 && <p style={styles.placeholder}>{isTarget ? 'Tap to place here' : 'Drop ideas here'}</p>}
                {branchCards.map((card) => (
                  <motion.div key={card.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.placedCard}>
                    <strong>{card.concept}</strong>
                    <span style={styles.placedText}>{card.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}

        <div style={{ ...styles.centerColumn, order: 1 }}>
          <div style={styles.connector} />
          <div style={styles.center}>{lesson.topic}</div>
          <div style={styles.connector} />
        </div>
      </div>

      {unplaced.length > 0 && (
        <div style={styles.tray}>
          {unplaced.map((card) => {
            const isShaking  = shake?.id === card.id
            const isSelected = selectedId === card.id
            return (
              <motion.div
                key={`${card.id}-${isShaking ? shake.tick : 'idle'}`}
                initial={{ x: 0 }}
                animate={isShaking ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', card.id)
                    e.dataTransfer.effectAllowed = 'move'
                    setDraggingId(card.id)
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  onClick={() => setSelectedId((current) => (current === card.id ? null : card.id))}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return
                    e.preventDefault()
                    setSelectedId((current) => (current === card.id ? null : card.id))
                  }}
                  style={{
                    ...styles.card,
                    borderColor: isShaking ? '#ef4444' : isSelected ? '#7c3aed' : '#e2e8f0',
                    background:  isShaking ? '#fee2e2' : isSelected ? '#f5f3ff' : '#ffffff',
                    boxShadow:   isSelected ? '0 0 0 2px #c4b5fd' : 'none',
                  }}
                >
                  {card.concept}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {missed.size > 0 && !done && (
        <p style={styles.missNote}>That idea belongs on the other branch — it bounced back. Check the notes.</p>
      )}

      {done && (
        <div style={{ ...studyStyles.summary, background: '#f5f3ff', borderColor: '#c4b5fd' }}>
          <p style={studyStyles.summaryText}>
            🗺 Map complete — <strong>{firstTry} of {cards.length}</strong> ideas placed on the right branch first time.
          </p>
        </div>
      )}

      <button
        onClick={handleContinue}
        disabled={!done}
        style={{ ...studyStyles.btn, opacity: done ? 1 : 0.4, cursor: done ? 'pointer' : 'not-allowed' }}
      >
        Continue to Recall Check →
      </button>
    </div>
  )
}

const styles = {
  map:          { display: 'flex', flexWrap: 'wrap', alignItems: 'stretch', gap: 12, marginBottom: '1rem' },
  branchColumn: { flex: '1 1 180px', minWidth: 0 },
  branch:       { height: '100%', minHeight: 120, border: '2px dashed', borderRadius: 16, padding: '0.9rem', boxSizing: 'border-box', transition: 'all 0.2s' },
  branchLabel:  { margin: '0 0 8px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' },
  placeholder:  { margin: 0, fontSize: 12, color: '#94a3b8' },
  placedCard:   { display: 'grid', gap: 2, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 10px', marginBottom: 6, fontSize: 13, color: '#1a1a2e' },
  placedText:   { fontSize: 12, color: '#6b7280', lineHeight: 1.45 },
  centerColumn: { flex: '0 1 150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '0 auto' },
  connector:    { width: 2, flex: 1, minHeight: 12, background: '#c4b5fd' },
  center:       { background: '#534AB7', color: '#ffffff', borderRadius: 999, padding: '12px 16px', fontSize: 13, fontWeight: 600, textAlign: 'center', lineHeight: 1.35 },
  tray:         { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' },
  card:         { border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 500, color: '#1a1a2e', cursor: 'grab', userSelect: 'none' },
  missNote:     { fontSize: 12, color: '#92400e', background: '#fef3c7', padding: '8px 12px', borderRadius: 8, margin: '0 0 1rem' },
}
