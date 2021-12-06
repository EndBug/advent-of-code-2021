import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  const mat: number[][] = [].fill([])
  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  file
    .split('\n')
    .filter((e) => !!e.trim())
    .forEach((line) => {
      let [start, end] = line
        .split(' -> ')
        .map((p) => p.split(',').map((e) => parseInt(e)))
        .map(([x, y]) => ({ x, y }))

      if (start.y == end.y) {
        if (start.x > end.x) {
          const tmp = start
          start = end
          end = tmp
        }

        const y = start.y
        if (!mat[y]) mat[y] = []

        for (let x = start.x; x <= end.x; x++) mat[y][x] = (mat[y][x] || 0) + 1
      }

      if (start.x == end.x) {
        if (start.y > end.y) {
          const tmp = start
          start = end
          end = tmp
        }

        const x = start.x

        for (let y = start.y; y <= end.y; y++) {
          if (!mat[y]) mat[y] = []
          mat[y][x] = (mat[y][x] || 0) + 1
        }
      }
    })

  const acc = mat.reduce(
    (rowAcc, row) =>
      rowAcc + row.reduce((colAcc, value) => colAcc + (value >= 2 ? 1 : 0), 0),
    0
  )

  for (let i = 0; i < mat.length; i++) {
    if (mat[i] === undefined) mat[i] = []
  }

  // displayMat(mat)

  console.log(`[P1] ${acc}`)
}

function partTwo() {
  const mat: number[][] = [].fill([])
  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  file
    .split('\n')
    .filter((e) => !!e.trim())
    .forEach((line) => {
      const [start, end] = line
        .split(' -> ')
        .map((p) => p.split(',').map((e) => parseInt(e)))
        .map(([x, y]) => ({ x, y }))

      let y = start.y,
        x = start.x
      while (
        y >= Math.min(start.y, end.y) &&
        y <= Math.max(start.y, end.y) &&
        x >= Math.min(start.x, end.x) &&
        x <= Math.max(start.x, end.x)
      ) {
        if (!mat[y]) mat[y] = []
        mat[y][x] = (mat[y][x] || 0) + 1

        if (start.y < end.y) y++
        else if (start.y > end.y) y--

        if (start.x < end.x) x++
        else if (start.x > end.x) x--

        if (start.x == end.x && start.y == end.y) break
      }
    })

  const acc = mat.reduce(
    (rowAcc, row) =>
      rowAcc + row.reduce((colAcc, value) => colAcc + (value >= 2 ? 1 : 0), 0),
    0
  )

  for (let i = 0; i < mat.length; i++) {
    if (mat[i] === undefined) mat[i] = []
  }

  displayMat(mat)

  console.log(`[P2] ${acc}`)
}

function displayMat(mat: number[][]) {
  let nCol = 0
  mat.forEach((r) => {
    if (nCol < r.length) nCol = r.length
  })

  console.log(
    mat
      .map((row) => {
        let res = ''
        for (let i = 0; i < nCol; i++) {
          res += row[i] || '.'
        }
        return res
      })
      .join('\n')
  )
}
