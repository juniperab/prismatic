import { HSBColor } from '../../colour/colourConversions'
import { HintItem, HintType, HSBHint } from './hint'
import { hueDiff, rotateHue } from "../../colour/colourMath";
import { PuzzleHSB } from '../puzzle'
import { HintConfigHSB } from './hintConfig'
import { generateHintItem } from "./hintGenerators";

export function generateHintHSB(guess: HSBColor, puzzle: PuzzleHSB, config: HintConfigHSB): HSBHint {
  const { answer, precision } = puzzle
  return {
    type: HintType.HSB,
    guessedColour: guess,
    hue: getHueHint(guess, answer, precision, config),
    saturation: getSaturationHint(guess, answer, precision, config),
    brightness: getBrightnessHint(guess, answer, precision, config),
  }
}

function getHueHint(guess: HSBColor, target: HSBColor, precision: number, config: HintConfigHSB): HintItem | undefined {
  const diff = hueDiff(target.h, guess.h)
  const hintItem = generateHintItem(diff, precision, config.hueCutoff, config.hueStep, true)
  if (hintItem !== undefined) {
    return {
      ...hintItem,
      value: rotateHue(hintItem.value, 0), // normalize the hue value
    }
  } else {
    return undefined
  }
}

function getSaturationHint(
  guess: HSBColor,
  target: HSBColor,
  precision: number,
  config: HintConfigHSB
): HintItem | undefined {
  return generateHintItem(target.s - guess.s, precision, config.saturationCutoff, config.saturationMaxStep, false)
}

function getBrightnessHint(
  guess: HSBColor,
  target: HSBColor,
  precision: number,
  config: HintConfigHSB
): HintItem | undefined {
  return generateHintItem(target.b - guess.b, precision, config.brightnessCutoff, config.brightnessMaxStep, false)
}
