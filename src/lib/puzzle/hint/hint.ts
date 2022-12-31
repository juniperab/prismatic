import { AnyColour, CMYKColour, HSBColour, RGBColour } from '../../colour/colours'

export type Hint = HSBHint | RGBHint | CMYKHint

export enum HintType {
  RGB = 'rgb',
  HSB = 'hsb',
  CMYK = 'cmyk',
}

export interface HintItem {
  match: boolean
  error: number
}

export interface BaseHint {
  guessedColour: AnyColour
  type: HintType
}

export interface RGBHint extends BaseHint {
  guessedColour: RGBColour
  type: HintType.RGB
  red?: HintItem
  green?: HintItem
  blue?: HintItem
}

export interface HSBHint extends BaseHint {
  guessedColour: HSBColour
  innerColour: HSBColour
  outerColour: HSBColour
  cssGradients: string[]
  type: HintType.HSB
  hue?: HintItem
  saturation?: HintItem
  brightness?: HintItem
}

export interface CMYKHint extends BaseHint {
  guessedColour: CMYKColour
  type: HintType.CMYK
  cyan?: HintItem
  magenta?: HintItem
  yellow?: HintItem
  black?: HintItem
}

export function isRGBHint(hint: Hint): hint is RGBHint {
  const rgbHint = hint as RGBHint
  return rgbHint.type === HintType.RGB
}

export function isHSBHint(hint: Hint): hint is HSBHint {
  const hsbHint = hint as HSBHint
  return hsbHint.type === HintType.HSB
}

export function isCMYKHint(hint: Hint): hint is CMYKHint {
  const cmykHint = hint as CMYKHint
  return cmykHint.type === HintType.CMYK
}

export function isHint(hint: any): hint is Hint {
  return isRGBHint(hint) || isHSBHint(hint) || isCMYKHint(hint)
}

export interface HintVisitor<T> {
  rgb?: (hint: RGBHint) => T
  hsb?: (hint: HSBHint) => T
  cmyk?: (hint: CMYKHint) => T
}

export function visitHint<T>(hint: Hint, visitor: HintVisitor<T>): T | undefined {
  if (isRGBHint(hint)) {
    return visitor.rgb?.(hint)
  } else if (isHSBHint(hint)) {
    return visitor.hsb?.(hint)
  } else if (isCMYKHint(hint)) {
    return visitor.cmyk?.(hint)
  }
  throw new Error('invalid hint type')
}

export function visitHintOrThrow<T>(hint: Hint, visitor: HintVisitor<T>, error?: Error): T {
  const result = visitHint(hint, visitor)
  if (result === undefined) throw error ?? new Error('HintVisitor produced no result')
  return result
}

export function visitHintItems<T>(hint: Hint, visitor: (hintItem: HintItem) => T): Array<T | undefined> {
  const items =
    visitHint(hint, {
      rgb: (hint) => [hint.red, hint.green, hint.blue],
      hsb: (hint) => [hint.hue, hint.saturation, hint.brightness],
      cmyk: (hint) => [hint.cyan, hint.magenta, hint.yellow, hint.black],
    }) ?? []
  return items.map((item) => (item != null ? visitor(item) : undefined))
}
