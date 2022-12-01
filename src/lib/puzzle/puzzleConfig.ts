import { HintConfig } from './hint/hintConfig'
import { PuzzleConfig } from './puzzle'

const hintConfig: HintConfig = {
  rgb: {
    redCutoff: 128,
    redMaxStep: 64,
    greenCutoff: 128,
    greenMaxStep: 64,
    blueCutoff: 128,
    blueMaxStep: 64,
  },
  hsl: {
    hueCutoff: 90,
    hueStep: 90,
    saturationMaxStep: 25,
  },
  hsb: {
    hueCutoff: 90,
    hueStep: 60,
    saturationMaxStep: 25,
    brightnessMaxStep: 25,
  },
}

export const puzzleConfig: PuzzleConfig = {
  hint: hintConfig,
}
