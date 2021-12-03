import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

type command = 'forward' | 'down' | 'up'
;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  let x = 0,
    depth = 0

  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  file
    .split('\n')
    .filter((e) => !!e.trim())
    .forEach((line) => {
      const command = line.split(' ')[0] as command,
        n = parseInt(line.split(' ')[1])

      if (command == 'forward') x += n
      else if (command == 'down') depth += n
      else if (command == 'up') depth -= n
    })

  console.log(`[P1] x: ${x}, depth: ${depth}, x*depth: ${x * depth}`)
}

function partTwo() {
  let x = 0,
    depth = 0,
    aim = 0

  const file = fs.readFileSync(fn, { encoding: 'utf-8' })

  file
    .split('\n')
    .filter((e) => !!e.trim())
    .forEach((line) => {
      const command = line.split(' ')[0] as command,
        n = parseInt(line.split(' ')[1])

      if (command == 'forward') {
        x += n
        depth += aim * n
      } else if (command == 'down') aim += n
      else if (command == 'up') aim -= n
    })

  console.log(`[P2] x: ${x}, depth: ${depth}, x*depth: ${x * depth}`)
}
