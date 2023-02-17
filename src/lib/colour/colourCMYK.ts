export interface CMYKColour {
  a?: number | undefined // [0, 100]
  c: number // [0, 255]
  m: number // [0, 255]
  y: number // [0, 255]
  k: number // [0, 255]
}

export function isCMYK(colour: any): colour is CMYKColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const cmyk = colour as CMYKColour
  return cmyk.c !== undefined && cmyk.m !== undefined && cmyk.y !== undefined && cmyk.k !== undefined
}
