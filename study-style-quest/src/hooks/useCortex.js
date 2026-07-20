import { useState } from 'react'

export default function useCortex() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError]     = useState(null)

  async function ask(results) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/cortex', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(results),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Professor Cortex is unavailable right now.')
        setLoading(false)
        return
      }

      setMessage(data.message)
    } catch (err) {
      setError('Could not reach Professor Cortex. Check your connection.')
    }

    setLoading(false)
  }

  return { ask, message, loading, error }
}
