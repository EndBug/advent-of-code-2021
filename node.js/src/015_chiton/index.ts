import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

type Grid<T> = Array<Array<T>>
type Node = [number, number]
;(function main() {
  const grid = fs
    .readFileSync(fn, { encoding: 'utf-8' })
    .trim()
    .split('\n')
    .map((row) => row.split('').map(Number))

  const extendedGrid: Grid<number> = [...grid.map((r) => [...r])],
    extFactor = 5

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      for (let k = 1; k < extFactor; k++) {
        extendedGrid[i][j + grid[i].length * k] =
          (extendedGrid[i][j + grid[i].length * (k - 1)] + 1) % 10 || 1
      }
    }
  }

  for (let k = 1; k < extFactor; k++) {
    for (let i = 0; i < grid.length; i++) {
      extendedGrid[i + grid.length * k] = []
      for (let j = 0; j < extendedGrid[i].length; j++) {
        extendedGrid[i + grid.length * k][j] =
          (extendedGrid[i + grid.length * (k - 1)][j] + 1) % 10 || 1
      }
    }
  }

  grid[0][0] = 0
  console.log(`[P1] ${getRisk(grid)}`)

  extendedGrid[0][0] = 0
  console.log(`[P2] ${getRisk(extendedGrid)}`)
})()

function getRisk(grid: Grid<number>) {
  const endNode: Node = [grid.length - 1, grid[0].length - 1]

  const distances: Grid<number> = grid.map(() => [])
  distances[endNode[0]][endNode[1]] = Infinity
  distances[1][0] = grid[1][0]
  distances[0][1] = grid[0][1]

  const parents: Grid<Node> = grid.map(() => [])
  parents[endNode[0]][endNode[1]] = null
  parents[1][0] = [0, 0]
  parents[0][1] = [0, 0]

  const visited: Grid<boolean> = grid.map((row) => row.map(() => false))

  let node = shortestDistanceNode(distances, visited)

  while (node) {
    const [i, j] = node,
      distance = distances[i][j],
      children = getNeighbours(grid, node).filter(([i, j]) => i || j)

    for (const [ci, cj] of children) {
      const newDistance = distance + grid[ci][cj]

      if (!distances[ci][cj] || distances[ci][cj] > newDistance) {
        distances[ci][cj] = newDistance
        parents[ci][cj] = node
      }
    }

    visited[i][j] = true
    node = shortestDistanceNode(distances, visited)
  }

  return distances[endNode[0]][endNode[1]]
}

function shortestDistanceNode(
  distances: Grid<number>,
  visited: Grid<boolean>
): Node {
  let [mi, mj]: Node = [undefined, undefined]

  for (let i = 0; i < distances.length; i++) {
    for (let j = 0; j < distances[i].length; j++) {
      if (
        !visited[i][j] &&
        (mi === undefined || distances[i][j] < distances[mi][mj])
      ) {
        mi = i
        mj = j
      }
    }
  }

  return mi === undefined ? undefined : [mi, mj]
}

function getNeighbours(grid: Grid<number>, node: Node): Node[] {
  const [i, j] = node

  return (
    [
      [i - 1, j],
      [i + 1, j],
      [i, j - 1],
      [i, j + 1]
    ] as Node[]
  ).filter(
    ([ii, jj]: Node) =>
      ii >= 0 && ii < grid.length && jj >= 0 && jj < grid[ii].length
  )
}
