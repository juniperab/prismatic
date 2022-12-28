export interface HintConfigRGB {
  redCutoff: number
  redMaxStep: number
  greenCutoff: number
  greenMaxStep: number
  blueCutoff: number
  blueMaxStep: number
}

export interface HintConfigCMYK {
  cyanCutoff: number
  cyanMaxStep: number
  magentaCutoff: number
  magentaMaxStep: number
  yellowCutoff: number
  yellowMaxStep: number
  blackCutoff: number
  blackMaxStep: number
}

export interface HintConfigHSB {
  hueCutoff: number
  hueStep: number
  saturationCutoff: number
  saturationMaxStep: number
  brightnessCutoff: number
  brightnessMaxStep: number
}
export interface HintConfig {
  rgb: HintConfigRGB
  hsb: HintConfigHSB
  cmyk: HintConfigCMYK
}
