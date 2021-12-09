import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  const map = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((s) => s.split('').map(Number))

  let risk = 0

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const valid =
        (i <= 0 || map[i - 1][j] > map[i][j]) &&
        (i >= map.length - 1 || map[i + 1][j] > map[i][j]) &&
        (j <= 0 || map[i][j - 1] > map[i][j]) &&
        (j >= map[i].length - 1 || map[i][j + 1] > map[i][j])

      if (valid) risk += 1 + map[i][j]
    }
  }

  console.log(`[P1] ${risk}`)
}

function partTwo() {
  const map = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((s) => s.split('').map(Number))

  let threeLargestBasins: number[] = []

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const isMinimum =
        (i <= 0 || map[i - 1][j] > map[i][j]) &&
        (i >= map.length - 1 || map[i + 1][j] > map[i][j]) &&
        (j <= 0 || map[i][j - 1] > map[i][j]) &&
        (j >= map[i].length - 1 || map[i][j + 1] > map[i][j])

      if (isMinimum) {
        const [size] = findBasinSize(map, i, j, [])
        threeLargestBasins = [...threeLargestBasins, size]
          .sort((a, b) => b - a)
          .slice(0, 3)
      }
    }
  }

  const res = threeLargestBasins.reduce((a, b) => a * b, 1)

  console.log(`[P2] ${res}`)
}

function findBasinSize(
  map: number[][],
  i: number,
  j: number,
  alreadyChecked: [number, number][]
): [number, [number, number][]] {
  if (alreadyChecked.some((v) => v[0] == i && v[1] == j))
    return [0, alreadyChecked]

  let res = 1,
    tmpRes

  alreadyChecked.push([i, j])

  if (i > 0 && map[i - 1][j] > map[i][j] && map[i - 1][j] < 9) {
    ;[tmpRes, alreadyChecked] = findBasinSize(map, i - 1, j, alreadyChecked)
    res += tmpRes
  }
  if (i < map.length - 1 && map[i + 1][j] > map[i][j] && map[i + 1][j] < 9) {
    ;[tmpRes, alreadyChecked] = findBasinSize(map, i + 1, j, alreadyChecked)
    res += tmpRes
  }
  if (j > 0 && map[i][j - 1] > map[i][j] && map[i][j - 1] < 9) {
    ;[tmpRes, alreadyChecked] = findBasinSize(map, i, j - 1, alreadyChecked)
    res += tmpRes
  }
  if (j < map[i].length - 1 && map[i][j + 1] > map[i][j] && map[i][j + 1] < 9) {
    ;[tmpRes, alreadyChecked] = findBasinSize(map, i, j + 1, alreadyChecked)
    res += tmpRes
  }
  return [res, alreadyChecked]
}
