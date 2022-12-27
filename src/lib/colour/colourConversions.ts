import { HSLColor, RGBColor } from 'react-color'
import convert from 'color-convert'
import { euclideanDistance } from '../math/math'
import { CMYK } from "color-convert/conversions";

// N.B. using the American spelling for these for consistency with the types from react-color
export interface HSBColor {
  a?: number | undefined
  h: number
  s: number
  b: number
}
export interface CMYKColor {
  a?: number | undefined
  c: number
  m: number
  y: number
  k: number
}
export type HexColor = string
export type NamedColor = string
export type AnyColor = RGBColor | HSLColor | HSBColor | CMYKColor | HexColor | NamedColor

type ColourTriple = [number, number, number]
type ColourQuad = [number, number, number, number]
type ColourQuint = [number, number, number, number, number]

export function isRGB(colour: any): colour is RGBColor {
  const rgb = colour as RGBColor
  return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}

export function isHSL(colour: any): colour is HSLColor {
  const hsl = colour as HSLColor
  return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}

export function isHSB(colour: any): colour is HSBColor {
  const hsb = colour as HSBColor
  return hsb.h !== undefined && hsb.s !== undefined && hsb.b !== undefined
}

export function isCMYK(colour: any): colour is CMYKColor {
  const cmyk = colour as CMYKColor
  return cmyk.c !== undefined && cmyk.m !== undefined && cmyk.y !== undefined && cmyk.k !== undefined
}

export function isHex(colour: any): colour is HexColor {
  const hex = colour as HexColor
  return (hex.length === 7 || hex.length === 9) && hex.charAt(0) === '#' && hex.toUpperCase() === hex
}

export function isNamed(colour: any): colour is NamedColor {
  const named = colour as NamedColor
  return !isHex(colour) && named.length > 0 && named === named.toLowerCase()
}

function toTriple(colour: AnyColor): ColourTriple {
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
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  }
  throw new Error('invalid colour type')
}

function toQuad(colour: AnyColor): ColourQuad {
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
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  }
  throw new Error('invalid colour type')
}

function toQuint(colour: AnyColor): ColourQuint {
  if (isRGB(colour)) {
    throw new Error('cannot convert RGB colour to five-element vector')
  } else if (isHSL(colour)) {
    throw new Error('cannot convert HSL colour to five-element vector')
  } else if (isHSB(colour)) {
    throw new Error('cannot convert HSB colour to five-element vector')
  } else if (isCMYK(colour)) {
    return [colour.c, colour.m, colour.y, colour.k, colour.a !== undefined ? colour.a : 100]
  } else if (isHex(colour)) {
    throw new Error('cannot convert Hex colour to five-element vector')
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  }
  throw new Error('invalid colour type')
}

function asRGB(colour: ColourTriple): RGBColor {
  return { r: colour[0], g: colour[1], b: colour[2] }
}

function asHSL(colour: ColourTriple): HSLColor {
  return { h: colour[0], s: colour[1], l: colour[2] }
}

function asHSB(colour: ColourTriple): HSBColor {
  return { h: colour[0], s: colour[1], b: colour[2] }
}

function asCMYK(colour: ColourQuad): CMYKColor {
  return { c: colour[0], m: colour[1], y: colour[2], k: colour[3] }
}

function asHex(colour: string): HexColor {
  return `#${colour.toUpperCase()}`
}

function asNamed(colour: string): NamedColor {
  return colour.toLowerCase()
}

function getHexAlpha(colour: HexColor): number | undefined {
  if (colour.length !== 9) {
    return undefined
  }
  return (parseInt(colour.slice(-2), 16) / 255) * 100
}

function getNamedAlpha(_: NamedColor): number | undefined {
  return undefined
}

function rgbWithAlpha(colour: RGBColor, alpha: number | undefined): RGBColor {
  return {
    ...colour,
    a: alpha,
  }
}

function hslWithAlpha(colour: HSLColor, alpha: number | undefined): HSLColor {
  return {
    ...colour,
    a: alpha,
  }
}

function hsbWithAlpha(colour: HSBColor, alpha: number | undefined): HSBColor {
  return {
    ...colour,
    a: alpha,
  }
}

function cmykWithAlpha(colour: CMYKColor, alpha: number | undefined): CMYKColor {
  return {
    ...colour,
    a: alpha,
  }
}

function hexWithAlpha(colour: HexColor, alpha: number | undefined): HexColor {
  const hexWithoutAlpha = colour.slice(0, 7)
  if (alpha === undefined) return asHex(hexWithoutAlpha)
  const alphaString = Math.round((alpha * 255) / 100).toString(16)
  return asHex(`${hexWithoutAlpha}${alphaString}`)
}

function namedWithAlpha(colour: NamedColor, _: number | undefined): NamedColor {
  // cannot specify alpha for a named colour
  return colour
}

export function withAlpha(colour: AnyColor, alpha: number | undefined): AnyColor {
  if (isRGB(colour)) {
    return rgbWithAlpha(colour, alpha)
  } else if (isHSL(colour)) {
    return hslWithAlpha(colour, alpha)
  } else if (isHSB(colour)) {
    return hsbWithAlpha(colour, alpha)
  } else if (isCMYK(colour)) {
    return cmykWithAlpha(colour, alpha)
  } else if (isHex(colour)) {
    return hexWithAlpha(colour, alpha)
  } else if (isNamed(colour)) {
    return hexWithAlpha(toHex(colour), alpha)
  }
  throw new Error('invalid colour type')
}

export function toRGB(colour: AnyColor): RGBColor {
  if (isRGB(colour)) {
    return colour
  } else if (isHSL(colour)) {
    return rgbWithAlpha(asRGB(convert.hsl.rgb(toTriple(colour))), colour.a)
  } else if (isHSB(colour)) {
    return rgbWithAlpha(asRGB(convert.hsv.rgb(toTriple(colour))), colour.a)
  } else if (isCMYK(colour)) {
    return rgbWithAlpha(asRGB(convert.cmyk.rgb(toQuad(colour))), colour.a)
  } else if (isHex(colour)) {
    return rgbWithAlpha(asRGB(convert.hex.rgb(colour.slice(1))), getHexAlpha(colour))
  } else if (isNamed(colour)) {
    return rgbWithAlpha(asRGB(convert.keyword.rgb(colour)), getNamedAlpha(colour))
  }
  throw new Error('invalid colour type')
}

export function toHSL(colour: AnyColor): HSLColor {
  if (isRGB(colour)) {
    return hslWithAlpha(asHSL(convert.rgb.hsl(toTriple(colour))), colour.a)
  } else if (isHSL(colour)) {
    return colour
  } else if (isHSB(colour)) {
    return hslWithAlpha(asHSL(convert.hsv.hsl(toTriple(colour))), colour.a)
  } else if (isCMYK(colour)) {
    return hslWithAlpha(asHSL(convert.cmyk.hsl(toQuad(colour))), colour.a)
  } else if (isHex(colour)) {
    return hslWithAlpha(asHSL(convert.hex.hsl(colour.slice(1))), getHexAlpha(colour))
  } else if (isNamed(colour)) {
    return hslWithAlpha(asHSL(convert.keyword.hsl(colour)), getNamedAlpha(colour))
  }
  throw new Error('invalid colour type')
}

export function toHSB(colour: AnyColor): HSBColor {
  if (isRGB(colour)) {
    return hsbWithAlpha(asHSB(convert.rgb.hsv(toTriple(colour))), colour.a)
  } else if (isHSL(colour)) {
    return hsbWithAlpha(asHSB(convert.hsl.hsv(toTriple(colour))), colour.a)
  } else if (isHSB(colour)) {
    return colour
  } else if (isCMYK(colour)) {
    return hsbWithAlpha(asHSB(convert.cmyk.hsv(toQuad(colour))), colour.a)
  } else if (isHex(colour)) {
    return hsbWithAlpha(asHSB(convert.hex.hsv(colour.slice(1))), getHexAlpha(colour))
  } else if (isNamed(colour)) {
    return hsbWithAlpha(asHSB(convert.keyword.hsv(colour)), getNamedAlpha(colour))
  }
  throw new Error('invalid colour type')
}

export function toCMYK(colour: AnyColor): CMYKColor {
  if (isRGB(colour)) {
    return cmykWithAlpha(asCMYK(convert.rgb.cmyk(toTriple(colour))), colour.a)
  } else if (isHSL(colour)) {
    return cmykWithAlpha(asCMYK(convert.hsl.cmyk(toTriple(colour))), colour.a)
  } else if (isHSB(colour)) {
    return cmykWithAlpha(asCMYK(convert.hsv.cmyk(toTriple(colour))), colour.a)
  } else if (isCMYK(colour)) {
    return colour
  } else if (isHex(colour)) {
    return cmykWithAlpha(asCMYK(convert.hex.cmyk(colour.slice(1))), getHexAlpha(colour))
  } else if (isNamed(colour)) {
    return cmykWithAlpha(asCMYK(convert.keyword.cmyk(colour)), getNamedAlpha(colour))
  }
  throw new Error('invalid colour type')
}

export function toHex(colour: AnyColor): HexColor {
  if (isRGB(colour)) {
    return hexWithAlpha(asHex(convert.rgb.hex(toTriple(colour))), colour.a)
  } else if (isHSL(colour)) {
    return hexWithAlpha(asHex(convert.hsl.hex(toTriple(colour))), colour.a)
  } else if (isHSB(colour)) {
    return hexWithAlpha(asHex(convert.hsv.hex(toTriple(colour))), colour.a)
  } else if (isCMYK(colour)) {
    return hexWithAlpha(asHex(convert.cmyk.hex(toQuad(colour))), colour.a)
  } else if (isHex(colour)) {
    return colour
  } else if (isNamed(colour)) {
    return hexWithAlpha(asHex(convert.keyword.hex(colour)), getNamedAlpha(colour))
  }
  throw new Error('invalid colour type')
}

export function toNamed(colour: AnyColor): NamedColor {
  if (isRGB(colour)) {
    return namedWithAlpha(asNamed(convert.rgb.keyword(toTriple(colour))), colour.a)
  } else if (isHSL(colour)) {
    return namedWithAlpha(asNamed(convert.hsl.keyword(toTriple(colour))), colour.a)
  } else if (isHSB(colour)) {
    return namedWithAlpha(asNamed(convert.hsv.keyword(toTriple(colour))), colour.a)
  } else if (isCMYK(colour)) {
    return namedWithAlpha(asNamed(convert.cmyk.keyword(toQuad(colour))), colour.a)
  } else if (isHex(colour)) {
    return namedWithAlpha(asNamed(convert.hex.keyword(colour.slice(1))), getHexAlpha(colour))
  } else if (isNamed(colour)) {
    return colour
  }
  throw new Error('invalid colour type')
}

export function toCssColour(colour: AnyColor): string {
  if (isRGB(colour)) {
    if (colour.a !== undefined) return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a}%)`
    return `rgb(${colour.r}, ${colour.g}, ${colour.b})`
  } else if (isHSL(colour)) {
    if (colour.a !== undefined) return `hsla(${colour.h}, ${colour.s}%, ${colour.l}%, ${colour.a}%)`
    return `hsl(${colour.h}, ${colour.s}%, ${colour.l}%)`
  } else if (isHSB(colour)) {
    return toCssColour(toHSL(colour))
  } else if (isCMYK(colour)) {
    return toCssColour(toRGB(colour))
  } else if (isHex(colour)) {
    return colour
  } else if (isNamed(colour)) {
    return colour
  }
  throw new Error('invalid colour type')
}

export function chooseMostContrastingColour(baseColour: AnyColor, ...otherColours: AnyColor[]): AnyColor {
  const baseColourHSBQuad = toQuad(toHSB(baseColour))
  const distances = otherColours
    .map((c) => toQuad(toHSB(c)))
    .map((cQuad) => euclideanDistance(baseColourHSBQuad, cQuad))
  const maxDistanceIdx = distances.indexOf(Math.max(...distances))
  if (maxDistanceIdx < 0 || maxDistanceIdx >= otherColours.length) throw new Error('index out of bounds')
  return otherColours[maxDistanceIdx]
}
