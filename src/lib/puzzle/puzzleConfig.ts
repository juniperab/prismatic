import { HintGeneratorConfig } from './hint-generators/hintGeneratorConfig'
import { PuzzleConfig } from './puzzle'

const hintGeneratorConfig: HintGeneratorConfig = {
  cmyk: {
    cyanCutoff: 128,
    cyanRange: 64,
    magentaCutoff: 128,
    magentaRange: 64,
    yellowCutoff: 128,
    yellowRange: 64,
    blackCutoff: 128,
    blackRange: 64,
  },
  hsb: {
    hueCutoff: 90,
    hueRange: 60,
    saturationCutoff: 33,
    saturationPrecisionMultiplier: 1,
    saturationPrecisionThreshold: 1,
    saturationRange: 40,
    saturationVisibilityThreshold: 20,
    brightnessCutoff: 33,
    brightnessPrecisionMultiplier: 2,
    brightnessPrecisionThreshold: 10,
    brightnessRange: 40,
  },
  rgb: {
    redCutoff: 128,
    redRange: 64,
    greenCutoff: 128,
    greenRange: 64,
    blueCutoff: 128,
    blueRange: 64,
  },
}

export const puzzleConfig: PuzzleConfig = {
  hintGenerators: hintGeneratorConfig,
}
