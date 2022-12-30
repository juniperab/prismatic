import { HintType, CMYKHint } from './hint'
import { HintGeneratorConfigCMYK } from './hintGeneratorConfig'
import { CMYKColour } from '../../colour/colourConversions'
import { PuzzleCMYK } from '../puzzle'
import { simpleHintItem } from './hintGeneratorCommon'

export function generateHintCMYK(
  guess: CMYKColour,
  puzzle: PuzzleCMYK,
  config: HintGeneratorConfigCMYK
): CMYKHint {
  const { answer, precision } = puzzle
  return {
    type: HintType.CMYK,
    guessedColour: guess,
    cyan: simpleHintItem(answer.c - guess.c, precision, config.cyanCutoff, config.cyanRange),
    magenta: simpleHintItem(answer.m - guess.m, precision, config.magentaCutoff, config.magentaRange),
    yellow: simpleHintItem(answer.y - guess.y, precision, config.yellowCutoff, config.yellowRange),
    black: simpleHintItem(answer.k - guess.k, precision, config.blackCutoff, config.blackRange),
  }
}
