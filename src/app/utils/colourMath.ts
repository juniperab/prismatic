import {HSLColor, RGBColor} from "react-color";
import convert from "color-convert";

// N.B. using the American spelling for these for consistency with the types from react-color
export interface HSVColor {
    a?: number | undefined;
    h: number;
    s: number;
    v: number;
}
export type HexColor = string;
export type AnyColor = RGBColor | HSLColor | HSVColor | HexColor

type ColourTriple = [number, number, number]

function isRGB(colour: AnyColor): colour is RGBColor {
    const rgb = colour as RGBColor
    return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}

function isHSL(colour: AnyColor): colour is HSLColor {
    const hsl = colour as HSLColor
    return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}

function isHSV(colour: AnyColor): colour is HSVColor {
    const hsv = colour as HSVColor
    return hsv.h !== undefined && hsv.s !== undefined && hsv.v !== undefined
}

function isHex(colour: AnyColor): colour is HexColor {
    const hex = colour as HexColor
    return hex.length === 7 && hex.charAt(0) === '#' && hex.toUpperCase() === hex
}

function to3(colour: AnyColor): ColourTriple {
    if (isRGB(colour)) {
        return [colour.r, colour.g, colour.b]
    } else if (isHSL(colour)) {
        return [colour.h, colour.s, colour.l]
    } else if (isHSV(colour)) {
        return [colour.h, colour.s, colour.v]
    }
    throw new Error("invalid colour type")
}

function asRGB(colour: ColourTriple): RGBColor {
    return {r: colour[0], g: colour[1], b: colour[2]}
}

function asHSL(colour: ColourTriple): HSLColor {
    return {h: colour[0], s: colour[1], l: colour[2]}
}

function asHSV(colour: ColourTriple): HSVColor {
    return {h: colour[0], s: colour[1], v: colour[2]}
}

function asHex(colour: string): HexColor {
    return `#${colour.toUpperCase()}`
}

export function toRGB(colour: AnyColor): RGBColor {
    if (isRGB(colour)) {
        return colour
    } else if (isHSL(colour)) {
        return asRGB(convert.hsl.rgb(to3(colour)))
    } else if (isHSV(colour)) {
        return asRGB(convert.hsv.rgb(to3(colour)))
    } else if (isHex(colour)) {
        return asRGB(convert.hex.rgb(colour.slice(1)))
    }
    throw new Error("invalid colour type")
}

export function toHSL(colour: AnyColor): HSLColor {
    if (isRGB(colour)) {
        return asHSL(convert.rgb.hsl(to3(colour)))
    } else if (isHSL(colour)) {
        return colour
    } else if (isHSV(colour)) {
        return asHSL(convert.hsv.hsl(to3(colour)))
    } else if (isHex(colour)) {
        return asHSL(convert.hex.hsl(colour.slice(1)))
    }
    throw new Error("invalid colour type")
}

export function toHSV(colour: AnyColor): HSVColor {
    if (isRGB(colour)) {
        return asHSV(convert.rgb.hsv(to3(colour)))
    } else if (isHSL(colour)) {
        return asHSV(convert.hsl.hsv(to3(colour)))
    } else if (isHSV(colour)) {
        return colour
    } else if (isHex(colour)) {
        return asHSV(convert.hex.hsv(colour.slice(1)))
    }
    throw new Error("invalid colour type")
}

export function toHex(colour: AnyColor): string {
    if (isRGB(colour)) {
        return asHex(convert.rgb.hex(to3(colour)))
    } else if (isHSL(colour)) {
        return asHex(convert.hsl.hex(to3(colour)))
    } else if (isHSV(colour)) {
        return asHex(convert.hsv.hex(to3(colour)))
    }  else if (isHex(colour)) {
        return colour
    }
    throw new Error("invalid colour type")
}

/**
 * Rotate a hue around the colour wheel by some number of degrees. The result will be in [0, 360).
 *
 * @param hue           the original hue
 * @param degrees       the number of degrees to rotate (may be positive or negative)
 */
export function rotateHue(hue: number, degrees: number): number {
    let newHue = (hue + degrees) % 360
    while (newHue < 0) newHue += 360
    return newHue
}

/**
 * Return the number of degree needed to rotate from a to b.
 * The result will always be on [-180, 180]
 *
 * @param hues      the starting- and ending-point hues
 */
export function hueDiff(hues: {to: number, from: number}): number {
    // normalize the given hues onto [0, 360), just in case
    let diff = rotateHue(hues.to, 0) - rotateHue(hues.from, 0)
    while (diff > 180) diff -= 360
    while (diff < -180) diff += 360
    return diff
}
