import { HintItem, HintType, CMYKHint } from './hint'
import { bounded } from '../../math/math'
import { HintConfigCMYK } from "./hintConfig";
import { CMYKColor, toCMYK, toRGB } from "../../colour/colourConversions";
import { PuzzleCMYK } from "../puzzle";

export function generateHintCMYK(guess: CMYKColor, puzzle: PuzzleCMYK, config: HintConfigCMYK): CMYKHint {
  const { answer, precision } = puzzle
  return {
    type: HintType.CMYK,
    guessedColour: guess,
    cyan: getCyanHintItem(guess, answer, precision, config),
    magenta: getMagentaHintItem(guess, answer, precision, config),
    yellow: getYellowHintItem(guess, answer, precision, config),
    black: getBlackHintItem(guess, answer, precision, config),
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
      colour: toCMYK({ h: 0, s: 100 * (1 - value), b: 100 }),
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

function getCyanHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return getHintItem(guess.c, target.c, precision, config.cyanCutoff, config.cyanMaxStep)
}

function getMagentaHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return getHintItem(guess.m, target.m, precision, config.magentaCutoff, config.magentaMaxStep)
}

function getYellowHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return getHintItem(guess.y, target.y, precision, config.yellowCutoff, config.yellowMaxStep)
}

function getBlackHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return getHintItem(guess.k, target.k, precision, config.blackCutoff, config.blackMaxStep)
}
