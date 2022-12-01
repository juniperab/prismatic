import * as _ from 'lodash'

export function euclideanDistance (a: number[], b: number[]): number {
  return Math.sqrt(_.sum(_.zip(a, b).map(pair => {
    return Math.pow(pair[0] as number, 2) + Math.pow(pair[1] as number, 2)
  })))
}

export function bounded (value: number, floor: number, ceiling: number): number {
  return Math.min(Math.max(value, floor), ceiling)
}
