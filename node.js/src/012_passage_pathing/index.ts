import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt'),
  START = 'start',
  END = 'end'

;(function main() {
  const nodes: Record<string, string[]> = {}

  fs.readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .forEach((line) => {
      const [a, b] = line.split('-')
      nodes[a] = nodes[a] ? [...nodes[a], b] : [b]
      nodes[b] = nodes[b] ? [...nodes[b], a] : [a]
    })

  console.log(`[P1] ${findPaths(nodes, [START], false).length}`)
  console.log(`[P2] ${findPaths(nodes, [START], true).length}`)
})()

function findPaths(
  nodes: Record<string, string[]>,
  current: string[],
  allowDouble: boolean
): string[][] {
  const lastNode = current[current.length - 1]
  let res = []

  if (lastNode == END) return [current]

  nodes[lastNode]
    .filter((cave) => {
      const canGoTwice = !Object.keys(nodes)
        .filter((n) => n.toUpperCase() != n)
        .some((n) => current.filter((c) => c == n).length > 1)

      return (
        cave != START &&
        (cave.toUpperCase() == cave ||
          (current.includes(cave) ? allowDouble && canGoTwice : true))
      )
    })
    .forEach((cave) => {
      res = [...res, ...findPaths(nodes, [...current, cave], allowDouble)]
    })

  return res
}
