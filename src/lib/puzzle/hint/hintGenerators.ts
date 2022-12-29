import { HintItem } from './hint'
import { bounded } from '../../math/math'

export function generateHintItem(
  valueDiff: number,
  precision: number,
  cutoff: number,
  step: number,
  hardStep: boolean
): HintItem | undefined {
  if (Math.abs(valueDiff) <= precision) {
    return { match: true, diff: valueDiff }
  } else if (Math.abs(valueDiff) > cutoff) {
    return undefined
  }
  if (hardStep) {
    return { match: false, diff: step * Math.sign(valueDiff) }
  } else {
    return { match: false, diff: bounded(valueDiff / step, -1, 1) * step }
  }
}
