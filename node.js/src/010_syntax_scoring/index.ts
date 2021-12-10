import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

const chars = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
}

;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  const points = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  }

  const score = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .split('\n')
    .map((s) => s.trim())
    .map(getIllegal)
    .map((c) => points[c] || 0)
    .reduce((a, b) => a + b, 0)

  console.log(`[P1] ${score}`)
}

function partTwo() {
  const points = {
      ')': 1,
      ']': 2,
      '}': 3,
      '>': 4
    },
    f = 5

  const scores: number[] = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .split('\n')
    .map((s) => s.trim())
    .filter((e) => !getIllegal(e))
    .map(getCompletion)
    .map((str) =>
      str
        .split('')
        .map((c) => points[c] || 0)
        .reduce((acc, curr) => acc * f + curr, 0)
    )

  const score = scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]

  console.log(`[P2] ${score}`)
}

function getIllegal(str: string) {
  const stack: string[] = []

  for (const c of str) {
    if (Object.keys(chars).includes(c)) stack.push(c)
    else {
      const tmp = stack.pop()
      if (chars[tmp] != c) return c
    }
  }
}

function getCompletion(str: string) {
  const stack: string[] = []
  let res = ''

  for (const c of str) {
    if (Object.keys(chars).includes(c)) stack.push(c)
    else stack.pop()
  }

  stack.forEach((c) => {
    res = chars[c] + res
  })

  return res
}
