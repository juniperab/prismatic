import {HSLColor, RGBColor} from "react-color";
import convert from "color-convert";

export interface HSVColor {
    a?: number | undefined;
    h: number;
    s: number;
    v: number;
}

function isRGB(colour: any): colour is RGBColor {
    const rgb = colour as RGBColor
    return rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined
}

function isHSL(colour: any): colour is HSLColor {
    const hsl = colour as HSLColor
    return hsl.h !== undefined && hsl.s !== undefined && hsl.l !== undefined
}

function isHSV(colour: any): colour is HSVColor {
    const hsv = colour as HSVColor
    return hsv.h !== undefined && hsv.s !== undefined && hsv.v !== undefined
}

export function to3(colour: RGBColor | HSLColor | HSVColor): [number, number, number] {
    if (isRGB(colour)) {
        return [colour.r, colour.g, colour.b]
    } else if (isHSL(colour)) {
        return [colour.h, colour.s, colour.l]
    } else if (isHSV(colour)) {
        return [colour.h, colour.s, colour.v]
    }
    throw new Error("invalid colour type")
}

export function asRGB(colour: [number, number, number]): RGBColor {
    return {r: colour[0], g: colour[1], b: colour[2]}
}

export function asHSL(colour: [number, number, number]): HSLColor {
    return {h: colour[0], s: colour[1], l: colour[2]}
}

export function asHSV(colour: [number, number, number]): HSVColor {
    return {h: colour[0], s: colour[1], v: colour[2]}
}

export function asHex(colour: string): string {
    return `#${colour.toUpperCase()}`
}

export function toRGB(colour: RGBColor | HSLColor | HSVColor): RGBColor {
    if (isRGB(colour)) {
        return colour
    } else if (isHSL(colour)) {
        return asRGB(convert.hsl.rgb(to3(colour)))
    } else if (isHSV(colour)) {
        return asRGB(convert.hsv.rgb(to3(colour)))
    }
    throw new Error("invalid colour type")
}

export function toHSL(colour: RGBColor | HSLColor | HSVColor): HSLColor {
    if (isRGB(colour)) {
        return asHSL(convert.rgb.hsl(to3(colour)))
    } else if (isHSL(colour)) {
        return colour
    } else if (isHSV(colour)) {
        return asHSL(convert.hsv.hsl(to3(colour)))
    }
    throw new Error("invalid colour type")
}

export function toHSV(colour: RGBColor | HSLColor | HSVColor): HSVColor {
    if (isRGB(colour)) {
        return asHSV(convert.rgb.hsv(to3(colour)))
    } else if (isHSL(colour)) {
        return asHSV(convert.hsl.hsv(to3(colour)))
    } else if (isHSV(colour)) {
        return colour
    }
    throw new Error("invalid colour type")
}

export function toHex(colour: RGBColor | HSLColor | HSVColor): string {
    if (isRGB(colour)) {
        return asHex(convert.rgb.hex(to3(colour)))
    } else if (isHSL(colour)) {
        return asHex(convert.hsl.hex(to3(colour)))
    } else if (isHSV(colour)) {
        return asHex(convert.hsv.hex(to3(colour)))
    }
    throw new Error("invalid colour type")
}

// export function RGBToHSL(colour: RGBColor): HSLColor {
//     return asHSL(convert.rgb.hsl(to3(colour)))
// }
//
// export function RGBToHSV(colour: RGBColor): HSVColor {
//     return asHSV(convert.rgb.hsv(to3(colour)))
// }
//
// export function RGBToHex(colour: RGBColor): string {
//     return asHex(convert.rgb.hex(to3(colour)))
// }
//
// export function HSLToRGB(colour: HSLColor): RGBColor {
//     return asRGB(convert.hsl.rgb(to3(colour)))
// }
//
// export function HSLToHSV(colour: HSLColor): HSVColor {
//     return asHSV(convert.hsl.hsv(to3(colour)))
// }
//
// export function HSLToHex(colour: HSLColor): string {
//     return asHex(convert.hsl.hex(to3(colour)))
// }
//
// export function HSVToRGB(colour: HSVColor): RGBColor {
//     return asRGB(convert.hsv.rgb(to3(colour)))
// }
//
// export function HSVToHSL(colour: HSVColor): HSLColor {
//     return asHSL(convert.hsv.hsl(to3(colour)))
// }
//
// export function HSVToHex(colour: HSVColor): string {
//     return asHex(convert.hsv.hex(to3(colour)))
// }
