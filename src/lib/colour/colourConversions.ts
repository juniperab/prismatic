import convert from 'color-convert'
import { euclideanDistance } from '../math/math'
import {
  AnyColour,
  CMYKColour,
  HexColour,
  HSBColour,
  HSLColour,
  NamedColour,
  RGBColour,
  visitColourOrThrow,
} from './colours'

type ColourTriple = [number, number, number]
type ColourQuad = [number, number, number, number]

export function isRGB(colour: any): colour is RGBColour {
  const rgb = colour as RGBColour
  return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}

export function isHSL(colour: any): colour is HSLColour {
  const hsl = colour as HSLColour
  return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}

export function isHSB(colour: any): colour is HSBColour {
  const hsb = colour as HSBColour
  return hsb.h !== undefined && hsb.s !== undefined && hsb.b !== undefined
}

export function isCMYK(colour: any): colour is CMYKColour {
  const cmyk = colour as CMYKColour
  return cmyk.c !== undefined && cmyk.m !== undefined && cmyk.y !== undefined && cmyk.k !== undefined
}

export function isHex(colour: any): colour is HexColour {
  const hex = colour as HexColour
  return (hex.length === 7 || hex.length === 9) && hex.charAt(0) === '#' && hex.toUpperCase() === hex
}

export function isNamed(colour: any): colour is NamedColour {
  const named = colour as NamedColour
  return !isHex(colour) && named.length > 0 && named === named.toLowerCase()
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
  } else if (isNamed(colour)) {
    throw new Error('cannot convert named colour to vector')
  }
  throw new Error('invalid colour type')
}

function asRGB(colour: ColourTriple): RGBColour {
  return { r: colour[0], g: colour[1], b: colour[2] }
}

function asHSL(colour: ColourTriple): HSLColour {
  return { h: colour[0], s: colour[1], l: colour[2] }
}

function asHSB(colour: ColourTriple): HSBColour {
  return { h: colour[0], s: colour[1], b: colour[2] }
}

function asCMYK(colour: ColourQuad): CMYKColour {
  return { c: colour[0], m: colour[1], y: colour[2], k: colour[3] }
}

function asHex(colour: string): HexColour {
  return `#${colour.toUpperCase()}`
}

function asNamed(colour: string): NamedColour {
  return colour.toLowerCase()
}

function getHexAlpha(colour: HexColour): number | undefined {
  if (colour.length !== 9) {
    return undefined
  }
  return (parseInt(colour.slice(-2), 16) / 255) * 100
}

function getNamedAlpha(_: NamedColour): number | undefined {
  return undefined
}

function rgbWithAlpha(colour: RGBColour, alpha: number | undefined): RGBColour {
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

function hsbWithAlpha(colour: HSBColour, alpha: number | undefined): HSBColour {
  return {
    ...colour,
    a: alpha,
  }
}

function cmykWithAlpha(colour: CMYKColour, alpha: number | undefined): CMYKColour {
  return {
    ...colour,
    a: alpha,
  }
}

function hexWithAlpha(colour: HexColour, alpha: number | undefined): HexColour {
  const hexWithoutAlpha = colour.slice(0, 7)
  if (alpha === undefined) return asHex(hexWithoutAlpha)
  const alphaString = Math.round((alpha * 255) / 100).toString(16)
  return asHex(`${hexWithoutAlpha}${alphaString}`)
}

function namedWithAlpha(colour: NamedColour, _: number | undefined): NamedColour {
  // cannot specify alpha for a named colour
  return colour
}

export function withAlpha(colour: AnyColour, alpha?: number): AnyColour {
  return visitColourOrThrow<AnyColour>(colour, {
    cmyk: (c) => cmykWithAlpha(c, alpha),
    hex: (c) => hexWithAlpha(c, alpha),
    hsb: (c) => hsbWithAlpha(c, alpha),
    hsl: (c) => hslWithAlpha(c, alpha),
    named: (c) => rgbWithAlpha(toRGB(c), alpha),
    rgb: (c) => rgbWithAlpha(c, alpha),
  })
}

export function toRGB(colour: AnyColour): RGBColour {
  return visitColourOrThrow<RGBColour>(colour, {
    cmyk: (c) => rgbWithAlpha(asRGB(convert.cmyk.rgb(toQuad(c))), c.a),
    hex: (c) => rgbWithAlpha(asRGB(convert.hex.rgb(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => rgbWithAlpha(asRGB(convert.hsv.rgb(toTriple(c))), c.a),
    hsl: (c) => rgbWithAlpha(asRGB(convert.hsl.rgb(toTriple(c))), c.a),
    named: (c) => rgbWithAlpha(asRGB(convert.keyword.rgb(c as any)), getNamedAlpha(c)),
    rgb: (c) => c,
  })
}

export function toHSL(colour: AnyColour): HSLColour {
  return visitColourOrThrow<HSLColour>(colour, {
    cmyk: (c) => hslWithAlpha(asHSL(convert.cmyk.hsl(toQuad(c))), c.a),
    hex: (c) => hslWithAlpha(asHSL(convert.hex.hsl(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => hslWithAlpha(asHSL(convert.hsv.hsl(toTriple(c))), c.a),
    hsl: (c) => c,
    named: (c) => hslWithAlpha(asHSL(convert.keyword.hsl(c as any)), getNamedAlpha(c)),
    rgb: (c) => hslWithAlpha(asHSL(convert.rgb.hsl(toTriple(c))), c.a),
  })
}

export function toHSB(colour: AnyColour): HSBColour {
  return visitColourOrThrow<HSBColour>(colour, {
    cmyk: (c) => hsbWithAlpha(asHSB(convert.cmyk.hsv(toQuad(c))), c.a),
    hex: (c) => hsbWithAlpha(asHSB(convert.hex.hsv(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => c,
    hsl: (c) => hsbWithAlpha(asHSB(convert.hsl.hsv(toTriple(c))), c.a),
    named: (c) => hsbWithAlpha(asHSB(convert.keyword.hsv(c as any)), getNamedAlpha(c)),
    rgb: (c) => hsbWithAlpha(asHSB(convert.rgb.hsv(toTriple(c))), c.a),
  })
}

export function toCMYK(colour: AnyColour): CMYKColour {
  return visitColourOrThrow<CMYKColour>(colour, {
    cmyk: (c) => c,
    hex: (c) => cmykWithAlpha(asCMYK(convert.hex.cmyk(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => cmykWithAlpha(asCMYK(convert.hsv.cmyk(toTriple(c))), c.a),
    hsl: (c) => cmykWithAlpha(asCMYK(convert.hsl.cmyk(toTriple(c))), c.a),
    named: (c) => cmykWithAlpha(asCMYK(convert.keyword.cmyk(c as any)), getNamedAlpha(c)),
    rgb: (c) => cmykWithAlpha(asCMYK(convert.rgb.cmyk(toTriple(c))), c.a),
  })
}

export function toHex(colour: AnyColour): HexColour {
  return visitColourOrThrow<HexColour>(colour, {
    cmyk: (c) => hexWithAlpha(asHex(convert.cmyk.hex(toQuad(c))), c.a),
    hex: (c) => c,
    hsb: (c) => hexWithAlpha(asHex(convert.hsv.hex(toTriple(c))), c.a),
    hsl: (c) => hexWithAlpha(asHex(convert.hsl.hex(toTriple(c))), c.a),
    named: (c) => hexWithAlpha(asHex(convert.keyword.hex(c as any)), getNamedAlpha(c)),
    rgb: (c) => hexWithAlpha(asHex(convert.rgb.hex(toTriple(c))), c.a),
  })
}

export function toNamed(colour: AnyColour): NamedColour {
  return visitColourOrThrow<NamedColour>(colour, {
    cmyk: (c) => namedWithAlpha(asNamed(convert.cmyk.keyword(toQuad(c))), c.a),
    hex: (c) => namedWithAlpha(asNamed(convert.hex.keyword(c.slice(1))), getHexAlpha(c)),
    hsb: (c) => namedWithAlpha(asNamed(convert.hsv.keyword(toTriple(c))), c.a),
    hsl: (c) => namedWithAlpha(asNamed(convert.hsl.keyword(toTriple(c))), c.a),
    named: (c) => c,
    rgb: (c) => namedWithAlpha(asNamed(convert.rgb.keyword(toTriple(c))), c.a),
  })
}

export function toCssColour(colour: AnyColour): string {
  return visitColourOrThrow<string>(colour, {
    cmyk: (c) => toCssColour(toRGB(c)),
    hex: (c) => c,
    hsb: (c) => toCssColour(toHSL(c)),
    hsl: (c) =>
      c.a !== undefined
        ? `hsla(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${c.l.toFixed(1)}%, ${c.a.toFixed(1)}%)`
        : `hsl(${c.h.toFixed(1)}, ${c.s.toFixed(1)}%, ${c.l.toFixed(1)}%)`,
    named: (c) => c,
    rgb: (c) =>
      c.a !== undefined
        ? `rgba(${c.r.toFixed(1)}, ${c.g.toFixed(1)}, ${c.b.toFixed(1)}, ${c.a.toFixed(1)}%)`
        : `rgb(${c.r.toFixed(1)}, ${c.g.toFixed(1)}, ${c.b.toFixed(1)})`,
  })
}

export function mostContrasting(baseColour: AnyColour, ...otherColours: AnyColour[]): AnyColour {
  const baseColourHSBQuad = toQuad(toHSB(baseColour))
  const distances = otherColours
    .map((c) => toQuad(toHSB(c)))
    .map((cQuad) => euclideanDistance(baseColourHSBQuad, cQuad))
  const maxDistanceIdx = distances.indexOf(Math.max(...distances))
  if (maxDistanceIdx < 0 || maxDistanceIdx >= otherColours.length) throw new Error('index out of bounds')
  return otherColours[maxDistanceIdx]
}
