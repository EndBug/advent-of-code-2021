import fs from 'fs'
import path from 'path'

const fn = path.join(__dirname, 'input.txt')

;(function main() {
  const coords = fs
      .readFileSync(fn, { encoding: 'utf-8' })
      .split('x=')[1]
      .split(', y=')
      .map((s) => s.trim().split('..').map(Number)),
    target: TargetArea = {
      bl: {
        x: Math.min(...coords[0]),
        y: Math.min(...coords[1])
      },
      tr: {
        x: Math.max(...coords[0]),
        y: Math.max(...coords[1])
      }
    }

  const [highest, vels] = solve(target)

  console.log(`[P1] ${highest}`)
  console.log(`[P2] ${vels.length}`)
})()

interface Vector {
  x: number
  y: number
}

interface TargetArea {
  bl: Vector // bottom-left
  tr: Vector // top-right
}

function solve(target: TargetArea): [number, Vector[]] {
  const vel: Vector = {
    x: 0,
    y: target.bl.y
  }
  let highest = undefined
  const vels: Vector[] = []

  for (; vel.x <= target.tr.x; vel.x++) {
    for (vel.y = target.bl.y; vel.y <= -target.bl.y; vel.y++) {
      const currHigh = isGoingToHit(target, vel)
      if (currHigh !== undefined) {
        if (highest === undefined || highest < currHigh) highest = currHigh
        vels.push(vel)
      }
    }
  }

  return [highest, vels]
}

function isGoingToHit(target: TargetArea, vel: Vector): number {
  const pos: Vector = {
      x: 0,
      y: 0
    },
    currVel = { ...vel }
  let hit = false,
    highest = pos.y

  while (!hit && pos.x <= target.tr.x && pos.y >= target.bl.y) {
    if (isInTarget(target, pos)) hit = true
    else {
      pos.x += currVel.x
      pos.y += currVel.y
      if (currVel.x > 0) currVel.x--
      else if (currVel.x < 0) currVel.x++
      currVel.y--

      if (highest < pos.y) highest = pos.y
    }
  }

  return hit ? highest : undefined
}

function isInTarget(target: TargetArea, pos: Vector) {
  return (
    pos.x >= target.bl.x &&
    pos.x <= target.tr.x &&
    pos.y >= target.bl.y &&
    pos.y <= target.tr.y
  )
}
