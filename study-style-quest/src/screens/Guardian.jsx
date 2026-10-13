import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { shuffle } from '../lib/shuffle'

const ZONE_COLORS = {
  A:     { color: '#7c3aed', bg: '#f5f3ff' },
  B:     { color: '#0f6e56', bg: '#e1f5ee' },
  long:  { color: '#0f6e56', bg: '#e1f5ee' },
  short: { color: '#92400e', bg: '#fef3c7' },
  step1: { color: '#1e40af', bg: '#eff6ff' },
  step2: { color: '#7c3aed', bg: '#f5f3ff' },
  step3: { color: '#0f6e56', bg: '#e1f5ee' },
  step4: { color: '#92400e', bg: '#fef3c7' },
}

const biomeConfig = {
  mindmap: {
    emoji: '🏔',
    name: 'Mind Map Mountains',
    guardian: 'The Cartographer',
    guardianEmoji: '🗺',
    technique: 'Mind Mapping',
    instruction: 'Group each idea under the branch it belongs to. Mind mapping works by connecting related ideas visually.',
  },
  recall: {
    emoji: '🌲',
    name: 'Recall Forest',
    guardian: 'Memory Keeper',
    guardianEmoji: '🧠',
    technique: 'Active Recall',
    instruction: 'Sort each study habit by whether it builds long-term memory or only short-term familiarity.',
  },
  feynman: {
    emoji: '🏛',
    name: 'Feynman City',
    guardian: 'The Professor',
    guardianEmoji: '👨‍🏫',
    technique: 'Feynman Technique',
    instruction: 'Put the four steps of the Feynman Technique in the right order.',
  },
}

// Every item has exactly one defensible home. Zone names are written out, never derived,
// so a correct answer is always guessable from the label.
const mindmapContent = {
  maths: {
    form1: { zones: { A: 'Number & operations', B: 'Shape & measurement' }, items: [
      ['➕', 'Addition', 'A'], ['➖', 'Subtraction', 'A'], ['½', 'Fractions', 'A'],
      ['📐', 'Angles', 'B'], ['📏', 'Perimeter', 'B'],
    ] },
    form2: { zones: { A: 'Number & algebra', B: 'Statistics' }, items: [
      ['🔢', 'LCM', 'A'], ['√', 'Square roots', 'A'], ['🔣', 'Inequalities', 'A'],
      ['📊', 'Mean', 'B'], ['📈', 'Mode', 'B'],
    ] },
    form3: { zones: { A: 'Algebra & graphs', B: 'Geometry & trigonometry' }, items: [
      ['🔣', 'Factorisation', 'A'], ['📉', 'Quadratics', 'A'], ['📈', 'Linear graphs', 'A'],
      ['📐', 'Pythagoras', 'B'], ['🔺', 'Sine & cosine', 'B'],
    ] },
    form4: { zones: { A: 'Matrices & vectors', B: 'Financial maths' }, items: [
      ['🔢', 'Matrices', 'A'], ['➡', 'Vectors', 'A'], ['🔄', 'Translations', 'A'],
      ['💰', 'Compound interest', 'B'], ['🧾', 'Hire purchase', 'B'],
    ] },
  },
  english: {
    form1: { zones: { A: 'Parts of speech', B: 'Punctuation' }, items: [
      ['📝', 'Noun', 'A'], ['🏃', 'Verb', 'A'], ['⭐', 'Adjective', 'A'],
      ['❓', 'Question mark', 'B'], ['🔘', 'Full stop', 'B'],
    ] },
    form2: { zones: { A: 'Paragraph structure', B: 'Figures of speech' }, items: [
      ['📖', 'Topic sentence', 'A'], ['🧱', 'Supporting detail', 'A'], ['🔚', 'Concluding sentence', 'A'],
      ['🌟', 'Simile', 'B'], ['🎭', 'Metaphor', 'B'],
    ] },
    form3: { zones: { A: 'Essay writing', B: 'Literary devices' }, items: [
      ['💬', 'Thesis statement', 'A'], ['📌', 'Supporting evidence', 'A'], ['🗂', 'Essay plan', 'A'],
      ['🌬', 'Personification', 'B'], ['🔤', 'Alliteration', 'B'],
    ] },
    form4: { zones: { A: 'Persuasive writing', B: 'Reading for meaning' }, items: [
      ['🔄', 'Counter-argument', 'A'], ['❔', 'Rhetorical question', 'A'], ['📊', 'Statistics as evidence', 'A'],
      ['💭', 'Implicit meaning', 'B'], ['🎚', "Writer's tone", 'B'],
    ] },
  },
  science: {
    form1: { zones: { A: 'States of matter', B: 'Life processes' }, items: [
      ['🧊', 'Solid', 'A'], ['💧', 'Liquid', 'A'], ['💨', 'Gas', 'A'],
      ['🌿', 'Photosynthesis', 'B'], ['🫁', 'Breathing', 'B'],
    ] },
    form2: { zones: { A: 'Energy', B: 'Living systems' }, items: [
      ['🚗', 'Kinetic energy', 'A'], ['⛰', 'Potential energy', 'A'], ['🔁', 'Energy transfer', 'A'],
      ['🫁', 'Lungs', 'B'], ['🌍', 'Ecosystem', 'B'],
    ] },
    form3: { zones: { A: 'Chemistry', B: 'Physics' }, items: [
      ['🧪', 'pH scale', 'A'], ['🍋', 'Acids & bases', 'A'], ['🔗', 'Covalent bonds', 'A'],
      ['⚡', 'F = ma', 'B'], ['🔌', 'Resistance (ohms)', 'B'],
    ] },
    form4: { zones: { A: 'Earth science', B: 'Radioactivity' }, items: [
      ['🪨', 'Weathering', 'A'], ['🌋', 'Tectonic plates', 'A'], ['🏜', 'Erosion', 'A'],
      ['☢️', 'Gamma rays', 'B'], ['⏳', 'Half-life', 'B'],
    ] },
  },
  biology: {
    form1: { zones: { A: 'Cell structure', B: 'Life processes' }, items: [
      ['🧱', 'Cell membrane', 'A'], ['🎯', 'Nucleus', 'A'], ['🌱', 'Chloroplast', 'A'],
      ['🌿', 'Photosynthesis', 'B'], ['🍽', 'Digestion', 'B'],
    ] },
    form2: { zones: { A: 'Movement in & out of cells', B: 'Blood' }, items: [
      ['💧', 'Osmosis', 'A'], ['🔬', 'Diffusion', 'A'], ['⚙️', 'Active transport', 'A'],
      ['🩸', 'Red blood cells', 'B'], ['🛡', 'White blood cells', 'B'],
    ] },
    form3: { zones: { A: 'Coordination', B: 'Evolution' }, items: [
      ['🧠', 'Cerebellum', 'A'], ['⚡', 'Reflex action', 'A'], ['🌡', 'Hypothalamus', 'A'],
      ['🌿', 'Natural selection', 'B'], ['🦎', 'Adaptation', 'B'],
    ] },
    form4: { zones: { A: 'Genetics', B: 'Homeostasis' }, items: [
      ['🔀', 'Meiosis', 'A'], ['🧬', 'Chromosomes', 'A'], ['🅰️', 'Alleles', 'A'],
      ['💉', 'Insulin', 'B'], ['💧', 'ADH', 'B'],
    ] },
  },
}

const recallContent = {
  zones: { long: 'Long-term memory', short: 'Short-term only' },
  items: [
    ['📝', 'Flashcards', 'long'], ['⏱', 'Spaced review', 'long'], ['✍', 'Practice tests', 'long'],
    ['🔁', 'Re-reading', 'short'], ['🖍', 'Highlighting', 'short'],
  ],
}

const feynmanContent = {
  zones: { step1: 'Step 1', step2: 'Step 2', step3: 'Step 3', step4: 'Step 4' },
  items: [
    ['📖', 'Study the concept', 'step1'], ['✏', 'Explain it simply', 'step2'],
    ['🔍', 'Find the gaps', 'step3'], ['🔄', 'Review & simplify', 'step4'],
  ],
}

function toChallenge(content) {
  return {
    zones: Object.entries(content.zones).map(([id, label]) => ({ id, label, ...ZONE_COLORS[id] })),
    items: content.items.map(([emoji, text, zone], index) => ({ id: `item-${index}`, emoji, text, zone })),
  }
}

function getChallenge(biome, subject, form) {
  if (biome === 'recall')  return toChallenge(recallContent)
  if (biome === 'feynman') return toChallenge(feynmanContent)

  const formKey = form ? 'form' + form.replace('Form ', '') : 'form1'
  const content = mindmapContent[subject]?.[formKey]
  if (!content) return null

  return toChallenge(content)
}

export default function Guardian({ onNext, biome = 'mindmap', subject = 'maths', profile }) {
  const form   = profile?.form ?? 'Form 1'
  const config = biomeConfig[biome] ?? biomeConfig.mindmap

  const [challenge] = useState(() => {
    const base = getChallenge(biome, subject, form)
    return base ? { ...base, items: shuffle(base.items) } : null
  })

  const [placed, setPlaced]           = useState({})   // { itemId: zoneId } — only ever holds correct placements
  const [selectedId, setSelectedId]   = useState(null) // tap-to-place, needed on phones where drag-and-drop does not fire
  const [draggingId, setDraggingId]   = useState(null)
  const [shake, setShake]             = useState(null) // { id, tick }
  const [mistakes, setMistakes]       = useState(0)
  const shakeTimer = useRef(null)

  useEffect(() => () => clearTimeout(shakeTimer.current), [])

  // Guard: no curated content for this subject/form — do not fall back to another subject silently.
  if (!challenge) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Coming soon</h2>
        <p style={styles.bubbleText}>This biome does not have {form} content for this subject yet.</p>
      </div>
    )
  }

  const { zones, items } = challenge
  const unplaced   = items.filter((item) => !placed[item.id])
  const allCorrect = items.every((item) => placed[item.id] === item.zone)

  function rejectPlacement(itemId) {
    setMistakes((m) => m + 1)
    setShake((prev) => ({ id: itemId, tick: (prev?.tick ?? 0) + 1 }))
    clearTimeout(shakeTimer.current)
    shakeTimer.current = setTimeout(() => setShake(null), 450)
  }

  function placeItem(itemId, zoneId) {
    if (!itemId || !zoneId) return
    if (placed[itemId]) return

    const item = items.find((i) => i.id === itemId)
    if (!item) return
    if (!zones.some((z) => z.id === zoneId)) return

    // The guard that was missing: being dropped somewhere is not the same as being right.
    if (item.zone !== zoneId) {
      rejectPlacement(itemId)
      return
    }

    setPlaced((prev) => ({ ...prev, [itemId]: zoneId }))
    setSelectedId(null)
  }

  function handleDragStart(event, itemId) {
    event.dataTransfer.setData('text/plain', itemId) // Firefox will not start a drag without data
    event.dataTransfer.effectAllowed = 'move'
    setDraggingId(itemId)
  }

  function handleDrop(event, zoneId) {
    event.preventDefault()
    const itemId = event.dataTransfer.getData('text/plain') || draggingId
    setDraggingId(null)
    placeItem(itemId, zoneId)
  }

  function handleItemKey(event, itemId) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    setSelectedId((current) => (current === itemId ? null : itemId))
  }

  function handleZoneKey(event, zoneId) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    placeItem(selectedId, zoneId)
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div style={styles.avatar}>{config.guardianEmoji}</div>
        <div>
          <p style={styles.guardianName}>{config.guardian}</p>
          <p style={styles.biomeName}>{config.emoji} {config.name}</p>
        </div>
        <span style={styles.techTag}>{config.technique}</span>
      </div>

      <div style={styles.bubble}>
        <p style={styles.bubbleText}>{config.instruction}</p>
      </div>

      {unplaced.length > 0 && (
        <div style={styles.nodesSection}>
          <p style={styles.sectionLabel}>Drag each item to its category — or tap an item, then tap the category:</p>
          <div style={styles.nodesRow}>
            {unplaced.map((item) => {
              const isShaking  = shake?.id === item.id
              const isSelected = selectedId === item.id
              return (
                <motion.div
                  key={`${item.id}-${isShaking ? shake.tick : 'idle'}`}
                  initial={{ x: 0 }}
                  animate={isShaking ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragEnd={() => setDraggingId(null)}
                    onClick={() => setSelectedId((current) => (current === item.id ? null : item.id))}
                    onKeyDown={(e) => handleItemKey(e, item.id)}
                    style={{
                      ...styles.node,
                      borderColor: isShaking ? '#ef4444' : isSelected ? '#7c3aed' : '#e2e8f0',
                      background:  isShaking ? '#fee2e2' : isSelected ? '#f5f3ff' : '#ffffff',
                      boxShadow:   isSelected ? '0 0 0 2px #c4b5fd' : 'none',
                    }}
                  >
                    {item.emoji} {item.text}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      <div style={styles.zonesGrid}>
        {zones.map((zone) => {
          const zoneItems = items.filter((item) => placed[item.id] === zone.id)
          const isTarget  = selectedId !== null
          return (
            <div
              key={zone.id}
              role="button"
              tabIndex={0}
              aria-label={`Place in ${zone.label}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, zone.id)}
              onClick={() => placeItem(selectedId, zone.id)}
              onKeyDown={(e) => handleZoneKey(e, zone.id)}
              style={{
                ...styles.zone,
                borderColor: zoneItems.length > 0 || isTarget ? zone.color : '#e2e8f0',
                background:  zoneItems.length > 0 ? zone.bg : '#f8fafc',
                cursor:      isTarget ? 'pointer' : 'default',
              }}
            >
              <p style={{ ...styles.zoneLabel, color: zone.color }}>{zone.label}</p>
              <div style={styles.zoneNodes}>
                {zoneItems.length === 0 && <p style={styles.zonePlaceholder}>{isTarget ? 'Tap to place here' : 'Drop here'}</p>}
                {zoneItems.map((item) => (
                  <div key={item.id} style={{ ...styles.node, cursor: 'default' }}>
                    {item.emoji} {item.text} <span style={{ color: '#1D9E75' }}>✓</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {mistakes > 0 && !allCorrect && (
        <p style={styles.mistakeNote}>
          {mistakes} incorrect {mistakes === 1 ? 'attempt' : 'attempts'} — wrong placements bounce back. Try another category.
        </p>
      )}

      {allCorrect && (
        <div style={styles.successBubble}>
          <p style={styles.bubbleText}>
            ✅ Every concept is in the right place
            {mistakes === 0 ? ' on your first try' : ` after ${mistakes} ${mistakes === 1 ? 'correction' : 'corrections'}`}.
            Connecting ideas like this is far more powerful than re-reading. Ready for the recall test?
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!allCorrect}
        style={{ ...styles.btn, opacity: allCorrect ? 1 : 0.4, cursor: allCorrect ? 'pointer' : 'not-allowed' }}
      >
        Continue to Recall Challenge →
      </button>

    </div>
  )
}

const styles = {
  container:       { maxWidth: 560, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem' },
  header:          { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' },
  avatar:          { width: 48, height: 48, borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  heading:         { margin: '0 0 8px', fontSize: 20, fontWeight: 600, color: '#1a1a2e' },
  guardianName:    { margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: '#1a1a2e' },
  biomeName:       { margin: 0, fontSize: 12, color: '#6b7280' },
  techTag:         { marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, background: '#ede9fe', color: '#7c3aed' },
  bubble:          { background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '0 16px 16px 16px', padding: '1rem 1.25rem', marginBottom: '1.5rem' },
  bubbleText:      { margin: 0, fontSize: 14, color: '#26215C', lineHeight: 1.7 },
  nodesSection:    { marginBottom: '1.25rem' },
  sectionLabel:    { margin: '0 0 10px', fontSize: 13, fontWeight: 500, color: '#6b7280' },
  nodesRow:        { display: 'flex', flexWrap: 'wrap', gap: 8 },
  node:            { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 500, color: '#1a1a2e', cursor: 'grab', userSelect: 'none' },
  zonesGrid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: '1rem' },
  zone:            { border: '2px dashed', borderRadius: 14, padding: '1rem', minHeight: 100, transition: 'all 0.2s' },
  zoneLabel:       { margin: '0 0 10px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' },
  zoneNodes:       { display: 'flex', flexWrap: 'wrap', gap: 6 },
  zonePlaceholder: { margin: 0, fontSize: 12, color: '#94a3b8' },
  mistakeNote:     { fontSize: 12, color: '#92400e', background: '#fef3c7', padding: '8px 12px', borderRadius: 8, margin: '0 0 1.25rem' },
  successBubble:   { background: '#e1f5ee', border: '1px solid #6ee7b7', borderRadius: 16, padding: '1rem 1.25rem', marginBottom: '1.25rem' },
  btn:             { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
}
