import { HintItem, HSLHint } from './hint'
import { HSLColor } from 'react-color'
import { HintConfigHSL } from './hintConfig'
import { hueDiff, rotateHue } from '../../colour/colourMath'
import { bounded } from '../../math/math'
import { PuzzleHSL } from '../puzzle'

export function generateHintHSL (guess: HSLColor, puzzle: PuzzleHSL, config: HintConfigHSL): HSLHint {
  const { answer, precision } = puzzle
  return {
    type: 'hsl',
    guessedColour: guess,
    hue: getHueHint(guess, answer, precision, config),
    saturation: getSaturationHint(guess, answer, precision, config),
    luminance: getLuminanceHint(guess, answer, precision, config)
  }
}

function getHueHint (
  guess: HSLColor,
  target: HSLColor,
  precision: number,
  config: HintConfigHSL
): HintItem | undefined {
  const diff = hueDiff(target.h, guess.h)
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { h: guess.h, s: 0, b: 100 }, value: 0 }
  } else if (Math.abs(diff) > config.hueCutoff) {
    return
  }
  const value = bounded(diff / config.hueStep, -1, 1)
  const hue = rotateHue(guess.h, config.hueStep * Math.sign(diff))
  return { match: false, colour: { h: hue, s: Math.abs(value) * 100, b: 100 }, value }
}

function getSaturationHint (
  guess: HSLColor,
  target: HSLColor,
  precision: number,
  config: HintConfigHSL
): HintItem | undefined {
  const diff = target.s - guess.s
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { h: guess.h, s: 0, b: 100 }, value: 0 }
  } else if (diff < 0) {
    return
  }
  const value = bounded(diff / config.saturationMaxStep, -1, 1)
  return { match: false, colour: { h: guess.h, s: Math.abs(value) * 100, b: 100 }, value }
}

function getLuminanceHint (
  guess: HSLColor,
  target: HSLColor,
  precision: number,
  config: HintConfigHSL
): HintItem | undefined {
  // TODO: figure out how to make a hint for luminance

}
