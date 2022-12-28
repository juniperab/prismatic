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
  hsb: {
    hueCutoff: 90,
    hueStep: 60,
    saturationCutoff: 50,
    saturationMaxStep: 25,
    brightnessCutoff: 50,
    brightnessMaxStep: 25,
  },
  cmyk: {
    cyanCutoff: 128,
    cyanMaxStep: 64,
    magentaCutoff: 128,
    magentaMaxStep: 64,
    yellowCutoff: 128,
    yellowMaxStep: 64,
    blackCutoff: 128,
    blackMaxStep: 64,
  },
}

export const puzzleConfig: PuzzleConfig = {
  hint: hintConfig,
}
