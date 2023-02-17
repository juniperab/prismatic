import { CMYKColour } from './colourCMYK'
import { getHexAlpha, HexColour, hexWithAlpha } from './colourHex'
import { HSBColour } from './colourHSB'
import { HSLColour } from './colourHSL'
import { KeywordColour } from './colourKeyword'
import { getNamedAlpha, NamedColour, namedWithAlpha } from './colourNamed'
import { RGBColour } from './colourRGB'
import { YIQColour } from './colourYIQ'
import { visitColour, visitColourOrThrow } from './colourVisitor'

export type AnyColour =
  | CMYKColour
  | HexColour
  | HSBColour
  | HSLColour
  | KeywordColour
  | NamedColour
  | RGBColour
  | YIQColour

export function getAlpha(colour: AnyColour): number | undefined {
  return visitColour<number | undefined>(colour, {
    cmyk: (c) => c.a,
    hex: (c) => getHexAlpha(c),
    hsb: (c) => c.a,
    hsl: (c) => c.a,
    named: (c) => getNamedAlpha(c),
    rgb: (c) => c.a,
    yiq: (c: YIQColour) => c.a,
  })
}

export function withAlpha<T extends AnyColour>(colour: AnyColour, alpha?: number): T {
  return visitColourOrThrow<AnyColour>(colour, {
    cmyk: (c) => ({ ...c, a: alpha }),
    hex: (c) => hexWithAlpha(c, alpha),
    hsb: (c) => ({ ...c, a: alpha }),
    hsl: (c) => ({ ...c, a: alpha }),
    keyword: (c) => c, // KeywordColour cannot have an alpha value
    named: (c) => namedWithAlpha(c, alpha),
    rgb: (c) => ({ ...c, a: alpha }),
    yiq: (c) => ({ ...c, a: alpha }),
  }) as T
}
