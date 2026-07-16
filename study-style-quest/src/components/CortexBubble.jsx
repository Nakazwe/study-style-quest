function CortexBubble({ title, subtitle, accent = '#7c3aed' }) {
  return (
    <article
      style={{
        border: `1px solid ${accent}33`,
        borderRadius: '20px',
        padding: '1rem 1.25rem',
        background: `linear-gradient(135deg, ${accent}18, #ffffff)`,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: accent }}>
        Cortex capsule
      </p>
      <h3 style={{ margin: '0.35rem 0 0.2rem', fontSize: '1.1rem' }}>{title}</h3>
      <p style={{ margin: 0, color: '#475569', lineHeight: 1.5 }}>{subtitle}</p>
    </article>
  )
}

export default CortexBubble
