import { HintGeneratorConfig } from './hint-generators/hintGeneratorConfig'
import { PuzzleConfig } from './puzzle'

const precision = 3

const hintGeneratorConfig: HintGeneratorConfig = {
  cmyk: {
    blackCutoff: 128,
    blackRange: 64,
    cyanCutoff: 128,
    cyanRange: 64,
    magentaCutoff: 128,
    magentaRange: 64,
    precision,
    yellowCutoff: 128,
    yellowRange: 64,
  },
  hsb: {
    brightnessCutoff: 33,
    brightnessVisibilityFloor: 10,
    brightnessRange: 33,
    hueCutoff: 90,
    hueRange: 60,
    precision,
    saturationCutoff: 33,
    saturationVisibilityFloor: 2,
    saturationRange: 33,
  },
  rgb: {
    blueCutoff: 128,
    blueRange: 64,
    greenCutoff: 128,
    greenRange: 64,
    precision,
    redCutoff: 128,
    redRange: 64,
  },
}

export const puzzleConfig: PuzzleConfig = {
  hintGenerators: hintGeneratorConfig,
}
