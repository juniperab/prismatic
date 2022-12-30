
export interface HintGeneratorConfigCMYK {
  cyanCutoff: number
  cyanRange: number
  magentaCutoff: number
  magentaRange: number
  yellowCutoff: number
  yellowRange: number
  blackCutoff: number
  blackRange: number
}

export interface HintGeneratorConfigHSB {
  hueCutoff: number
  hueStep: number
  saturationCutoff: number
  saturationRange: number
  brightnessCutoff: number
  brightnessRange: number
}

export interface HintGeneratorConfigRGB {
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
