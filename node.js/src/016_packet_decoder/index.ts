import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')
const VERSION_BITS = 3,
  TYPE_BITS = 3,
  LITERAL_GROUP_LENGTH = 5,
  LENGTH_TYPE_BITS = 1,
  LENGTH_TYPE_ARG_BITS = {
    0: 15,
    1: 11
  } as const,
  TYPES = {
    0: 'sum',
    1: 'product',
    2: 'minimum',
    3: 'maximum',
    4: 'literal',
    5: 'greater than',
    6: 'less than',
    7: 'equal'
  } as const

;(function main() {
  const hexPacket = fs.readFileSync(fn, { encoding: 'utf-8' }).trim(),
    binPacket = hexPacket
      .split('')
      .map((char) => parseInt(char, 16).toString(2).padStart(4, '0'))
      .join(''),
    [packet] = parsePacket(binPacket)

  console.log(`[P1] ${accVersions(packet)}`)
  console.log(`[P2] ${operate(packet)}`)
})()

interface Packet {
  version: number
  type: typeof TYPES[keyof typeof TYPES]
  literalValue?: number
  children?: Packet[]
}

function parsePacket(packet: string): [Packet, string] {
  const parsed = {} as Packet
  let i = 0

  parsed.version = parseInt(packet.slice(i, i + VERSION_BITS), 2)
  i += VERSION_BITS

  parsed.type = TYPES[parseInt(packet.slice(i, i + TYPE_BITS), 2)]
  i += TYPE_BITS

  if (parsed.type == 'literal') {
    const [literal, rest] = parseLiteralValue(packet.slice(i))
    parsed.literalValue = literal
    return [parsed, rest]
  } else {
    parsed.children = []

    const lenghtType = parseInt(packet.slice(i, i + LENGTH_TYPE_BITS), 2)
    i += LENGTH_TYPE_BITS

    if (lenghtType == 0) {
      const totalSubLength = parseInt(
        packet.slice(i, i + LENGTH_TYPE_ARG_BITS[lenghtType]),
        2
      )
      i += LENGTH_TYPE_ARG_BITS[lenghtType]

      let parsedLength = 0
      while (parsedLength < totalSubLength) {
        const [newChild, remaining] = parsePacket(
          packet.slice(i, i + totalSubLength - parsedLength)
        )
        parsed.children.push(newChild)

        const bitsParsedNow = totalSubLength - parsedLength - remaining.length
        parsedLength += bitsParsedNow
        i += bitsParsedNow
      }
    } else {
      const nSubPackets = parseInt(
        packet.slice(i, i + LENGTH_TYPE_ARG_BITS[lenghtType]),
        2
      )
      i += LENGTH_TYPE_ARG_BITS[lenghtType]

      for (let s = 0; s < nSubPackets; s++) {
        const [newChild, remaining] = parsePacket(packet.slice(i))
        parsed.children.push(newChild)
        i += packet.slice(i).length - remaining.length
      }
    }

    return [parsed, packet.slice(i)]
  }
}

function parseLiteralValue(str: string): [number, string] {
  let valueBits = ''

  for (let i = 0; i < str.length; i += LITERAL_GROUP_LENGTH) {
    valueBits += str.slice(i + 1, i + LITERAL_GROUP_LENGTH)
    if (parseInt(str[i]) == 0) break
  }

  return [
    parseInt(valueBits, 2),
    str.slice(
      (valueBits.length / (LITERAL_GROUP_LENGTH - 1)) * LITERAL_GROUP_LENGTH
    )
  ]
}

function accVersions(packet: Packet) {
  let acc = packet.version

  packet.children?.forEach((child) => {
    acc += accVersions(child)
  })

  return acc
}

function operate(packet: Packet) {
  switch (packet.type) {
    case 'sum':
      return packet.children.reduce((acc, curr) => acc + operate(curr), 0)

    case 'product':
      return packet.children.reduce((acc, curr) => acc * operate(curr), 1)

    case 'minimum':
      return Math.min(...packet.children.map(operate))

    case 'maximum':
      return Math.max(...packet.children.map(operate))

    case 'literal':
      return packet.literalValue

    case 'greater than': {
      const [a, b] = packet.children.map(operate)
      return a > b ? 1 : 0
    }

    case 'less than': {
      const [a, b] = packet.children.map(operate)
      return a < b ? 1 : 0
    }

    case 'equal': {
      const [a, b] = packet.children.map(operate)
      return a == b ? 1 : 0
    }

    default:
      throw `Unknown type ${packet.type}`
  }
}
