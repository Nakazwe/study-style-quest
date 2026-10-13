import { motion } from 'framer-motion'
import { BIOMES, BIOME_MAP } from '../data/biomes'

export default function WorldMap({ onNext, onSelect, selected = 'mindmap', profile, testedBiomes }) {
  const selectedBiome = BIOME_MAP[selected] ?? BIOMES[0]
  const tested = testedBiomes instanceof Set ? testedBiomes : new Set()

  return (
    <div style={styles.container}>
      <p style={styles.label}>Realm of Knowledge</p>
      <h2 style={styles.heading}>Choose your biome</h2>
      <p style={styles.sub}>Each biome teaches the same lesson with a different study technique. Try them all to find yours.</p>

      <div style={styles.grid}>
        {BIOMES.map((b, i) => (
          <motion.button
            key={b.id}
            onClick={() => onSelect(b.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...styles.card,
              border: selected === b.id ? `2px solid ${b.color}` : '1px solid #e2e8f0',
              background: selected === b.id ? b.bg : '#ffffff',
            }}
          >
            {tested.has(b.id) && <span style={{ ...styles.testedBadge, color: b.color }}>✓ Tried</span>}
            <span style={styles.emoji}>{b.emoji}</span>
            <p style={styles.cardName}>{b.name}</p>
            <p style={styles.cardTech}>{b.technique}</p>
            <span style={{ ...styles.tag, color: b.tagColor, background: b.tagBg }}>{b.tag}</span>
          </motion.button>
        ))}
      </div>

      <div style={styles.detail}>
        <div style={{ ...styles.detailLeft, background: selectedBiome.bg }}>
          <span style={{ fontSize: 32 }}>{selectedBiome.emoji}</span>
        </div>
        <div>
          <p style={styles.detailName}>{selectedBiome.name}</p>
          <p style={styles.detailDesc}>{selectedBiome.activity}</p>
          <p style={{ ...styles.detailGuardian, color: selectedBiome.color }}>
            Guardian: <strong>{selectedBiome.guardian}</strong> · Measures: {selectedBiome.studyMetric.toLowerCase()}
          </p>
          {profile?.form && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
              {profile.form} · {profile.subjects?.length ?? 4} subjects enrolled
            </p>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={styles.btn}
        onClick={onNext}
      >
        Enter {selectedBiome.name} →
      </motion.button>
    </div>
  )
}

const styles = {
  container:      { maxWidth: 560, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem' },
  label:          { margin: '0 0 6px', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed' },
  heading:        { margin: '0 0 8px', fontSize: 22, fontWeight: 600, color: '#1a1a2e' },
  sub:            { margin: '0 0 1.5rem', fontSize: 14, color: '#6b7280', lineHeight: 1.6 },
  grid:           { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: '1.5rem' },
  card:           { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.25rem 1rem', borderRadius: 16, cursor: 'pointer', textAlign: 'center' },
  testedBadge:    { position: 'absolute', top: 8, right: 10, fontSize: 11, fontWeight: 700 },
  emoji:          { fontSize: 32, marginBottom: 10 },
  cardName:       { margin: '0 0 4px', fontSize: 13, fontWeight: 600, color: '#1a1a2e' },
  cardTech:       { margin: '0 0 10px', fontSize: 12, color: '#6b7280' },
  tag:            { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 },
  detail:         { display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1rem 1.25rem', marginBottom: '1.5rem' },
  detailLeft:     { flexShrink: 0, width: 52, height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  detailName:     { margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#1a1a2e' },
  detailDesc:     { margin: '0 0 6px', fontSize: 13, color: '#374151', lineHeight: 1.6 },
  detailGuardian: { margin: 0, fontSize: 12 },
  btn:            { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
}
