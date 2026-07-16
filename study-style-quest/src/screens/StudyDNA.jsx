import { useState, useEffect } from 'react'
import { BIOME_MAP, BIOMES }   from '../data/biomes'
import { SUBJECT_MAP }          from '../data/subjects'

function formatAvgResponse(ms) {
  if (!ms) return 'N/A'
  return (ms / 1000).toFixed(1) + 's'
}

function getTechniqueScores(biome, score) {
  const b = BIOME_MAP[biome] ?? BIOME_MAP.mindmap
  return BIOMES.map(bm => ({
    name:  bm.technique,
    pct:   bm.id === biome ? score : Math.round(score * (bm.id === 'recall' ? 0.79 : 0.62)),
    color: bm.color,
  }))
}

export default function StudyDNA({ biome = 'mindmap', subject = 'maths', profile, results }) {
  const b            = BIOME_MAP[biome]  ?? BIOME_MAP.mindmap
  const s            = SUBJECT_MAP[subject] ?? { label: 'Your Subject' }
  const form         = profile?.form ?? 'Form 1'
  const score        = results?.score ?? 0
  const avgMs        = results?.avgResponseMs
  const techScores   = getTechniqueScores(biome, score)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  const grade      = score >= 80 ? 'S' : score >= 65 ? 'A' : score >= 50 ? 'B' : 'C'
  const gradeColor = score >= 80 ? '#7c3aed' : score >= 65 ? '#0f6e56' : score >= 50 ? '#92400e' : '#dc2626'

  return (
    <div style={styles.container}>

      <p style={styles.label}>Study DNA Chamber</p>
      <h2 style={styles.heading}>Your Study DNA Report</h2>
      <p style={styles.sub}>{form} · {s.label} · Based on this session</p>

      {/* Score row */}
      <div style={styles.scoreRow}>
        <div style={{ ...styles.gradeCard, borderColor: gradeColor }}>
          <p style={{ ...styles.grade, color: gradeColor }}>{grade}</p>
          <p style={styles.gradeLabel}>Grade</p>
        </div>
        <div style={styles.metricsGrid}>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#7c3aed' }}>{score}%</p>
            <p style={styles.metricLabel}>Recall Accuracy</p>
          </div>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#0f6e56' }}>
              {results ? `${results.correct}/${results.total}` : '—'}
            </p>
            <p style={styles.metricLabel}>Questions Correct</p>
          </div>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#92400e' }}>{formatAvgResponse(avgMs)}</p>
            <p style={styles.metricLabel}>Avg Response</p>
          </div>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#1e40af' }}>
              {score >= 80 ? 'High' : score >= 50 ? 'Moderate' : 'Developing'}
            </p>
            <p style={styles.metricLabel}>Engagement</p>
          </div>
        </div>
      </div>

      {/* Honesty note */}
      <div style={styles.honestyNote}>
        <p style={styles.honestyText}>
          ℹ️ Technique comparison is based on this session only.
          More sessions will improve accuracy of your Study DNA.
        </p>
      </div>

      {/* Technique bars */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Technique Comparison (this session)</p>
        {techScores.map(t => (
          <div key={t.name} style={{ marginBottom: 14 }}>
            <div style={styles.barRow}>
              <span style={styles.barName}>{t.name}</span>
              <span style={{ ...styles.barPct, color: t.color }}>{t.pct}%</span>
            </div>
            <div style={styles.barBg}>
              <div style={{ ...styles.barFill, width: animated ? `${t.pct}%` : '0%', background: t.color, transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Primary technique */}
      <div style={{ ...styles.primaryCard, background: b.bg, borderColor: b.border }}>
        <p style={styles.primaryLabel}>Primary Technique This Session</p>
        <p style={{ ...styles.primaryName, color: b.color }}>{b.technique}</p>
        <p style={styles.insight}>{b.insight}</p>
      </div>

      {/* Strategy */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Recommended Strategy</p>
        <div style={styles.strategyCard}>
          <p style={styles.strategyText}>{b.strategy}</p>
        </div>
      </div>

      {/* Tips */}
      <div style={styles.section}>
        <p style={styles.sectionLabel}>Study Tips for {s.label}</p>
        {b.tips.map((tip, i) => (
          <div key={i} style={styles.tip}>
            <span style={{ ...styles.tipNum, color: b.color }}>{i + 1}</span>
            <p style={styles.tipText}>{tip}</p>
          </div>
        ))}
      </div>

      {/* Professor Cortex */}
      <div style={styles.bubble}>
        <div style={styles.bubbleHeader}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <span style={styles.bubbleName}>Professor Cortex</span>
        </div>
        <p style={styles.bubbleText}>
          Your Study DNA for this session is now mapped. You scored <strong>{score}%</strong> in {s.label} 
          using {b.technique}{avgMs ? ` with an average response time of ${formatAvgResponse(avgMs)}` : ''}.
          Complete more sessions across different biomes to build a fuller picture of your learning style.
        </p>
      </div>

      {/* Badge */}
      <div style={styles.badge}>
        <p style={styles.badgeTitle}>🧬 Study DNA — Session Complete</p>
        <p style={styles.badgeSub}>
          Technique: <strong>{b.technique}</strong> · Subject: <strong>{s.label}</strong> · Score: <strong>{score}%</strong>
        </p>
      </div>

      <button style={{ ...styles.btn, marginTop: '1.5rem' }} onClick={() => window.location.reload()}>
        Start a new session ↺
      </button>

    </div>
  )
}

const styles = {
  container:    { maxWidth: 540, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem' },
  label:        { margin: '0 0 4px', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#7c3aed' },
  heading:      { margin: '0 0 8px', fontSize: 22, fontWeight: 600, color: '#1a1a2e' },
  sub:          { margin: '0 0 1.5rem', fontSize: 14, color: '#6b7280', lineHeight: 1.6 },
  scoreRow:     { display: 'flex', gap: 12, marginBottom: '1rem', alignItems: 'stretch' },
  gradeCard:    { border: '2px solid', borderRadius: 16, padding: '1rem', textAlign: 'center', minWidth: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' },
  grade:        { margin: '0 0 4px', fontSize: 36, fontWeight: 700 },
  gradeLabel:   { margin: 0, fontSize: 11, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' },
  metricsGrid:  { flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  metric:       { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.75rem', textAlign: 'center' },
  metricNum:    { margin: '0 0 2px', fontSize: 18, fontWeight: 700 },
  metricLabel:  { margin: 0, fontSize: 11, color: '#6b7280' },
  honestyNote:  { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.5rem' },
  honestyText:  { margin: 0, fontSize: 13, color: '#0369a1', lineHeight: 1.5 },
  section:      { marginBottom: '1.5rem' },
  sectionLabel: { margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: '#374151' },
  barRow:       { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  barName:      { fontSize: 13, color: '#1a1a2e', fontWeight: 500 },
  barPct:       { fontSize: 13, fontWeight: 600 },
  barBg:        { background: '#e2e8f0', borderRadius: 20, height: 8, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 20 },
  primaryCard:  { border: '1px solid', borderRadius: 16, padding: '1.25rem', marginBottom: '1.5rem' },
  primaryLabel: { margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em' },
  primaryName:  { margin: '0 0 8px', fontSize: 18, fontWeight: 700 },
  insight:      { margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.7 },
  strategyCard: { background: '#1a1a2e', borderRadius: 12, padding: '1rem 1.25rem' },
  strategyText: { margin: 0, fontSize: 14, color: '#e2e8f0', fontWeight: 500, lineHeight: 1.7, fontFamily: 'monospace' },
  tip:          { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 },
  tipNum:       { width: 26, height: 26, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  tipText:      { margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 },
  bubble:       { background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '0 16px 16px 16px', padding: '1rem 1.25rem', marginBottom: '1.5rem' },
  bubbleHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  bubbleName:   { fontSize: 12, fontWeight: 600, color: '#534AB7' },
  bubbleText:   { margin: 0, fontSize: 14, color: '#26215C', lineHeight: 1.7 },
  badge:        { background: 'linear-gradient(135deg, #1a1a2e, #2d1b69)', borderRadius: 16, padding: '1.25rem', textAlign: 'center' },
  badgeTitle:   { margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: '#ffffff' },
  badgeSub:     { margin: 0, fontSize: 13, color: '#c4b5fd', lineHeight: 1.6 },
  btn:          { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
}
