import { AnyColor, isHex, isHSB, isHSL, isRGB, toHSB, toHSL, toRGB } from './colourConversions'

/**
 * Rotate a hue around the colour wheel by some number of degrees. The result will be in [0, 360).
 *
 * @param hue           the original hue
 * @param degrees       the number of degrees to rotate (which may be positive or negative)
 */
export function rotateHue (hue: number, degrees: number): number {
  let newHue = (hue + degrees) % 360
  while (newHue < 0) newHue += 360
  return newHue
}

/**
 * Return the number of degree needed to rotate from a to b.
 * The result will always be on [-180, 180]
 *
 * @param to      the ending-point hues
 * @param from    the starting-point hues
 */
export function hueDiff (to: number, from: number): number {
  // normalize the given hues onto [0, 360), just in case
  let diff = rotateHue(to, 0) - rotateHue(from, 0)
  while (diff > 180) diff -= 360
  while (diff < -180) diff += 360
  return diff
}

/**
 * Determine if two colours are the same, within a certain precision.
 * If the two colours are not in the same colour space, the second colour will be converted to the space of the fist.
 *
 * @param a             the first colour to compare
 * @param b             the second colour to compare
 * @param precision     the maximum amount by which any component of the colours may differ yet be considered a match
 */
export function isSameColour (a: AnyColor, b: AnyColor, precision: number): boolean {
  let diffs = [0, 0, 0]
  if (isRGB(a)) {
    const b2 = toRGB(b)
    diffs = [b2.r - a.r, b2.g - a.g, b2.b - a.b]
  } else if (isHSL(a)) {
    const b2 = toHSL(b)
    diffs = [hueDiff(b2.h, a.h), b2.s - a.s, b2.l - a.l]
  } else if (isHSB(a)) {
    const b2 = toHSB(b)
    diffs = [hueDiff(b2.h, a.h), b2.s - a.s, b2.b - a.b]
  } else if (isHex(a)) {
    const a2 = toRGB(a)
    const b2 = toRGB(b)
    diffs = [b2.r - a2.r, b2.g - a2.g, b2.b - a2.b]
  } else {
    throw new Error('invalid colour type')
  }
  return diffs.every(diff => Math.abs(diff) <= precision)
}

/**
 * Generate a random colour.
 */
export function generateRandomColour (): AnyColor {
  return { r: Math.random() * 256, g: Math.random() * 256, b: Math.random() * 256 }
}
