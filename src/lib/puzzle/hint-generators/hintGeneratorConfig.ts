export interface HintGeneratorConfigBase {
  precision: number
}

export interface HintGeneratorConfigCMYK extends HintGeneratorConfigBase {
  cyanCutoff: number
  cyanRange: number
  magentaCutoff: number
  magentaRange: number
  yellowCutoff: number
  yellowRange: number
  blackCutoff: number
  blackRange: number
}

export interface HintGeneratorConfigHSB extends HintGeneratorConfigBase {
  hueCutoff: number
  hueRange: number

  saturationCutoff: number
  saturationPrecisionMultiplier: number
  saturationPrecisionThreshold: number
  saturationRange: number
  saturationVisibilityThreshold: number
  brightnessCutoff: number
  brightnessPrecisionMultiplier: number
  brightnessPrecisionThreshold: number
  brightnessRange: number
}

export interface HintGeneratorConfigRGB extends HintGeneratorConfigBase {
  redCutoff: number
  redRange: number
  greenCutoff: number
  greenRange: number
  blueCutoff: number
  blueRange: number
}

export interface HintGeneratorConfig {
  cmyk: HintGeneratorConfigCMYK
  hsb: HintGeneratorConfigHSB
  rgb: HintGeneratorConfigRGB
}
