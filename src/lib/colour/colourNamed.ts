import { getHexAlpha, HexColour, hexWithAlpha, isHex } from './colourHex'

export interface NamedColour {
  name: string // a well-formatted colour name, title case, with spaces between words
  hex: HexColour
}

export type ColourNameLookup = (hex: HexColour) => Promise<string>

export function isNamed(colour: any): colour is NamedColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const named = colour as NamedColour
  return named.name !== undefined && named.hex !== undefined && named.name.length > 0 && isHex(named.hex)
}

export function getNamedAlpha(colour: NamedColour): number | undefined {
  return getHexAlpha(colour.hex)
}

export function namedWithAlpha(colour: NamedColour, alpha: number | undefined): NamedColour {
  return {
    name: colour.name,
    hex: hexWithAlpha(colour.hex, alpha),
  }
}
