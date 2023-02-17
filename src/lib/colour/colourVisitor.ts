import { CMYKColour, isCMYK } from './colourCMYK'
import { HexColour, isHex } from './colourHex'
import { HSBColour, isHSB } from './colourHSB'
import { HSLColour, isHSL } from './colourHSL'
import { isKeyword, KeywordColour } from './colourKeyword'
import { isNamed, NamedColour } from './colourNamed'
import { isRGB, RGBColour } from './colourRGB'
import { isYIQ, YIQColour } from './colourYIQ'
import { AnyColour } from './colours'

export interface ColourVisitor<T> {
  cmyk?: (c: CMYKColour) => T
  hex?: (c: HexColour) => T
  hsb?: (c: HSBColour) => T
  hsl?: (c: HSLColour) => T
  keyword?: (c: KeywordColour) => T
  named?: (c: NamedColour) => T
  rgb?: (c: RGBColour) => T
  yiq?: (c: YIQColour) => T
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
  } else if (isKeyword(colour)) {
    return visitor.keyword?.(colour)
  } else if (isNamed(colour)) {
    return visitor.named?.(colour)
  } else if (isRGB(colour)) {
    return visitor.rgb?.(colour)
  } else if (isYIQ(colour)) {
    return visitor.yiq?.(colour)
  }
  throw new Error('invalid colour type')
}

export function visitColourOrThrow<T>(colour: AnyColour, visitor: ColourVisitor<T>, error?: Error): T {
  const result = visitColour(colour, visitor)
  if (result === undefined) throw error ?? new Error('ColourVisitor produced no result')
  return result
}
