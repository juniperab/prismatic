import { toHSB } from "../../colour/colourConversions";
import { HintItem, HintType, HSBHint } from './hint'
import { hueDiff } from '../../colour/colourMath'
import { HintGeneratorConfigHSB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { HSBColour } from "../../colour/colours";
import { Puzzle } from "../puzzle";

export function generateHintHSB(guess: HSBColour, puzzle: Puzzle, config: HintGeneratorConfigHSB): HSBHint {
  const { precision } = puzzle
  const answer = toHSB(puzzle.answer)
  return {
    type: HintType.HSB,
    guessedColour: guess,
    hintColour: toHSB('white'),
    hue: hueHint(guess, answer, precision, config),
    saturation: saturationHint(guess, answer, precision, config),
    brightness: brightnessHint(guess, answer, precision, config),
  }
}

function hueHint(guess: HSBColour, target: HSBColour, precision: number, config: HintGeneratorConfigHSB): HintItem | undefined {
  return simpleHintItem(hueDiff(target.h, guess.h), precision, config.hueCutoff, config.hueStep)
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
