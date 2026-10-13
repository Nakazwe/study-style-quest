// Fisher-Yates shuffle. Returns a new array; never mutates the input.
export function shuffle(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('shuffle expects an array')
  }

  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
