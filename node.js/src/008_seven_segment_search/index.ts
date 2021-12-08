import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

const uniqueSegments = {
    1: 2,
    4: 4,
    7: 3,
    8: 7
  },
  numberKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const,
  segmentKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const
type N = typeof numberKeys[number]
type S = typeof segmentKeys[number]
;(function main() {
  partOne()
  partTwo()
})()

interface Display {
  input: string[]
  output: string[]
}

function partOne() {
  const displays = fs
      .readFileSync(fn, { encoding: 'utf-8' })
      .split('\n')
      .filter((e) => !!e)
      .map((line) => {
        const [input, output] = line.split('|').map((s) => s.trim().split(' '))

        return {
          input,
          output
        } as Display
      }),
    count = displays.reduce(
      (acc, display) =>
        acc +
        display.output.reduce(
          (a, pattern) =>
            a +
            (Object.values(uniqueSegments).includes(pattern.length) ? 1 : 0),
          0
        ),
      0
    )

  console.log(`[P1] ${count}`)
}

function partTwo() {
  const displays = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .split('\n')
    .filter((e) => !!e)
    .map((line) => {
      const [input, output] = line.split('|').map((s) => s.trim().split(' '))

      return {
        input,
        output
      } as Display
    })

  const res = displays.reduce((acc, display) => {
    const { input, output } = display,
      n: Partial<Record<N, string>> = {},
      s: Partial<Record<S, string>> = {}

    for (const num in uniqueSegments)
      n[num] = input.find((s) => s.length == uniqueSegments[num])

    s.A = subtract(n[7], n[1])
    n[6] = input.find(
      (s) => s.length == n[8].length - 1 && n[1].includes(subtract(n[8], s))
    )
    s.C = subtract(n[8], n[6])
    n[0] = input.find(
      (s) =>
        s.length == n[8].length - 1 &&
        subtract(n[4], n[1]).includes(subtract(n[8], s))
    )
    s.D = subtract(n[8], n[0])
    s.B = subtract(n[4], n[1], s.D)
    n[9] = input.find(
      (s) => s.length == n[8].length - 1 && !match(s, n[6]) && !match(s, n[0])
    )
    s.E = subtract(n[8], n[9])
    s.G = subtract(n[8], n[4], s.A, s.E)
    s.F = subtract(n[8], s.A, s.B, s.C, s.D, s.E, s.G)
    n[2] = add(s.A, s.C, s.D, s.E, s.G)
    n[3] = add(s.A, s.C, s.D, s.F, s.G)
    n[5] = add(s.A, s.B, s.D, s.F, s.G)

    return (
      acc +
      Number(
        output
          .map((s) => String(Object.keys(n).find((k) => match(n[k], s))))
          .join('')
      )
    )
  }, 0)

  console.log(`[P2] ${res}`)
}

function add(to: string, ...strs: string[]) {
  return [...to, ...strs.flat()]
    .filter((s, i, arr) => arr.findIndex((ss) => ss == s) == i)
    .join('')
}

function subtract(from: string, ...strs: string[]) {
  return from
    .split('')
    .filter((char) => strs.every((str) => !str.includes(char)))
    .join('')
}

function match(a: string, b: string) {
  return a.length == b.length && [...a].every((char) => b.includes(char))
}
