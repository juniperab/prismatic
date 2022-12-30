import { HintItem } from './hint'
import { bounded } from '../../math/math'

export function simpleHintItem(
  valueDiff: number,
  precision: number,
  cutoff: number,
  range?: number
): HintItem | undefined {
  if (Math.abs(valueDiff) <= precision) {
    return { match: true, error: valueDiff }
  } else if (Math.abs(valueDiff) > cutoff) {
    return undefined
  }
  if (range === undefined) {
    return { match: false, error: Math.sign(valueDiff) }
  } else {
    return { match: false, error: bounded(valueDiff / range, -1, 1) }
  }
}
