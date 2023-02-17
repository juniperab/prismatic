export interface HSLColour {
  a?: number | undefined // [0, 100]
  h: number // [0, 360)
  s: number // [0, 100]
  l: number // [0, 100]
}

export function isHSL(colour: any): colour is HSLColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const hsl = colour as HSLColour
  return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}
