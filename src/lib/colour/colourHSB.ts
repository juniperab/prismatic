export interface HSBColour {
  a?: number | undefined // [0, 100]
  h: number // [0, 360)
  s: number // [0, 100]
  b: number // [0, 100]
}

export function isHSB(colour: any): colour is HSBColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const hsb = colour as HSBColour
  return hsb.h !== undefined && hsb.s !== undefined && hsb.b !== undefined
}
