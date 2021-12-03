import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  const count = file.split('\n').reduce((acc, currStr, i, arr) => {
    const curr = parseInt(currStr),
      next = parseInt(arr[i + 1])

    return next && next > curr ? acc + 1 : acc
  }, 0)

  console.log(`[P1] ${count}`)
}

function partTwo() {
  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  const count = file
    .split('\n')
    .map((a, i, arr) => {
      const b = parseInt(arr[i + 1]),
        c = parseInt(arr[i + 2])
      return b && c ? parseInt(a) + b + c : undefined
    })
    .filter((e) => e !== undefined)
    .reduce((acc, curr, i, arr) => {
      const next = arr[i + 1]

      return next && next > curr ? acc + 1 : acc
    }, 0)

  console.log(`[P2] ${count}`)
}
