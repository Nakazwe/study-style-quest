import { useState } from 'react'

const biomeConfig = {
  mindmap: {
    emoji: '🏔',
    name: 'Mind Map Mountains',
    guardian: 'The Cartographer',
    guardianEmoji: '🗺',
    technique: 'Mind Mapping',
    instruction: 'Drag each item into the correct category. Mind mapping works by grouping related ideas together visually.',
    zones: [
      { id: 'A', label: 'Category A', color: '#7c3aed', bg: '#f5f3ff' },
      { id: 'B', label: 'Category B', color: '#0f6e56', bg: '#e1f5ee' },
    ],
  },
  recall: {
    emoji: '🌲',
    name: 'Recall Forest',
    guardian: 'Memory Keeper',
    guardianEmoji: '🧠',
    technique: 'Active Recall',
    instruction: 'Drag each technique to whether it helps long-term or short-term retention.',
    zones: [
      { id: 'long', label: 'Long-term retention', color: '#0f6e56', bg: '#e1f5ee' },
      { id: 'short', label: 'Short-term only',    color: '#92400e', bg: '#fef3c7' },
    ],
  },
  feynman: {
    emoji: '🏛',
    name: 'Feynman City',
    guardian: 'The Professor',
    guardianEmoji: '👨‍🏫',
    technique: 'Feynman Technique',
    instruction: 'Drag each step into the correct order of the Feynman Technique.',
    zones: [
      { id: 'step1', label: 'Step 1', color: '#1e40af', bg: '#eff6ff' },
      { id: 'step2', label: 'Step 2', color: '#7c3aed', bg: '#f5f3ff' },
      { id: 'step3', label: 'Step 3', color: '#0f6e56', bg: '#e1f5ee' },
      { id: 'step4', label: 'Step 4', color: '#92400e', bg: '#fef3c7' },
    ],
  },
}

const subjectNodes = {
  maths: {
    form1: [
      { id: 'n1', label: '➕ Addition',        zone: 'A' },
      { id: 'n2', label: '➖ Subtraction',     zone: 'A' },
      { id: 'n3', label: '📐 Geometry',        zone: 'B' },
      { id: 'n4', label: '📏 Measurement',     zone: 'B' },
      { id: 'n5', label: '½ Fractions',        zone: 'A' },
    ],
    form2: [
      { id: 'n1', label: '🔢 LCM',             zone: 'A' },
      { id: 'n2', label: '📊 Mean',            zone: 'B' },
      { id: 'n3', label: '📐 Quadrilaterals',  zone: 'B' },
      { id: 'n4', label: '🔣 Inequalities',    zone: 'A' },
      { id: 'n5', label: '√ Square roots',     zone: 'A' },
    ],
    form3: [
      { id: 'n1', label: '📈 Linear graphs',   zone: 'B' },
      { id: 'n2', label: '🔣 Factorisation',   zone: 'A' },
      { id: 'n3', label: '📐 Pythagoras',      zone: 'B' },
      { id: 'n4', label: '📉 Quadratics',      zone: 'A' },
      { id: 'n5', label: '📐 Trigonometry',    zone: 'B' },
    ],
    form4: [
      { id: 'n1', label: '🔢 Matrices',        zone: 'A' },
      { id: 'n2', label: '📊 Probability',     zone: 'B' },
      { id: 'n3', label: '➡ Vectors',         zone: 'A' },
      { id: 'n4', label: '💰 Interest',        zone: 'B' },
      { id: 'n5', label: '🔄 Transformations', zone: 'B' },
    ],
  },
  english: {
    form1: [
      { id: 'n1', label: '📝 Nouns',           zone: 'A' },
      { id: 'n2', label: '🏃 Verbs',           zone: 'A' },
      { id: 'n3', label: '❓ Question mark',   zone: 'B' },
      { id: 'n4', label: '⭐ Adjectives',      zone: 'A' },
      { id: 'n5', label: '🔤 Spelling',        zone: 'B' },
    ],
    form2: [
      { id: 'n1', label: '⏰ Past tense',      zone: 'A' },
      { id: 'n2', label: '🌟 Simile',          zone: 'B' },
      { id: 'n3', label: '🔄 Antonyms',        zone: 'B' },
      { id: 'n4', label: '📖 Topic sentence',  zone: 'A' },
      { id: 'n5', label: '✍ Paragraphing',     zone: 'A' },
    ],
    form3: [
      { id: 'n1', label: '🌬 Personification', zone: 'B' },
      { id: 'n2', label: '📜 Passive voice',   zone: 'A' },
      { id: 'n3', label: '💬 Thesis statement',zone: 'A' },
      { id: 'n4', label: '🌟 Metaphor',        zone: 'B' },
      { id: 'n5', label: '📝 Essay structure', zone: 'A' },
    ],
    form4: [
      { id: 'n1', label: '💭 Implicit meaning',zone: 'B' },
      { id: 'n2', label: '⚡ Short sentences', zone: 'A' },
      { id: 'n3', label: '🔄 Counter-argument',zone: 'A' },
      { id: 'n4', label: '📖 Discursive essay',zone: 'B' },
      { id: 'n5', label: '✍ Argumentative',   zone: 'A' },
    ],
  },
  science: {
    form1: [
      { id: 'n1', label: '🧊 Solid',           zone: 'A' },
      { id: 'n2', label: '💧 Liquid',          zone: 'A' },
      { id: 'n3', label: '💨 Gas',             zone: 'A' },
      { id: 'n4', label: '❤️ Heart',           zone: 'B' },
      { id: 'n5', label: '🌿 Photosynthesis',  zone: 'B' },
    ],
    form2: [
      { id: 'n1', label: '⚗️ H2O',            zone: 'A' },
      { id: 'n2', label: '🚗 Kinetic energy',  zone: 'B' },
      { id: 'n3', label: '🫁 Lungs',           zone: 'A' },
      { id: 'n4', label: '🌍 Ecosystem',       zone: 'B' },
      { id: 'n5', label: '⚡ Energy transfer', zone: 'B' },
    ],
    form3: [
      { id: 'n1', label: '🌡 Heating particles',zone: 'A' },
      { id: 'n2', label: '⚡ F = ma',          zone: 'B' },
      { id: 'n3', label: '🧪 pH neutral = 7',  zone: 'A' },
      { id: 'n4', label: '💧 Covalent bonds',  zone: 'B' },
      { id: 'n5', label: '🔬 Acids & bases',   zone: 'A' },
    ],
    form4: [
      { id: 'n1', label: '⚡ Mitochondria',    zone: 'A' },
      { id: 'n2', label: '🔌 Ohm\'s Law',      zone: 'B' },
      { id: 'n3', label: '☢️ Gamma rays',      zone: 'B' },
      { id: 'n4', label: '🪨 Weathering',      zone: 'A' },
      { id: 'n5', label: '⚛️ Radiation',       zone: 'B' },
    ],
  },
  biology: {
    form1: [
      { id: 'n1', label: '🔬 Cell',            zone: 'A' },
      { id: 'n2', label: '🌿 Photosynthesis',  zone: 'B' },
      { id: 'n3', label: '🧱 Cell membrane',   zone: 'A' },
      { id: 'n4', label: '🫀 Stomach',         zone: 'B' },
      { id: 'n5', label: '🌱 Chloroplast',     zone: 'B' },
    ],
    form2: [
      { id: 'n1', label: '💧 Osmosis',         zone: 'A' },
      { id: 'n2', label: '🧬 DNA',             zone: 'A' },
      { id: 'n3', label: '🩸 Red blood cells', zone: 'B' },
      { id: 'n4', label: '👫 Sexual repro.',   zone: 'B' },
      { id: 'n5', label: '🔬 Diffusion',       zone: 'A' },
    ],
    form3: [
      { id: 'n1', label: '🔄 Mitosis',         zone: 'A' },
      { id: 'n2', label: '⚗️ Enzymes',         zone: 'B' },
      { id: 'n3', label: '🧠 Cerebellum',      zone: 'A' },
      { id: 'n4', label: '🌿 Natural selection',zone: 'B' },
      { id: 'n5', label: '🔬 Cell division',   zone: 'A' },
    ],
    form4: [
      { id: 'n1', label: '🔀 Meiosis',         zone: 'A' },
      { id: 'n2', label: '⚖️ Homeostasis',     zone: 'B' },
      { id: 'n3', label: '🩸 Blood type O',    zone: 'A' },
      { id: 'n4', label: '💉 Insulin',         zone: 'B' },
      { id: 'n5', label: '🧬 Chromosomes',     zone: 'A' },
    ],
  },
}

const recallNodes = {
  long: [
    { id: 'n1', label: '📝 Flashcards',      zone: 'long' },
    { id: 'n2', label: '⏱ Spaced Review',    zone: 'long' },
    { id: 'n3', label: '🔁 Re-reading',      zone: 'short' },
    { id: 'n4', label: '✍ Practice Tests',   zone: 'long' },
    { id: 'n5', label: '🖍 Highlighting',    zone: 'short' },
  ],
}

const feynmanNodes = [
  { id: 'n1', label: '📖 Study the concept', zone: 'step1' },
  { id: 'n2', label: '✏ Explain simply',     zone: 'step2' },
  { id: 'n3', label: '🔍 Find the gaps',     zone: 'step3' },
  { id: 'n4', label: '🔄 Review & simplify', zone: 'step4' },
]

function getNodes(biome, subject, form) {
  if (biome === 'recall')  return recallNodes.long
  if (biome === 'feynman') return feynmanNodes
  const formKey = form ? 'form' + form.replace('Form ', '') : 'form1'
  const bank = subjectNodes[subject] ?? subjectNodes.maths
  return bank[formKey] ?? bank.form1
}

function getZoneLabels(biome, subject, form) {
  if (biome !== 'mindmap') return null
  const formKey = form ? 'form' + form.replace('Form ', '') : 'form1'
  const bank = subjectNodes[subject] ?? subjectNodes.maths
  const nodes = bank[formKey] ?? bank.form1
  const aItems = nodes.filter(n => n.zone === 'A').map(n => n.label.split(' ').slice(1).join(' '))
  const bItems = nodes.filter(n => n.zone === 'B').map(n => n.label.split(' ').slice(1).join(' '))
  return {
    A: aItems[0] ? aItems[0] + ' & related' : 'Category A',
    B: bItems[0] ? bItems[0] + ' & related' : 'Category B',
  }
}

export default function Guardian({ onNext, biome = 'mindmap', subject = 'maths', profile }) {
  const form   = profile?.form ?? 'Form 1'
  const config = biomeConfig[biome] ?? biomeConfig.mindmap
  const nodes  = getNodes(biome, subject, form)
  const zoneLabels = getZoneLabels(biome, subject, form)

  const zones = config.zones.map(z => ({
    ...z,
    label: zoneLabels?.[z.id] ?? z.label,
  }))

  const [placed, setPlaced] = useState({})
  const [dragId, setDragId] = useState(null)

  const unplaced  = nodes.filter(n => !placed[n.id])
  const allPlaced = unplaced.length === 0

  function onDrop(zoneId) {
    if (!dragId) return
    setPlaced(prev => ({ ...prev, [dragId]: zoneId }))
    setDragId(null)
  }

  function getZoneNodes(zoneId) {
    return nodes.filter(n => placed[n.id] === zoneId)
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
          <p style={styles.sectionLabel}>Drag these into the correct category:</p>
          <div style={styles.nodesRow}>
            {unplaced.map(node => (
              <div
                key={node.id}
                draggable
                onDragStart={() => setDragId(node.id)}
                style={styles.node}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.zonesGrid}>
        {zones.map(zone => {
          const zoneNodes = getZoneNodes(zone.id)
          return (
            <div
              key={zone.id}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(zone.id)}
              style={{
                ...styles.zone,
                borderColor: zoneNodes.length > 0 ? zone.color : '#e2e8f0',
                background:  zoneNodes.length > 0 ? zone.bg    : '#f8fafc',
              }}
            >
              <p style={{ ...styles.zoneLabel, color: zone.color }}>{zone.label}</p>
              <div style={styles.zoneNodes}>
                {zoneNodes.length === 0 && <p style={styles.zonePlaceholder}>Drop here</p>}
                {zoneNodes.map(n => (
                  <div key={n.id} style={{ ...styles.node, cursor: 'default' }}>{n.label}</div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {allPlaced && (
        <div style={styles.successBubble}>
          <p style={styles.bubbleText}>
            ✅ Well done! You have mapped all the concepts correctly.
            Your brain has now actively processed these connections —
            that is far more powerful than just reading. Ready for the recall test?
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!allPlaced}
        style={{ ...styles.btn, opacity: allPlaced ? 1 : 0.4, cursor: allPlaced ? 'pointer' : 'not-allowed' }}
      >
        Continue to Recall Challenge →
      </button>

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
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: '#ede9fe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    flexShrink: 0,
  },
  guardianName: {
    margin: '0 0 2px',
    fontSize: 15,
    fontWeight: 600,
    color: '#1a1a2e',
  },
  biomeName: {
    margin: 0,
    fontSize: 12,
    color: '#6b7280',
  },
  techTag: {
    marginLeft: 'auto',
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 20,
    background: '#ede9fe',
    color: '#7c3aed',
  },
  bubble: {
    background: '#f5f3ff',
    border: '1px solid #c4b5fd',
    borderRadius: '0 16px 16px 16px',
    padding: '1rem 1.25rem',
    marginBottom: '1.5rem',
  },
  bubbleText: {
    margin: 0,
    fontSize: 14,
    color: '#26215C',
    lineHeight: 1.7,
  },
  nodesSection: {
    marginBottom: '1.25rem',
  },
  sectionLabel: {
    margin: '0 0 10px',
    fontSize: 13,
    fontWeight: 500,
    color: '#6b7280',
  },
  nodesRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  node: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: '8px 14px',
    fontSize: 13,
    fontWeight: 500,
    color: '#1a1a2e',
    cursor: 'grab',
    userSelect: 'none',
  },
  zonesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    marginBottom: '1.5rem',
  },
  zone: {
    border: '2px dashed',
    borderRadius: 14,
    padding: '1rem',
    minHeight: 100,
    transition: 'all 0.2s',
  },
  zoneLabel: {
    margin: '0 0 10px',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  zoneNodes: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  zonePlaceholder: {
    margin: 0,
    fontSize: 12,
    color: '#cbd5e1',
  },
  successBubble: {
    background: '#e1f5ee',
    border: '1px solid #6ee7b7',
    borderRadius: 16,
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
  },
  btn: {
    width: '100%',
    background: '#534AB7',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '13px 24px',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
  },
}
