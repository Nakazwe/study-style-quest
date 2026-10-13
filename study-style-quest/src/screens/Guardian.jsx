import { BIOME_MAP } from '../data/biomes'
import { getLesson } from '../data/lessons'
import MindMapStudy from '../components/study/MindMapStudy'
import RecallStudy from '../components/study/RecallStudy'
import FeynmanStudy from '../components/study/FeynmanStudy'

const STUDY_COMPONENTS = {
  mindmap: MindMapStudy,
  recall:  RecallStudy,
  feynman: FeynmanStudy,
}

export default function Guardian({ onNext, biome = 'mindmap', subject = 'maths', profile }) {
  const form   = profile?.form ?? 'Form 1'
  const config = BIOME_MAP[biome] ?? BIOME_MAP.mindmap
  const lesson = getLesson(subject, form)
  const Study  = STUDY_COMPONENTS[config.id]

  function handleComplete(studyResult) {
    if (!studyResult || !Number.isFinite(studyResult.score)) return
    onNext({ ...studyResult, technique: config.id })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ ...styles.avatar, background: config.bg }}>{config.guardianEmoji}</div>
        <div>
          <p style={styles.guardianName}>{config.guardian}</p>
          <p style={styles.biomeName}>{config.emoji} {config.name}</p>
        </div>
        <span style={{ ...styles.techTag, background: config.tagBg, color: config.tagColor }}>{config.technique}</span>
      </div>

      <div style={{ ...styles.bubble, background: config.bg, borderColor: config.border }}>
        <p style={styles.bubbleText}>{config.intro}</p>
      </div>

      {/* Guard: never fall back to another subject's lesson silently. */}
      {lesson && Study ? (
        <Study key={`${config.id}-${subject}-${form}`} lesson={lesson} onComplete={handleComplete} />
      ) : (
        <p style={styles.bubbleText}>There is no {form} lesson for this subject yet.</p>
      )}
    </div>
  )
}

const styles = {
  container:    { maxWidth: 600, margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem', textAlign: 'left' },
  header:       { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem', flexWrap: 'wrap' },
  avatar:       { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 },
  guardianName: { margin: '0 0 2px', fontSize: 15, fontWeight: 600, color: '#1a1a2e' },
  biomeName:    { margin: 0, fontSize: 12, color: '#6b7280' },
  techTag:      { marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20 },
  bubble:       { border: '1px solid', borderRadius: '0 16px 16px 16px', padding: '1rem 1.25rem', marginBottom: '1.25rem' },
  bubbleText:   { margin: 0, fontSize: 14, color: '#26215C', lineHeight: 1.7 },
}
