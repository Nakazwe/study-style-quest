function ProgressBar({ value = 0, label = 'Progress' }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ color: '#64748b' }}>{value}%</span>
      </div>
      <div
        style={{
          height: '10px',
          borderRadius: '999px',
          background: '#e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #8b5cf6, #22c55e)',
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
