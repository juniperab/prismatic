export type HexColour = string // '#RRGGBB' or '#RRGGBBAA' (always uppercase)

export function isHex(colour: any): colour is HexColour {
  if (colour === undefined || typeof colour !== 'string') return false
  return (colour.length === 7 || colour.length === 9) && colour.charAt(0) === '#' && colour.toUpperCase() === colour
}

export function getHexAlpha(colour: HexColour): number | undefined {
  if (colour.length !== 9) {
    return undefined
  }
  return (parseInt(colour.slice(-2), 16) / 255) * 100
}

export function hexWithAlpha(colour: HexColour, alpha: number | undefined): HexColour {
  const hexDigitsWithoutAlpha = colour.slice(1, 7)
  if (alpha === undefined) return `#${hexDigitsWithoutAlpha}`.toUpperCase()
  const alphaDigits = Math.round((alpha * 255) / 100).toString(16)
  return `#${hexDigitsWithoutAlpha}${alphaDigits}`.toUpperCase()
}
