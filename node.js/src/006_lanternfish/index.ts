import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt'),
  ageReset = 6,
  newFishAge = 8

;(function main() {
  partOne(80)
  partTwo(256)
})()

function partOne(symDays: number) {
  const fish = fs.readFileSync(fn, { encoding: 'utf-8' }).split(',').map(Number)

  for (let day = 1; day <= symDays; day++) {
    for (const i in fish) {
      if (fish[i]) fish[i]--
      else {
        fish.push(newFishAge)
        fish[i] = ageReset
      }
    }
  }

  console.log(`[P1] ${fish.length}`)
}

function partTwo(symDays: number) {
  const fish = fs.readFileSync(fn, { encoding: 'utf-8' }).split(',').map(Number)

  const ocean: number[] = Array(newFishAge + 1).fill(0)

  for (const age of fish) ocean[age]++

  for (let day = 1; day <= symDays; day++) {
    const reproducing = ocean.shift()
    ocean[ageReset] += reproducing
    ocean.push(reproducing)
  }

  console.log(`[P2] ${ocean.reduce((acc, curr) => acc + curr, 0)}`)
}
