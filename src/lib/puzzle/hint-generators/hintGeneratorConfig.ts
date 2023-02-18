export interface HintGeneratorConfigBase {
  precision: number
}

export interface HintGeneratorConfigCMYK extends HintGeneratorConfigBase {
  blackCutoff: number
  blackRange: number
  cyanCutoff: number
  cyanRange: number
  magentaCutoff: number
  magentaRange: number
  yellowCutoff: number
  yellowRange: number
}

export interface HintGeneratorConfigHSB extends HintGeneratorConfigBase {
  brightnessCutoff: number
  brightnessVisibilityFloor: number
  brightnessRange?: number
  hueCutoff: number
  hueRange?: number
  saturationCutoff: number
  saturationVisibilityFloor: number
  saturationRange?: number
}

export interface HintGeneratorConfigRGB extends HintGeneratorConfigBase {
  blueCutoff: number
  blueRange: number
  greenCutoff: number
  greenRange: number
  redCutoff: number
  redRange: number
}

export interface HintGeneratorConfig {
  cmyk: HintGeneratorConfigCMYK
  hsb: HintGeneratorConfigHSB
  rgb: HintGeneratorConfigRGB
}
