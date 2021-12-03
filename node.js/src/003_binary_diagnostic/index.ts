import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  partOne()
  partTwo()
})()

function partOne() {
  const file = fs.readFileSync(fn, { encoding: 'utf-8' }),
    input = file.split('\n').filter((e) => !!e.trim()),
    nBits = input[0].length

  let gammaBin = ''
  for (let i = 0; i < nBits; i++) {
    gammaBin +=
      input.reduce((acc, curr) => acc + (parseInt(curr[i]) ? 1 : -1), 0) >= 0
        ? '1'
        : '0'
  }

  const epsilonBin = gammaBin
    .split('')
    .map((b) => (b == '0' ? '1' : '0'))
    .join('')

  const gamma = parseInt(gammaBin, 2),
    epsilon = parseInt(epsilonBin, 2)

  console.log(
    `[P1] gamma: ${gamma}, epsilon: ${epsilon}, gamma*epsilon: ${
      gamma * epsilon
    }`
  )
}

function partTwo() {
  const file = fs.readFileSync(fn, { encoding: 'utf-8' }),
    input = file.split('\n').filter((e) => !!e.trim()),
    nBits = input[0].length

  let oxyValues = [...input],
    i = 0
  while (oxyValues.length > 1 && i < nBits) {
    const mostCommon =
      oxyValues.reduce((acc, curr) => acc + (parseInt(curr[i]) ? 1 : -1), 0) >=
      0
        ? '1'
        : '0'
    oxyValues = oxyValues.filter((e) => e[i] == mostCommon)
    i++
  }

  let co2Values = [...input]
  i = 0
  while (co2Values.length > 1 && i < nBits) {
    const leastCommon =
      co2Values.reduce((acc, curr) => acc + (parseInt(curr[i]) ? 1 : -1), 0) >=
      0
        ? '0'
        : '1'
    co2Values = co2Values.filter((e) => e[i] == leastCommon)
    i++
  }

  const oxy = parseInt(oxyValues[0], 2),
    co2 = parseInt(co2Values[0], 2)

  console.log(`[P2] oxy: ${oxy}, co2: ${co2}, oxy*co2:${oxy * co2}`)
}
