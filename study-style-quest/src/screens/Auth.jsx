import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ onAuth }) {
const [mode, setMode] = useState('signup')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      onAuth(data.user)
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      onAuth(data.user)
    }

    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.iconWrap}>
        <span style={{ fontSize: 36 }}>🧬</span>
      </div>
      <h1 style={styles.heading}>Study Style Quest</h1>
      <p style={styles.sub}>
        {mode === 'signup'
  ? 'Create your account to begin discovering your Study DNA.'
  : 'Welcome back. Sign in to continue your learning journey.'}
      </p>
      <div style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            ...styles.btn,
            opacity: loading || !email || !password ? 0.5 : 1,
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
          style={styles.switchBtn}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    maxWidth: 400,
    margin: '0 auto',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: '#EEEDFE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  heading: {
    margin: '0 0 8px',
    fontSize: 22,
    fontWeight: 600,
    color: '#1a1a2e',
    textAlign: 'center',
  },
  sub: {
    margin: '0 0 2rem',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  form: {
    width: '100%',
    display: 'grid',
    gap: 16,
  },
  field: {
    display: 'grid',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 14,
    color: '#1a1a2e',
    outline: 'none',
    background: '#ffffff',
  },
  error: {
    margin: 0,
    fontSize: 13,
    color: '#dc2626',
    background: '#fee2e2',
    padding: '8px 12px',
    borderRadius: 8,
  },
  btn: {
    background: '#534AB7',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '13px 24px',
    fontSize: 15,
    fontWeight: 500,
  },
  switchBtn: {
    background: 'transparent',
    border: 'none',
    color: '#7c3aed',
    fontSize: 13,
    cursor: 'pointer',
    textAlign: 'center',
  },
}
