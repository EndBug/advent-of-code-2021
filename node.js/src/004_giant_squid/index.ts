import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

type board = number[][]
interface System {
  ext: number[]
  boards: board[]
}

;(function main() {
  const sys = load()
  partOne(sys)
  partTwo(sys)
})()

function load(): System {
  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  return {
    ext: file
      .split('\n')[0]
      .split(',')
      .map((e) => parseInt(e)),
    boards: file
      .split('\n')
      .slice(1)
      .map((s) => s.trim())
      .join('\n')
      .trim()
      .split('\n\n')
      .map((bs) =>
        bs
          .trim()
          .split('\n')
          .map((bl) =>
            bl
              .trim()
              .split(' ')
              .filter((s) => s.trim())
              .map((e) => parseInt(e))
          )
      )
  }
}

function partOne(sys: System) {
  const [winner, extN] = getWinningBoard(sys)
  console.log(`[P1] ${getBoardScore(winner, sys.ext, extN)}`)
}

function partTwo(sys: System) {
  let pool = [...sys.boards]
  let lastWinner: board,
    extN = 0

  do {
    ;[lastWinner, extN] = getWinningBoard({ boards: pool, ext: sys.ext })
    pool = pool.filter((b) =>
      b.some((r, i) => r.some((v, j) => v != lastWinner[i][j]))
    )
  } while (pool.length > 0)

  console.log(`[P2] ${getBoardScore(lastWinner, sys.ext, extN)}`)
}

function getWinningBoard(sys: System): [board, number] {
  let nExt = 0
  let winner

  while (!winner && nExt < sys.ext.length) {
    nExt++
    winner = sys.boards.find((b) => isWinningBoard(b, sys.ext, nExt))
  }

  return [winner, nExt]
}

function isWinningBoard(board: board, ext: number[], extN: number) {
  for (let i = 0; i < board.length; i++) {
    let valid = true
    for (let j = 0; j < board.length && valid; j++) {
      const fi = ext.indexOf(board[i][j])
      valid = fi >= 0 && fi < extN
    }

    if (valid) return true

    valid = true
    for (let j = 0; j < board.length && valid; j++) {
      const fi = ext.indexOf(board[j][i])
      valid = fi >= 0 && fi < extN
    }
    if (valid) return true
  }
  return false
}

function getBoardScore(board: board, ext: number[], extN: number) {
  const slice = ext.slice(0, extN)

  return (
    board.reduce(
      (rowAcc, r) =>
        rowAcc +
        r.reduce((a, curr) => a + (slice.includes(curr) ? 0 : curr), 0),
      0
    ) * ext[extN - 1]
  )
}
