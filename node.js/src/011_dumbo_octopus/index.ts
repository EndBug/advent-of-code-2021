import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  const grid = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((l) => l.trim().split('').map(Number))

  const [flashes, s] = count(grid, 100)

  console.log(`[P1] ${flashes}`)
  console.log(`[P2] ${s}`)
})()

function count(grid: number[][], steps: number) {
  let flashes = 0,
    s = steps,
    newFlashes: number,
    firstStep: number

  while (s > 0 || !firstStep) {
    grid = grid.map((r) => r.map((v) => v + 1))
    ;[grid, newFlashes] = flash(grid)

    if (s > 0) flashes += newFlashes

    if (newFlashes == grid.length * grid[0].length) firstStep = steps - s + 1
    grid = grid.map((r) => r.map((v) => (v > 9 ? 0 : v)))

    s--
  }

  return [flashes, firstStep]
}

function flash(grid: number[][]): [number[][], number] {
  const flashed: boolean[][] = Array(grid.length)
  for (let i = 0; i < grid.length; i++)
    flashed[i] = Array(grid[i].length).fill(false)

  while (grid.some((r, i) => r.some((v, j) => v > 9 && !flashed[i][j]))) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] > 9 && !flashed[i][j]) {
          flashed[i][j] = true
          for (let ii = i - 1; ii <= i + 1; ii++) {
            for (let jj = j - 1; jj <= j + 1; jj++) {
              if (
                ii >= 0 &&
                ii < grid.length &&
                jj >= 0 &&
                jj < grid[i].length
              ) {
                grid[ii][jj]++
              }
            }
          }
        }
      }
    }
  }

  return [
    grid,
    flashed.reduce(
      (acc, row) => acc + row.reduce((a, c) => a + (c ? 1 : 0), 0),
      0
    )
  ]
}
