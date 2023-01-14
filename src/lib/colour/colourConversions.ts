import convert from 'color-convert'
import {
  AnyColour,
  CMYKColour,
  HexColour,
  HSBColour,
  HSLColour,
  KeywordColour,
  NamedColour,
  RGBColour,
  visitColourOrThrow,
} from './colours'
import { floatEquals } from '../math/math'

type ColourTriple = [number, number, number]
type ColourQuad = [number, number, number, number]

export function isRGB(colour: any): colour is RGBColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const rgb = colour as RGBColour
  return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}

export function isHSL(colour: any): colour is HSLColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const hsl = colour as HSLColour
  return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}

export function isHSB(colour: any): colour is HSBColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const hsb = colour as HSBColour
  return hsb.h !== undefined && hsb.s !== undefined && hsb.b !== undefined
}

export function isCMYK(colour: any): colour is CMYKColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const cmyk = colour as CMYKColour
  return cmyk.c !== undefined && cmyk.m !== undefined && cmyk.y !== undefined && cmyk.k !== undefined
}

export function isHex(colour: any): colour is HexColour {
  if (colour === undefined || typeof colour !== 'string') return false
  return (colour.length === 7 || colour.length === 9) && colour.charAt(0) === '#' && colour.toUpperCase() === colour
}

export function isKeyword(colour: any): colour is KeywordColour {
  if (isHex(colour)) return false
  if (colour === undefined || typeof colour !== 'string') return false
  return colour.length > 0
}

export function isNamed(colour: any): colour is NamedColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const named = colour as NamedColour
  return named.name !== undefined && named.hex !== undefined && named.name.length > 0 && isHex(named.hex)
}

function toTriple(colour: AnyColour): ColourTriple {
  if (isRGB(colour)) {
    return [colour.r, colour.g, colour.b]
  } else if (isHSL(colour)) {
    return [colour.h, colour.s, colour.l]
  } else if (isHSB(colour)) {
    return [colour.h, colour.s, colour.b]
  } else if (isCMYK(colour)) {
    throw new Error('cannot convert CMYK colour to three-element vector')
  } else if (isHex(colour)) {
    return toTriple(toRGB(colour))
  } else if (isKeyword(colour)) {
    throw new Error('cannot convert keyword colour to vector')
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  }
  throw new Error('invalid colour type')
}

function toQuad(colour: AnyColour): ColourQuad {
  if (isRGB(colour)) {
    return [colour.r, colour.g, colour.b, colour.a !== undefined ? colour.a : 100]
  } else if (isHSL(colour)) {
    return [colour.h, colour.s, colour.l, colour.a !== undefined ? colour.a : 100]
  } else if (isHSB(colour)) {
    return [colour.h, colour.s, colour.b, colour.a !== undefined ? colour.a : 100]
  } else if (isCMYK(colour)) {
    return [colour.c, colour.m, colour.y, colour.k]
  } else if (isHex(colour)) {
    return toQuad(toRGB(colour))
  } else if (isKeyword(colour)) {
    throw new Error('cannot convert keyword colour to vector')
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
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

function getHexAlpha(colour: HexColour): number | undefined {
  if (colour.length !== 9) {
    return undefined
  }
  return (parseInt(colour.slice(-2), 16) / 255) * 100
}

function getKeywordAlpha(_: KeywordColour): number | undefined {
  return undefined
}

function getNamedAlpha(colour: NamedColour): number | undefined {
  return getHexAlpha(colour.hex)
}

export function getAlpha(colour: AnyColour): number | undefined {
  return visitColourOrThrow<number | undefined>(colour, {
    cmyk: (c) => c.a,
    hex: (c) => getHexAlpha(c),
    hsb: (c) => c.a,
    hsl: (c) => c.a,
    keyword: (_) => undefined,
    named: (c) => getNamedAlpha(c),
    rgb: (c) => c.a,
  })
}

function cmykWithAlpha(colour: CMYKColour, alpha: number | undefined): CMYKColour {
  return {
    ...colour,
    a: alpha,
  }
}

function hexWithAlpha(colour: HexColour, alpha: number | undefined): HexColour {
  const hexWithoutAlpha = colour.slice(1, 7)
  if (alpha === undefined) return asHex(hexWithoutAlpha)
  const alphaString = Math.round((alpha * 255) / 100).toString(16)
  return asHex(`${hexWithoutAlpha}${alphaString}`)
}

function hsbWithAlpha(colour: HSBColour, alpha: number | undefined): HSBColour {
  return {
    ...colour,
    a: alpha,
  }
}

function hslWithAlpha(colour: HSLColour, alpha: number | undefined): HSLColour {
  return {
    ...colour,
    a: alpha,
  }
}

function rgbWithAlpha(colour: RGBColour, alpha: number | undefined): RGBColour {
  return {
    ...colour,
    a: alpha,
  }
}

function keywordWithAlpha(colour: KeywordColour, alpha: number | undefined): KeywordColour | HexColour {
  if (alpha === undefined) return colour
  return hexWithAlpha(toHex(colour), alpha) // cannot specify alpha for a named colour
}

function namedWithAlpha(colour: NamedColour, alpha: number | undefined): NamedColour {
  return {
    name: colour.name,
    hex: hexWithAlpha(colour.hex, alpha),
  }
}

export function withAlpha(colour: AnyColour, alpha?: number): AnyColour {
  return visitColourOrThrow<AnyColour>(colour, {
    cmyk: (c) => cmykWithAlpha(c, alpha),
    hex: (c) => hexWithAlpha(c, alpha),
    hsb: (c) => hsbWithAlpha(c, alpha),
    hsl: (c) => hslWithAlpha(c, alpha),
    keyword: (c) => keywordWithAlpha(c, alpha),
    named: (c) => namedWithAlpha(c, alpha),
    rgb: (c) => rgbWithAlpha(c, alpha),
  })
}

export function toCMYK(colour: AnyColour): CMYKColour {
  return visitColourOrThrow<CMYKColour>(colour, {
    cmyk: (c) => c,
    hex: (c) => cmykWithAlpha(asCMYK(convert.hex.cmyk(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => cmykWithAlpha(asCMYK(convert.hsv.cmyk(toTriple(c))), c.a),
    hsl: (c) => cmykWithAlpha(asCMYK(convert.hsl.cmyk(toTriple(c))), c.a),
    keyword: (c) => cmykWithAlpha(asCMYK(convert.keyword.cmyk(c as any)), getKeywordAlpha(c)),
    named: (c) => cmykWithAlpha(asCMYK(convert.hex.cmyk(c.hex.slice(1))), getNamedAlpha(c)),
    rgb: (c) => cmykWithAlpha(asCMYK(convert.rgb.cmyk(toTriple(c))), c.a),
  })
}

export function toHex(colour: AnyColour): HexColour {
  return visitColourOrThrow<HexColour>(colour, {
    cmyk: (c) => hexWithAlpha(asHex(convert.cmyk.hex(toQuad(c))), c.a),
    hex: (c) => c,
    hsb: (c) => hexWithAlpha(asHex(convert.hsv.hex(toTriple(c))), c.a),
    hsl: (c) => hexWithAlpha(asHex(convert.hsl.hex(toTriple(c))), c.a),
    keyword: (c) => hexWithAlpha(asHex(convert.keyword.hex(c as any)), getKeywordAlpha(c)),
    named: (c) => c.hex,
    rgb: (c) => hexWithAlpha(asHex(convert.rgb.hex(toTriple(c))), c.a),
  })
}

export function toHSB(colour: AnyColour): HSBColour {
  return visitColourOrThrow<HSBColour>(colour, {
    cmyk: (c) => hsbWithAlpha(asHSB(convert.cmyk.hsv(toQuad(c))), c.a),
    hex: (c) => hsbWithAlpha(asHSB(convert.hex.hsv(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => c,
    hsl: (c) => hsbWithAlpha(asHSB(convert.hsl.hsv(toTriple(c))), c.a),
    keyword: (c) => hsbWithAlpha(asHSB(convert.keyword.hsv(c as any)), getKeywordAlpha(c)),
    named: (c) => hsbWithAlpha(asHSB(convert.hex.hsv(c.hex.slice(1))), getNamedAlpha(c)),
    rgb: (c) => hsbWithAlpha(asHSB(convert.rgb.hsv(toTriple(c))), c.a),
  })
}

export function toHSL(colour: AnyColour): HSLColour {
  return visitColourOrThrow<HSLColour>(colour, {
    cmyk: (c) => hslWithAlpha(asHSL(convert.cmyk.hsl(toQuad(c))), c.a),
    hex: (c) => hslWithAlpha(asHSL(convert.hex.hsl(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => hslWithAlpha(asHSL(convert.hsv.hsl(toTriple(c))), c.a),
    hsl: (c) => c,
    keyword: (c) => hslWithAlpha(asHSL(convert.keyword.hsl(c as any)), getKeywordAlpha(c)),
    named: (c) => hslWithAlpha(asHSL(convert.hex.hsl(c.hex.slice(1))), getNamedAlpha(c)),
    rgb: (c) => hslWithAlpha(asHSL(convert.rgb.hsl(toTriple(c))), c.a),
  })
}

export function toKeyword(colour: AnyColour): KeywordColour {
  return visitColourOrThrow<KeywordColour>(colour, {
    cmyk: (c) => keywordWithAlpha(asKeyword(convert.cmyk.keyword(toQuad(c))), c.a),
    hex: (c) => keywordWithAlpha(asKeyword(convert.hex.keyword(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => keywordWithAlpha(asKeyword(convert.hsv.keyword(toTriple(c))), c.a),
    hsl: (c) => keywordWithAlpha(asKeyword(convert.hsl.keyword(toTriple(c))), c.a),
    keyword: (c) => c,
    named: (c) => keywordWithAlpha(asKeyword(convert.hex.keyword(c.hex.slice(1))), getNamedAlpha(c)),
    rgb: (c) => keywordWithAlpha(asKeyword(convert.rgb.keyword(toTriple(c))), c.a),
  })
}

export function toRGB(colour: AnyColour): RGBColour {
  return visitColourOrThrow<RGBColour>(colour, {
    cmyk: (c) => rgbWithAlpha(asRGB(convert.cmyk.rgb(toQuad(c))), c.a),
    hex: (c) => rgbWithAlpha(asRGB(convert.hex.rgb(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => rgbWithAlpha(asRGB(convert.hsv.rgb(toTriple(c))), c.a),
    hsl: (c) => rgbWithAlpha(asRGB(convert.hsl.rgb(toTriple(c))), c.a),
    keyword: (c) => rgbWithAlpha(asRGB(convert.keyword.rgb(c as any)), getKeywordAlpha(c)),
    named: (c) => rgbWithAlpha(asRGB(convert.hex.rgb(c.hex.slice(1))), getNamedAlpha(c)),
    rgb: (c) => c,
  })
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
  })
}

export function mostContrasting(baseColour: AnyColour, ...otherColours: AnyColour[]): AnyColour {
  // TODO: this is a hack; need a better algorithm
  const baseBrightness = toHSB(baseColour).b
  const diffBrightness = otherColours
    .map((c) => toHSB(c).b - baseBrightness)
    .map((diff) => (diff > 0 ? diff : diff / -2))
  const maxDiffBrightnessIdx = diffBrightness.indexOf(Math.max(...diffBrightness))
  if (maxDiffBrightnessIdx < 0 || maxDiffBrightnessIdx >= otherColours.length) throw new Error('index out of bounds')
  return otherColours[maxDiffBrightnessIdx]
}
