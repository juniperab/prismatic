import { HSBColor } from '../../colour/colourConversions'
import { HintItem, HSBHint } from './hint'
import { hueDiff, rotateHue } from '../../colour/colourMath'
import { PuzzleHSB } from '../puzzle'
import { HintConfigHSB } from './hintConfig'
import { bounded } from '../../math/math'

export function generateHintHSB(
  guess: HSBColor,
  puzzle: PuzzleHSB,
  config: HintConfigHSB
): HSBHint {
  const { answer, precision } = puzzle
  return {
    type: 'hsb',
    guessedColour: guess,
    hue: getHueHint(guess, answer, precision, config),
    saturation: getSaturationHint(guess, answer, precision, config),
    brightness: getBrightnessHint(guess, answer, precision, config),
  }
}

function getHueHint(
  guess: HSBColor,
  target: HSBColor,
  precision: number,
  config: HintConfigHSB
): HintItem | undefined {
  const diff = hueDiff(target.h, guess.h)
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { h: guess.h, s: 0, b: 100 }, value: 0 }
  } else if (Math.abs(diff) > config.hueCutoff) {
    return
  }
  const value = bounded(diff / config.hueStep, -1, 1)
  const hue = rotateHue(guess.h, config.hueStep * Math.sign(diff))
  return {
    match: false,
    colour: { h: hue, s: Math.abs(value) * 100, b: 100 },
    value,
  }
}

function getSaturationHint(
  guess: HSBColor,
  target: HSBColor,
  precision: number,
  config: HintConfigHSB
): HintItem | undefined {
  const diff = target.s - guess.s
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { h: guess.h, s: 0, b: 100 }, value: 0 }
  } else if (diff < 0) {
    return
  }
  const value = bounded(diff / config.saturationMaxStep, -1, 1)
  return {
    match: false,
    colour: { h: guess.h, s: Math.abs(value) * 100, b: 100 },
    value,
  }
}

function getBrightnessHint(
  guess: HSBColor,
  target: HSBColor,
  precision: number,
  config: HintConfigHSB
): HintItem | undefined {
  const diff = target.b - guess.b
  if (Math.abs(diff) <= precision) {
    return { match: true, colour: { h: guess.h, s: 0, b: 100 }, value: 0 }
  } else if (diff > 0) {
    return
  }
  const value = bounded(diff / config.brightnessMaxStep, -1, 1)
  return {
    match: false,
    colour: { h: guess.h, s: 0, b: Math.abs(1 - Math.abs(value)) * 100 },
    value,
  }
}
