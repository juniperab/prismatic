import { isCMYK, isHex, isHSB, isHSL, isNamed, isRGB } from './colourConversions'

export interface CMYKColour {
  a?: number | undefined
  c: number
  m: number
  y: number
  k: number
}

export type HexColour = string

export interface HSBColour {
  a?: number | undefined
  h: number
  s: number
  b: number
}

export interface HSLColour {
  a?: number | undefined
  h: number
  s: number
  l: number
}

export type NamedColour = string

export interface RGBColour {
  a?: number | undefined
  r: number
  g: number
  b: number
}

export type AnyColour = CMYKColour | HexColour | HSBColour | HSLColour | NamedColour | RGBColour

export interface ColourVisitor<T> {
  cmyk?: (c: CMYKColour) => T
  hex?: (c: HexColour) => T
  hsb?: (c: HSBColour) => T
  hsl?: (c: HSLColour) => T
  named?: (c: NamedColour) => T
  rgb?: (c: RGBColour) => T
}

export function visitColour<T>(colour: AnyColour, visitor: ColourVisitor<T>): T | undefined {
  if (isCMYK(colour)) {
    return visitor.cmyk?.(colour)
  } else if (isHex(colour)) {
    return visitor.hex?.(colour)
  } else if (isHSB(colour)) {
    return visitor.hsb?.(colour)
  } else if (isHSL(colour)) {
    return visitor.hsl?.(colour)
  } else if (isNamed(colour)) {
    return visitor.named?.(colour)
  } else if (isRGB(colour)) {
    return visitor.rgb?.(colour)
  }
  throw new Error('invalid colour type')
}

export function visitColourOrThrow<T>(colour: AnyColour, visitor: ColourVisitor<T>, error?: Error): T {
  const result = visitColour(colour, visitor)
  if (result === undefined) throw error ?? new Error('ColourVisitor produced no result')
  return result
}
