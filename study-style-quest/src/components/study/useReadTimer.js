import { useState, useEffect, useRef } from 'react'

// Counts down while `active` is true and calls onExpire once when it reaches zero.
export default function useReadTimer(active, seconds, onExpire) {
  const [remaining, setRemaining] = useState(seconds)
  const expireRef = useRef(onExpire)

  useEffect(() => {
    expireRef.current = onExpire
  })

  useEffect(() => {
    if (!active) return

    const endsAt = Date.now() + seconds * 1000
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        clearInterval(id)
        expireRef.current?.()
      }
    }, 250)

    return () => clearInterval(id)
  }, [active, seconds])

  return remaining
}
