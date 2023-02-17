export interface RGBColour {
  a?: number | undefined // [0, 100]
  r: number // [0, 255]
  g: number // [0, 255]
  b: number // [0, 255]
}

export function isRGB(colour: any): colour is RGBColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const rgb = colour as RGBColour
  return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}
