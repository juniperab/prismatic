import * as _ from 'lodash'

export function bounded(value: number, floor: number, ceiling: number): number {
  return Math.min(Math.max(value, floor), ceiling)
}

export function euclideanDistance(a: number[], b?: number[]): number {
  if (b === undefined) b = Array(a.length).fill(0)
  return Math.sqrt(
    _.sum(
      _.zip(a, b).map((pair) => {
        return Math.pow(pair[0] as number, 2) + Math.pow(pair[1] as number, 2)
      })
    )
  )
}

export function floatEquals(a: number, b: number, precision: number = 6): boolean {
  return Math.abs(a - b) < Math.pow(10, -1 * precision)
}
