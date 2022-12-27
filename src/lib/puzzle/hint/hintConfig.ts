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
  hueCutoff: number // further than this away from the target hue, you don't get a hue hint-grid
  hueStep: number // when you get a hue hint-grid, you'll be shown a colour moved this amount toward the target
  saturationMaxStep: number // when you get a saturation hint-grid, this is the maximum amount of a hint-grid you'll get
  brightnessMaxStep: number // when you get a brightness hint-grid, this is the maximum amount of a hint-grid you'll get
}
export interface HintConfig {
  rgb: HintConfigRGB
  hsb: HintConfigHSB
  cmyk: HintConfigCMYK
}
