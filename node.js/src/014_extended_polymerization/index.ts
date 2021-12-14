import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  console.log(`[P1] ${solve(10)}`)
  console.log(`[P2] ${solve(40)}`)
})()

function solve(steps: number) {
  const [template, instructions] = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n\n')

  const patterns: Record<string, string> = {}
  instructions.split('\n').forEach((line) => {
    const [pair, insert] = line.split(' -> ')
    patterns[pair] = insert
  })

  let pairs: Record<string, number> = {}
  const counts: typeof pairs = {}

  template.split('').forEach((char, i, arr) => {
    const next = arr[i + 1]
    if (next) {
      pairs[char + next] = (pairs[char + next] || 0) + 1
    }
    counts[char] = (counts[char] || 0) + 1
  })

  for (; steps > 0; steps--) {
    const newPairs: typeof pairs = {}

    for (const p in pairs) {
      const insert = patterns[p]
      if (insert) {
        const [a, b] = p
        newPairs[a + insert] = (newPairs[a + insert] || 0) + pairs[p]
        newPairs[insert + b] = (newPairs[insert + b] || 0) + pairs[p]
        counts[insert] = (counts[insert] || 0) + pairs[p]
      } else newPairs[p] = pairs[p]
    }

    pairs = newPairs
  }

  const res =
    Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))

  return res
}
