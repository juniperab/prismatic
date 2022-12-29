import { HintItem, HintType, CMYKHint } from './hint'
import { HintConfigCMYK } from './hintConfig'
import { CMYKColor } from '../../colour/colourConversions'
import { PuzzleCMYK } from '../puzzle'
import { generateHintItem } from './hintGenerators'

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

function getCyanHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return generateHintItem(target.c - guess.c, precision, config.cyanCutoff, config.cyanMaxStep, false)
}

function getMagentaHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return generateHintItem(target.m - guess.m, precision, config.magentaCutoff, config.magentaMaxStep, false)
}

function getYellowHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return generateHintItem(target.y - guess.y, precision, config.yellowCutoff, config.yellowMaxStep, false)
}

function getBlackHintItem(
  guess: CMYKColor,
  target: CMYKColor,
  precision: number,
  config: HintConfigCMYK
): HintItem | undefined {
  return generateHintItem(target.k - guess.k, precision, config.blackCutoff, config.blackMaxStep, false)
}
