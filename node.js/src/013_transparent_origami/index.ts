import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  const [dots, folds] = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n\n')

  let map: boolean[][] = [],
    maxX = 0
  dots.split('\n').forEach((d) => {
    const [x, y] = d.split(',').map(Number)
    if (!map[y]) map[y] = []
    map[y][x] = true
    if (maxX < x) maxX = x
  })

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j <= maxX; j++) {
      if (!map[i]) map[i] = []
      if (!map[i][j]) map[i][j] = false
    }
  }

  map = fold(folds.split('\n').slice(0, 1), map)

  const p1 = map.reduce(
    (acc, row) => acc + row.reduce((a, c) => a + (c ? 1 : 0), 0),
    0
  )

  map = fold(folds.split('\n').slice(1), map)

  console.log(`[P1] ${p1}`)
  console.log(`[P2]:\n${displayMap(map)}`)
})()

function fold(instructions: string[], map: boolean[][]) {
  instructions.forEach((instr) => {
    const [axis, coord] = instr.split(' ')[2].split('=')
    const line = Number(coord)

    if (axis == 'x') {
      // Fold along a vertical line at index `line`
      for (let i = 0; i < map.length; i++) {
        for (let j = 1; line - j >= 0 && line + j < map[i].length; j++) {
          map[i][line - j] ||= map[i][line + j]
        }
      }

      map = map.map((row) => row.slice(0, line))
    } else {
      // Fold along a horizontal line at index `line`
      for (let i = 1; line - i >= 0 && line + i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++)
          map[line - i][j] ||= map[line + i][j]
      }
      map = map.slice(0, line)
    }
  })

  return map
}

function displayMap(map: boolean[][]) {
  return map.map((row) => row.map((v) => (v ? '#' : '.')).join('')).join('\n')
}
