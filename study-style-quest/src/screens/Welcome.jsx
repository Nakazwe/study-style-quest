import { useState } from "react"

export default function Welcome({ onNext }) {
  const [started, setStarted] = useState(false)

  function handleStart() {
    setStarted(true)
    setTimeout(() => onNext(), 600)
  }

  return (
    <div style={styles.container}>

      {/* Top badge */}
      <span style={styles.badge}>Academic Comeback</span>

      {/* Icon */}
      <div style={styles.iconWrap}>
        <span style={{ fontSize: 40 }}>🪐</span>
      </div>

      {/* Heading */}
      <h1 style={styles.heading}>Discover how you learn best</h1>
      <p style={styles.sub}>
        Most students study hard but use the wrong techniques.
        Study Style Quest turns proven learning methods into explorable
        worlds — and reveals your personal Study DNA.
      </p>

      {/* Professor Cortex bubble */}
      <div style={styles.bubble}>
        <div style={styles.bubbleHeader}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <span style={styles.bubbleName}>Professor Cortex</span>
        </div>
        <p style={styles.bubbleText}>
          Welcome, student. I've been expecting you. Many before you have
          studied hard and gained little. That changes today. Together we'll
          discover the techniques that unlock <em>your</em> learning
          potential. Ready to begin?
        </p>
      </div>

      {/* CTA button */}
      <button
        style={{ ...styles.btn, ...(started ? styles.btnPressed : {}) }}
        onClick={handleStart}
      >
        Begin the quest →
      </button>

    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    maxWidth: 480,
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
  },
  badge: {
    background: "#EEEDFE",
    color: "#3C3489",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 14px",
    borderRadius: 20,
    marginBottom: 20,
    display: "inline-block",
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "#EEEDFE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
  },
  heading: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1a1a2e",
    margin: "0 0 0.75rem",
  },
  sub: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
  },
  bubble: {
    background: "#EEEDFE",
    border: "1px solid #AFA9EC",
    borderRadius: "0 16px 16px 16px",
    padding: "1rem 1.25rem",
    textAlign: "left",
    marginBottom: "1.5rem",
    width: "100%",
  },
  bubbleHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  bubbleName: {
    fontSize: 12,
    fontWeight: 600,
    color: "#534AB7",
  },
  bubbleText: {
    fontSize: 14,
    color: "#26215C",
    lineHeight: 1.6,
    margin: 0,
  },
  btn: {
    background: "#534AB7",
    color: "white",
    border: "none",
    borderRadius: 10,
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  btnPressed: {
    background: "#3C3489",
    transform: "scale(0.97)",
  },
}
