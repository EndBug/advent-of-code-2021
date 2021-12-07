import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  const input = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .split(',')
    .map(Number)

  let pos: number, cost: number

  for (let i = 0; i < Math.max(...input); i++) {
    const currCost = input.reduce((a, c) => a + Math.abs(c - i), 0)
    if (pos === undefined || currCost < cost) {
      pos = i
      cost = currCost
    }
  }

  console.log(`[P1] ${pos} ${cost}`)
}

function partTwo() {
  const input = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .split(',')
    .map(Number)

  let pos: number, cost: number

  for (let i = 0; i < Math.max(...input); i++) {
    const currCost = input.reduce((a, c) => {
      const dist = Math.abs(c - i)
      let accCost = 0
      for (let i = 1; i <= dist; i++) accCost += i
      return a + accCost
    }, 0)

    if (pos === undefined || currCost < cost) {
      pos = i
      cost = currCost
    }
  }

  console.log(`[P2] ${pos} ${cost}`)
}
