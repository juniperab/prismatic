import { HintType, RGBHint } from './hint'
import { RGBColor } from 'react-color'
import { PuzzleRGB } from '../puzzle'
import { HintGeneratorConfigRGB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'

export function generateHintRGB(guess: RGBColor, puzzle: PuzzleRGB, config: HintGeneratorConfigRGB): RGBHint {
  const { answer, precision } = puzzle
  return {
    type: HintType.RGB,
    guessedColour: guess,
    red: simpleHintItem(answer.r - guess.r, precision, config.redCutoff, config.redRange),
    green: simpleHintItem(answer.g - guess.g, precision, config.greenCutoff, config.greenRange),
    blue: simpleHintItem(answer.b - guess.b, precision, config.blueCutoff, config.blueRange),
  }
}
