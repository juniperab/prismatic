import { toHSB } from '../../colour/colourConversions'
import { HintItem, HintType, HSBHint } from './hint'
import { hueDiff, rotateHue } from "../../colour/colourMath";
import { HintGeneratorConfigHSB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { HSBColour } from '../../colour/colours'
import { Puzzle } from '../puzzle'

export function generateHintHSB(guess: HSBColour, puzzle: Puzzle, config: HintGeneratorConfigHSB): HSBHint {
  const { precision } = puzzle
  const answer = toHSB(puzzle.answer)
  const hue = hueHint(guess, answer, precision, config)
  const saturation = saturationHint(guess, answer, precision, config)
  const brightness = brightnessHint(guess, answer, precision, config)

  let innerColour = guess
  let outerColour = guess

  if (hue !== undefined) {
    outerColour = {
      h: rotateHue(guess.h, Math.sign(hue.error) * config.hueRange),
      s: outerColour.s + Math.sign(saturation?.error ?? 0) * config.saturationRange,
      b: outerColour.b + Math.sign(brightness?.error ?? 0) * config.brightnessRange,
    }
  } else {
    innerColour = { ...innerColour, s: 0 }
    outerColour = {
      ...outerColour,
      s: 0,
      b: outerColour.b + Math.sign(brightness?.error ?? 0) * config.brightnessRange,
    }
  }

  if (saturation?.match !== true) {
    if (outerColour.s > 100) {
      const extra = outerColour.s - 100
      outerColour = { ...outerColour, s: 100 }
      innerColour = { ...innerColour, s: innerColour.s - extra / 2 }
    } else if (outerColour.s < 0) {
      const extra = outerColour.s
      outerColour = { ...outerColour, s: 0 }
      innerColour = { ...innerColour, s: innerColour.s - extra / 2 }
    }
  }
  if (brightness?.match !== true) {
    if (outerColour.b > 100) {
      const extra = outerColour.b - 100
      outerColour = { ...outerColour, b: 100 }
      innerColour = { ...innerColour, b: innerColour.b - extra / 2 }
    } else if (outerColour.b < 0) {
      const extra = outerColour.b
      outerColour = { ...outerColour, b: 0 }
      innerColour = { ...innerColour, b: innerColour.b - extra / 2 }
    }
  }

  return {
    type: HintType.HSB,
    guessedColour: guess,
    innerColour,
    outerColour,
    hue,
    saturation,
    brightness,
  }
}

function hueHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  return simpleHintItem(hueDiff(target.h, guess.h), precision, config.hueCutoff, config.hueRange)
}

function saturationHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  return simpleHintItem(target.s - guess.s, precision, config.saturationCutoff, config.saturationRange)
}

function brightnessHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  return simpleHintItem(target.b - guess.b, precision, config.brightnessCutoff, config.brightnessRange)
}
