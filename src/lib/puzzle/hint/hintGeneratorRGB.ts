import { HintItem, HintType, RGBHint } from './hint'
import { RGBColor } from 'react-color'
import { PuzzleRGB } from '../puzzle'
import { HintConfigRGB } from './hintConfig'
import { bounded } from '../../math/math'
import { toRGB } from '../../colour/colourConversions'

export function generateHintRGB(guess: RGBColor, puzzle: PuzzleRGB, config: HintConfigRGB): RGBHint {
  const { answer, precision } = puzzle
  return {
    type: HintType.RGB,
    guessedColour: guess,
    red: getRedHintItem(guess, answer, precision, config),
    green: getGreenHintItem(guess, answer, precision, config),
    blue: getBlueHintItem(guess, answer, precision, config),
  }
}

function getHintItem(
  guessVal: number,
  targetVal: number,
  precision: number,
  cutoff: number,
  maxStep: number
): HintItem | undefined {
  const diff = targetVal - guessVal
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { r: 255, g: 255, b: 255 }, value: 0 }
  } else if (Math.abs(diff) > cutoff) {
    return
  }
  const value = bounded(diff / maxStep, -1, 1)
  if (value > 0) {
    return {
      match: false,
      colour: toRGB({ h: 0, s: 100 * (1 - value), b: 100 }),
      value,
    }
  } else {
    return {
      match: false,
      colour: toRGB({ h: 180, s: 100 * (1 + value), b: 100 }),
      value,
    }
  }
}

function getRedHintItem(
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  return getHintItem(guess.r, target.r, precision, config.redCutoff, config.redMaxStep)
}

function getGreenHintItem(
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  return getHintItem(guess.g, target.g, precision, config.greenCutoff, config.greenMaxStep)
}

function getBlueHintItem(
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  return getHintItem(guess.b, target.b, precision, config.blueCutoff, config.blueMaxStep)
}
