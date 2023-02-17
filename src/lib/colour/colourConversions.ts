import convert from 'color-convert'
import { floatEquals } from '../math/math'
import { isYIQ, rgbToYIQ, YIQColour, yiqToRGB } from './colourYIQ'
import { isRGB, RGBColour } from './colourRGB'
import { HSLColour, isHSL } from './colourHSL'
import { HSBColour, isHSB } from './colourHSB'
import { CMYKColour, isCMYK } from './colourCMYK'
import { HexColour, isHex } from './colourHex'
import { isKeyword, KeywordColour } from './colourKeyword'
import { ColourNameLookup, isNamed, NamedColour } from './colourNamed'
import { AnyColour, getAlpha, withAlpha } from './colours'
import { visitColourOrThrow } from './colourVisitor'
import { RGB } from 'color-convert/conversions'

type ColourTriple = [number, number, number]
type ColourQuad = [number, number, number, number]

function toTriple(colour: AnyColour): ColourTriple {
  if (isCMYK(colour)) {
    throw new Error('cannot convert CMYK colour to three-element vector')
  } else if (isHex(colour)) {
    return toTriple(toRGB(colour))
  } else if (isHSB(colour)) {
    return [colour.h, colour.s, colour.b]
  } else if (isHSL(colour)) {
    return [colour.h, colour.s, colour.l]
  } else if (isKeyword(colour)) {
    throw new Error('cannot convert keyword colour to vector')
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  } else if (isRGB(colour)) {
    return [colour.r, colour.g, colour.b]
  } else if (isYIQ(colour)) {
    return [colour.y, colour.i, colour.q]
  }
  throw new Error('invalid colour type')
}

function toQuad(colour: AnyColour): ColourQuad {
  if (isCMYK(colour)) {
    return [colour.c, colour.m, colour.y, colour.k]
  } else if (isHex(colour)) {
    return toQuad(toRGB(colour))
  } else if (isHSB(colour)) {
    return [colour.h, colour.s, colour.b, colour.a !== undefined ? colour.a : 100]
  } else if (isHSL(colour)) {
    return [colour.h, colour.s, colour.l, colour.a !== undefined ? colour.a : 100]
  } else if (isKeyword(colour)) {
    throw new Error('cannot convert keyword colour to vector')
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  } else if (isRGB(colour)) {
    return [colour.r, colour.g, colour.b, colour.a !== undefined ? colour.a : 100]
  } else if (isYIQ(colour)) {
    return [colour.y, colour.i, colour.q, colour.a !== undefined ? colour.a : 100]
  }
  throw new Error('invalid colour type')
}

function asCMYK(colour: ColourQuad): CMYKColour {
  return { c: colour[0], m: colour[1], y: colour[2], k: colour[3] }
}

function asHex(colour: string): HexColour {
  return `#${colour.toUpperCase()}`
}

function asHSB(colour: ColourTriple): HSBColour {
  return { h: colour[0], s: colour[1], b: colour[2] }
}

function asHSL(colour: ColourTriple): HSLColour {
  return { h: colour[0], s: colour[1], l: colour[2] }
}

function asKeyword(colour: string): KeywordColour {
  return colour.toLowerCase()
}

function asRGB(colour: ColourTriple): RGBColour {
  return { r: colour[0], g: colour[1], b: colour[2] }
}

function conv<I, O extends ColourTriple | ColourQuad | string, C extends AnyColour>(
  colour: AnyColour,
  inVal: I,
  convert: (i: I) => O,
  asOut: (o: O) => C
): C {
  const newColour = asOut(convert(inVal))
  return withAlpha(newColour, getAlpha(colour))
}

export function toCMYK(colour: AnyColour): CMYKColour {
  return visitColourOrThrow<CMYKColour>(colour, {
    cmyk: (c) => c,
    hex: (c) => conv(c, c.slice(1), convert.hex.cmyk, asCMYK),
    hsb: (c) => conv(c, toTriple(c), convert.hsv.cmyk, asCMYK),
    hsl: (c) => conv(c, toTriple(c), convert.hsl.cmyk, asCMYK),
    keyword: (c) => conv(c, c as any, convert.keyword.cmyk, asCMYK),
    named: (c) => conv(c, c.hex.slice(1), convert.hex.cmyk, asCMYK),
    rgb: (c) => conv(c, toTriple(c), convert.rgb.cmyk as (r: RGB) => ColourQuad, asCMYK),
    yiq: (c) => conv(c, toTriple(yiqToRGB(c)), convert.rgb.cmyk as (r: RGB) => ColourQuad, asCMYK),
  })
}

export function toHex(colour: AnyColour): HexColour {
  return visitColourOrThrow<HexColour>(colour, {
    cmyk: (c) => conv(c, toQuad(c), convert.cmyk.hex, asHex),
    hex: (c) => c,
    hsb: (c) => conv(c, toTriple(c), convert.hsv.hex, asHex),
    hsl: (c) => conv(c, toTriple(c), convert.hsl.hex, asHex),
    keyword: (c) => conv(c, c as any, convert.keyword.hex, asHex),
    named: (c) => c.hex,
    rgb: (c) => conv(c, toTriple(c), convert.rgb.hex as (r: RGB) => string, asHex),
    yiq: (c) => conv(c, toTriple(yiqToRGB(c)), convert.rgb.hex as (r: RGB) => string, asHex),
  })
}

export function toHSB(colour: AnyColour): HSBColour {
  return visitColourOrThrow<HSBColour>(colour, {
    cmyk: (c) => conv(c, toQuad(c), convert.cmyk.hsv, asHSB),
    hex: (c) => conv(c, c.slice(1), convert.hex.hsv, asHSB),
    hsb: (c) => c,
    hsl: (c) => conv(c, toTriple(c), convert.hsl.hsv, asHSB),
    keyword: (c) => conv(c, c as any, convert.keyword.hsv, asHSB),
    named: (c) => conv(c, c.hex.slice(1), convert.hex.hsv, asHSB),
    rgb: (c) => conv(c, toTriple(c), convert.rgb.hsv as (r: RGB) => ColourTriple, asHSB),
    yiq: (c) => conv(c, toTriple(yiqToRGB(c)), convert.rgb.hsv as (r: RGB) => ColourTriple, asHSB),
  })
}

export function toHSL(colour: AnyColour): HSLColour {
  return visitColourOrThrow<HSLColour>(colour, {
    cmyk: (c) => conv(c, toQuad(c), convert.cmyk.hsl, asHSL),
    hex: (c) => conv(c, c.slice(1), convert.hex.hsl, asHSL),
    hsb: (c) => conv(c, toTriple(c), convert.hsv.hsl, asHSL),
    hsl: (c) => c,
    keyword: (c) => conv(c, c as any, convert.keyword.hsl, asHSL),
    named: (c) => conv(c, c.hex.slice(1), convert.hex.hsl, asHSL),
    rgb: (c) => conv(c, toTriple(c), convert.rgb.hsl as (r: RGB) => ColourTriple, asHSL),
    yiq: (c) => conv(c, toTriple(yiqToRGB(c)), convert.rgb.hsl as (r: RGB) => ColourTriple, asHSL),
  })
}

export function toKeyword(colour: AnyColour): KeywordColour {
  return visitColourOrThrow<KeywordColour>(colour, {
    cmyk: (c) => conv(c, toQuad(c), convert.cmyk.keyword, asKeyword),
    hex: (c) => conv(c, c.slice(1), convert.hex.keyword, asKeyword),
    hsb: (c) => conv(c, toTriple(c), convert.hsv.keyword, asKeyword),
    hsl: (c) => conv(c, toTriple(c), convert.hsl.keyword, asKeyword),
    keyword: (c) => c,
    named: (c) => conv(c, c.hex.slice(1), convert.hex.keyword, asKeyword),
    rgb: (c) => conv(c, toTriple(c), convert.rgb.keyword as (r: RGB) => string, asKeyword),
    yiq: (c) => conv(c, toTriple(yiqToRGB(c)), convert.rgb.keyword as (r: RGB) => string, asKeyword),
  })
}

export function toNamed(colour: AnyColour, name: string): NamedColour {
  if (isNamed(colour)) return colour
  return {
    name,
    hex: toHex(colour),
  }
}

export async function toNamedLookup(colour: AnyColour, lookup: ColourNameLookup): Promise<NamedColour> {
  const hex = toHex(colour)
  const name = await lookup(hex)
  return { name, hex }
}

export function toRGB(colour: AnyColour): RGBColour {
  return visitColourOrThrow<RGBColour>(colour, {
    cmyk: (c) => conv(c, toQuad(c), convert.cmyk.rgb, asRGB),
    hex: (c) => conv(c, c.slice(1), convert.hex.rgb, asRGB),
    hsb: (c) => conv(c, toTriple(c), convert.hsv.rgb, asRGB),
    hsl: (c) => conv(c, toTriple(c), convert.hsl.rgb, asRGB),
    keyword: (c) => conv(c, c as any, convert.keyword.rgb, asRGB),
    named: (c) => conv(c, c.hex.slice(1), convert.hex.rgb, asRGB),
    rgb: (c) => c,
    yiq: (c) => yiqToRGB(c),
  })
}

export function toYIQ(colour: AnyColour): YIQColour {
  if (isYIQ(colour)) return colour
  return rgbToYIQ(toRGB(colour))
}

export function toCssColour(colour: AnyColour): string {
  // use a keyword if it's an exact match
  if (floatEquals(getAlpha(colour) ?? 1, 0)) return 'transparent'
  const hex: HexColour = toHex(colour)
  const keyword: KeywordColour = toKeyword(colour)
  if (toHex(keyword) === hex) return keyword

  // use the simplest css formatting possible
  return visitColourOrThrow<string>(colour, {
    cmyk: (c) => toCssColour(toRGB(c)),
    hex: (c) => c,
    hsb: (c) => toCssColour(toHSL(c)),
    hsl: (c) =>
      c.a !== undefined
        ? `hsla(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${c.l.toFixed(1)}%, ${c.a.toFixed(1)}%)`
        : `hsl(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${c.l.toFixed(1)}%)`,
    keyword: (c) => c,
    named: (c) => c.hex,
    rgb: (c) => toHex(c),
    yiq: (c) => toHex(c),
  })
}

/**
 * Choose the most visually contrasting colour compared with the base colour.
 *
 * This algorithm uses the relative luminance values of a color in the YIQ colour space
 * to determine its contrast against another colour.
 *
 * If one or fewer options are provided, 'white' and 'black' are included as options.
 *
 * @param baseColour      the colour against which to contrast
 * @param colourOptions   the colours from which to choose the most contrasting option
 */
export function mostContrasting(baseColour: AnyColour, ...colourOptions: AnyColour[]): AnyColour {
  const otherColours = colourOptions.length <= 1 ? [...colourOptions, 'white', 'black'] : [...colourOptions]
  // N.B. this function ignores alpha values when choosing the most contrasting colour
  const baseY = toYIQ(baseColour).y
  const diffs = otherColours.map((c) => Math.abs(toYIQ(c).y - baseY))
  const maxDiffIdx = diffs.indexOf(Math.max(...diffs))
  if (maxDiffIdx < 0 || maxDiffIdx >= otherColours.length) throw new Error('index out of bounds; should never happen')
  return otherColours[maxDiffIdx]
}
