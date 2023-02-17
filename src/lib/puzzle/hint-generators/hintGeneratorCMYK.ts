import { HintType, CMYKHint } from '../hint'
import { HintGeneratorConfigCMYK } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { Puzzle } from '../puzzle'
import { toCMYK } from '../../colour/colourConversions'
import { CMYKColour } from '../../colour/colourCMYK'

export function generateHintCMYK(guess: CMYKColour, puzzle: Puzzle, config: HintGeneratorConfigCMYK): CMYKHint {
  const { precision } = config
  const answer = toCMYK(puzzle.answer)
  return {
    type: HintType.CMYK,
    guessedColour: guess,
    cyan: simpleHintItem(answer.c - guess.c, precision, config.cyanCutoff, config.cyanRange),
    magenta: simpleHintItem(answer.m - guess.m, precision, config.magentaCutoff, config.magentaRange),
    yellow: simpleHintItem(answer.y - guess.y, precision, config.yellowCutoff, config.yellowRange),
    black: simpleHintItem(answer.k - guess.k, precision, config.blackCutoff, config.blackRange),
  }
}
