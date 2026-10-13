import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BIOME_MAP, BIOMES } from '../data/biomes'
import { SUBJECT_MAP } from '../data/subjects'
import { gradeFor, summariseTechniques, rankTechniques } from '../lib/scoring'
import useCortex from '../hooks/useCortex'

const TECHNIQUE_IDS = BIOMES.map((b) => b.id)

function formatAvgResponse(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return 'N/A'
  return (ms / 1000).toFixed(1) + 's'
}

export default function StudyDNA({ biome = 'mindmap', subject = 'maths', profile, results, history = [], onTryAnother, onChangeSubject }) {
  const [animated, setAnimated] = useState(false)
  const askedRef = useRef(false)
  const { ask, message: cortexMessage, loading: cortexLoading } = useCortex()

  const s    = SUBJECT_MAP[subject] ?? { label: 'Your Subject' }
  const form = profile?.form ?? 'Form 1'

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300)
    return () => clearTimeout(t)
  }, [])

  // Guard: ask Professor Cortex once per mounted report, and only with real results.
  useEffect(() => {
    if (!results) return
    if (askedRef.current) return
    askedRef.current = true

    ask({
      score:         results.score,
      subject:       s.label,
      form,
      biome,
      correct:       results.correct,
      total:         results.total,
      avgResponseMs: results.avgResponseMs,
    })
  }, [results, ask, s.label, form, biome])

  // Guard: never render a report (or a fake "C" grade) without a finished session behind it.
  if (!results) {
    return (
      <div style={styles.container}>
        <p style={styles.label}>Study DNA Chamber</p>
        <h2 style={styles.heading}>No session to report yet</h2>
        <p style={styles.sub}>Complete a recall challenge and your Study DNA will appear here.</p>
        <button style={styles.btn} onClick={onTryAnother}>Choose a biome →</button>
      </div>
    )
  }

  const score    = results.score
  const { grade, color: gradeColor } = gradeFor(score)

  const summary  = summariseTechniques(history, TECHNIQUE_IDS)
  const ranked   = rankTechniques(summary)
  const tested   = ranked.length
  const totalSessions = summary.reduce((sum, t) => sum + t.sessions, 0)

  // Primary technique comes from measured history, not from the biome just played.
  const primaryId = ranked[0]?.id ?? biome
  const primary   = BIOME_MAP[primaryId] ?? BIOME_MAP.mindmap
  const secondary = ranked[1] ? BIOME_MAP[ranked[1].id] : null
  const current   = BIOME_MAP[biome] ?? BIOME_MAP.mindmap
  const untested  = summary.filter((t) => t.sessions === 0).map((t) => BIOME_MAP[t.id].technique)

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <p style={styles.label}>Study DNA Chamber</p>
      <h2 style={styles.heading}>Your Study DNA Report</h2>
      <p style={styles.sub}>{form} · {s.label} · {current.technique} session</p>

      <div style={styles.scoreRow}>
        <motion.div
          style={{ ...styles.gradeCard, borderColor: gradeColor }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 }}
        >
          <p style={{ ...styles.grade, color: gradeColor }}>{grade}</p>
          <p style={styles.gradeLabel}>Grade</p>
        </motion.div>
        <div style={styles.metricsGrid}>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#7c3aed' }}>{score}%</p>
            <p style={styles.metricLabel}>Recall Accuracy</p>
          </div>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#0f6e56' }}>{results.correct}/{results.total}</p>
            <p style={styles.metricLabel}>Questions Correct</p>
          </div>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#92400e' }}>{formatAvgResponse(results.avgResponseMs)}</p>
            <p style={styles.metricLabel}>Avg Response</p>
          </div>
          <div style={styles.metric}>
            <p style={{ ...styles.metricNum, color: '#1e40af' }}>{tested}/{TECHNIQUE_IDS.length}</p>
            <p style={styles.metricLabel}>Techniques Tested</p>
          </div>
        </div>
      </div>

      <div style={styles.honestyNote}>
        <p style={styles.honestyText}>
          ℹ️ Based on {totalSessions} saved {totalSessions === 1 ? 'session' : 'sessions'} across {tested} of {TECHNIQUE_IDS.length} techniques.
          {untested.length > 0 && ` Try ${untested.join(' and ')} to complete your Study DNA.`}
        </p>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Technique Comparison (average score)</p>
        {summary.map((t) => {
          const b = BIOME_MAP[t.id]
          const pct = t.average ?? 0
          return (
            <div key={t.id} style={{ marginBottom: 14 }}>
              <div style={styles.barRow}>
                <span style={styles.barName}>{b.technique}</span>
                <span style={{ ...styles.barPct, color: t.sessions > 0 ? b.color : '#9ca3af' }}>
                  {t.sessions > 0 ? `${t.average}% · ${t.sessions} ${t.sessions === 1 ? 'session' : 'sessions'}` : 'Not tested yet'}
                </span>
              </div>
              <div style={styles.barBg}>
                <div style={{ ...styles.barFill, width: animated ? `${pct}%` : '0%', background: b.color, transition: 'width 1s ease' }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ ...styles.primaryCard, background: primary.bg, borderColor: primary.border }}>
        <p style={styles.primaryLabel}>{tested > 1 ? 'Strongest Technique So Far' : 'Technique Measured So Far'}</p>
        <p style={{ ...styles.primaryName, color: primary.color }}>{primary.technique}</p>
        <p style={styles.insight}>{primary.insight}</p>
        {secondary && (
          <p style={{ ...styles.insight, marginTop: 8 }}>
            Runner-up: <strong>{secondary.technique}</strong>
          </p>
        )}
      </div>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Recommended Strategy</p>
        <div style={styles.strategyCard}>
          <p style={styles.strategyText}>{primary.strategy}</p>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionLabel}>Study Tips for {s.label}</p>
        {primary.tips.map((tip, i) => (
          <div key={i} style={styles.tip}>
            <span style={{ ...styles.tipNum, color: primary.color }}>{i + 1}</span>
            <p style={styles.tipText}>{tip}</p>
          </div>
        ))}
      </div>

      <div style={styles.bubble}>
        <div style={styles.bubbleHeader}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <span style={styles.bubbleName}>Professor Cortex</span>
          {cortexLoading && <span style={{ fontSize: 11, color: '#7c3aed', marginLeft: 'auto' }}>Analysing...</span>}
        </div>
        <p style={styles.bubbleText}>
          {cortexLoading
            ? 'Professor Cortex is analysing your session...'
            : cortexMessage ?? `You scored ${score}% in ${s.label} using ${current.technique}. ${tested < TECHNIQUE_IDS.length ? 'Try another technique so I can compare how you learn best.' : `Across your sessions, ${primary.technique} is working best for you.`}`
          }
        </p>
      </div>

      <div style={styles.badge}>
        <p style={styles.badgeTitle}>🧬 Study DNA — Session Complete</p>
        <p style={styles.badgeSub}>
          Technique: <strong>{current.technique}</strong> · Subject: <strong>{s.label}</strong> · Score: <strong>{score}%</strong>
        </p>
      </div>

      <div style={styles.btnRow}>
        <button style={styles.btnGhost} onClick={onChangeSubject}>Change subject</button>
        <button style={{ ...styles.btn, flex: 1 }} onClick={onTryAnother}>Try another technique →</button>
      </div>
    </motion.div>
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
  btnRow:       { display: 'flex', gap: 10, marginTop: '1.5rem' },
  btn:          { width: '100%', background: '#534AB7', color: 'white', border: 'none', borderRadius: 12, padding: '13px 24px', fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  btnGhost:     { background: 'transparent', color: '#6b7280', border: '1px solid #e2e8f0', borderRadius: 12, padding: '13px 18px', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' },
}
