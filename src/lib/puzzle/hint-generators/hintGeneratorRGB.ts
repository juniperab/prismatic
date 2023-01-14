import { HintType, RGBHint } from '../hint'
import { HintGeneratorConfigRGB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { RGBColour } from '../../colour/colours'
import { Puzzle } from '../puzzle'
import { toRGB } from '../../colour/colourConversions'

export function generateHintRGB(guess: RGBColour, puzzle: Puzzle, config: HintGeneratorConfigRGB): RGBHint {
  const { precision } = config
  const answer = toRGB(puzzle.answer)
  return {
    type: HintType.RGB,
    guessedColour: guess,
    red: simpleHintItem(answer.r - guess.r, precision, config.redCutoff, config.redRange),
    green: simpleHintItem(answer.g - guess.g, precision, config.greenCutoff, config.greenRange),
    blue: simpleHintItem(answer.b - guess.b, precision, config.blueCutoff, config.blueRange),
  }
}
