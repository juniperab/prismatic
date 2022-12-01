import { HintItem, RGBHint } from './hint'
import { RGBColor } from 'react-color'
import { PuzzleRGB } from '../puzzle'
import { HintConfigRGB } from './hintConfig'
import { hueDiff } from '../../colour/colourMath'
import { bounded } from '../../math/math'
import { toRGB } from '../../colour/colourConversions'

export function generateHintRGB (guess: RGBColor, puzzle: PuzzleRGB, config: HintConfigRGB): RGBHint {
  const { answer, precision } = puzzle
  return {
    type: 'rgb',
    guessedColour: guess,
    red: getRedHint(guess, answer, precision, config),
    green: getGreenHint(guess, answer, precision, config),
    blue: getBlueHint(guess, answer, precision, config)
  }
}

function getRedHint (
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  const diff = hueDiff(target.r, guess.r)
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { r: 255, g: 255, b: 255 }, value: 0 }
  } else if (Math.abs(diff) > config.redCutoff) {
    return
  }
  const value = bounded(diff / config.redMaxStep, -1, 1)
  if (value > 0) {
    return { match: false, colour: toRGB({ h: 0, s: 100 * (1 - value), b: 100 }), value }
  } else {
    return { match: false, colour: toRGB({ h: 180, s: 100 * (1 + value), b: 100 }), value }
  }
}

function getGreenHint (
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  const diff = hueDiff(target.g, guess.g)
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { r: 255, g: 255, b: 255 }, value: 0 }
  } else if (Math.abs(diff) > config.greenCutoff) {
    return
  }
  const value = bounded(diff / config.greenMaxStep, -1, 1)
  if (value > 0) {
    return { match: false, colour: toRGB({ h: 120, s: 100 * (1 - value), b: 100 }), value }
  } else {
    return { match: false, colour: toRGB({ h: 300, s: 100 * (1 + value), b: 100 }), value }
  }
}

function getBlueHint (
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  const diff = hueDiff(target.b, guess.b)
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { r: 255, g: 255, b: 255 }, value: 0 }
  } else if (Math.abs(diff) > config.blueCutoff) {
    return
  }
  const value = bounded(diff / config.blueMaxStep, -1, 1)
  if (value > 0) {
    return { match: false, colour: toRGB({ h: 240, s: 100 * (1 - value), b: 100 }), value }
  } else {
    return { match: false, colour: toRGB({ h: 60, s: 100 * (1 + value), b: 100 }), value }
  }
}
