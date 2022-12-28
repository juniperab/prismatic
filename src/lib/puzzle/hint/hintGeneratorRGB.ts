import { HintItem, HintType, RGBHint } from './hint'
import { RGBColor } from 'react-color'
import { PuzzleRGB } from '../puzzle'
import { HintConfigRGB } from './hintConfig'
import { generateHintItem } from "./hintGenerators";

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

function getRedHintItem(
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  return generateHintItem(target.r - guess.r, precision, config.redCutoff, config.redMaxStep, false)
}

function getGreenHintItem(
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  return generateHintItem(target.g - guess.g, precision, config.greenCutoff, config.greenMaxStep, false)
}

function getBlueHintItem(
  guess: RGBColor,
  target: RGBColor,
  precision: number,
  config: HintConfigRGB
): HintItem | undefined {
  return generateHintItem(target.b - guess.b, precision, config.blueCutoff, config.blueMaxStep, false)
}
