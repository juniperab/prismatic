import {HSLColor, RGBColor} from "react-color";
import convert from "color-convert";

// N.B. using the American spelling for these for consistency with the types from react-color
export interface HSBColor {
    a?: number | undefined;
    h: number;
    s: number;
    b: number;
}
export type HexColor = string;
export type AnyColor = RGBColor | HSLColor | HSBColor | HexColor

type ColourTriple = [number, number, number]

export function isRGB(colour: AnyColor): colour is RGBColor {
    const rgb = colour as RGBColor
    return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}

export function isHSL(colour: AnyColor): colour is HSLColor {
    const hsl = colour as HSLColor
    return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}

export function isHSB(colour: AnyColor): colour is HSBColor {
    const hsb = colour as HSBColor
    return hsb.h !== undefined && hsb.s !== undefined && hsb.b !== undefined
}

export function isHex(colour: AnyColor): colour is HexColor {
    const hex = colour as HexColor
    return hex.length === 7 && hex.charAt(0) === '#' && hex.toUpperCase() === hex
}

function toTriple(colour: AnyColor): ColourTriple {
    if (isRGB(colour)) {
        return [colour.r, colour.g, colour.b]
    } else if (isHSL(colour)) {
        return [colour.h, colour.s, colour.l]
    } else if (isHSB(colour)) {
        return [colour.h, colour.s, colour.b]
    }
    throw new Error("invalid colour type")
}

function asRGB(colour: ColourTriple): RGBColor {
    return {r: colour[0], g: colour[1], b: colour[2]}
}

function asHSL(colour: ColourTriple): HSLColor {
    return {h: colour[0], s: colour[1], l: colour[2]}
}

function asHSB(colour: ColourTriple): HSBColor {
    return {h: colour[0], s: colour[1], b: colour[2]}
}

function asHex(colour: string): HexColor {
    return `#${colour.toUpperCase()}`
}

export function toRGB(colour: AnyColor): RGBColor {
    if (isRGB(colour)) {
        return colour
    } else if (isHSL(colour)) {
        return asRGB(convert.hsl.rgb(toTriple(colour)))
    } else if (isHSB(colour)) {
        return asRGB(convert.hsv.rgb(toTriple(colour)))
    } else if (isHex(colour)) {
        return asRGB(convert.hex.rgb(colour.slice(1)))
    }
    throw new Error("invalid colour type")
}

export function toHSL(colour: AnyColor): HSLColor {
    if (isRGB(colour)) {
        return asHSL(convert.rgb.hsl(toTriple(colour)))
    } else if (isHSL(colour)) {
        return colour
    } else if (isHSB(colour)) {
        return asHSL(convert.hsv.hsl(toTriple(colour)))
    } else if (isHex(colour)) {
        return asHSL(convert.hex.hsl(colour.slice(1)))
    }
    throw new Error("invalid colour type")
}

export function toHSB(colour: AnyColor): HSBColor {
    if (isRGB(colour)) {
        return asHSB(convert.rgb.hsv(toTriple(colour)))
    } else if (isHSL(colour)) {
        return asHSB(convert.hsl.hsv(toTriple(colour)))
    } else if (isHSB(colour)) {
        return colour
    } else if (isHex(colour)) {
        return asHSB(convert.hex.hsv(colour.slice(1)))
    }
    throw new Error("invalid colour type")
}

export function toHex(colour: AnyColor): string {
    if (isRGB(colour)) {
        return asHex(convert.rgb.hex(toTriple(colour)))
    } else if (isHSL(colour)) {
        return asHex(convert.hsl.hex(toTriple(colour)))
    } else if (isHSB(colour)) {
        return asHex(convert.hsv.hex(toTriple(colour)))
    }  else if (isHex(colour)) {
        return colour
    }
    throw new Error("invalid colour type")
}

export function toKeyword(colour: AnyColor): string {
    if (isRGB(colour)) {
        return convert.rgb.keyword(toTriple(colour))
    } else if (isHSL(colour)) {
        return convert.hsl.keyword(toTriple(colour))
    } else if (isHSB(colour)) {
        return convert.hsv.keyword(toTriple(colour))
    }  else if (isHex(colour)) {
        return convert.hex.keyword(colour.slice(1))
    }
    throw new Error("invalid colour type")
}

export function fromKeyword(keyword: string): AnyColor {
    return asRGB(convert.keyword.rgb(keyword as any))
}
