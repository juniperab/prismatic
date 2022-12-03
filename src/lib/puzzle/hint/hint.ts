import { AnyColor } from '../../colour/colourConversions'

export type Hint = HSBHint | HSLHint | RGBHint

export interface HintItem {
  match: boolean
  colour: AnyColor
  value: number
}

export interface BaseHint {
  guessedColour: AnyColor
  type: string
}

export interface RGBHint extends BaseHint {
  type: 'rgb'
  red?: HintItem
  green?: HintItem
  blue?: HintItem
}

export interface HSLHint extends BaseHint {
  type: 'hsl'
  hue?: HintItem
  saturation?: HintItem
  luminance?: HintItem
}

export interface HSBHint extends BaseHint {
  type: 'hsb'
  hue?: HintItem
  saturation?: HintItem
  brightness?: HintItem
}

export function isRGBHint(hint: Hint): hint is RGBHint {
  const rgbHint = hint as RGBHint
  return rgbHint.type === 'rgb'
}

export function isHSLHint(hint: Hint): hint is HSLHint {
  const hslHint = hint as HSLHint
  return hslHint.type === 'hsl'
}

export function isHSBHint(hint: Hint): hint is HSLHint {
  const hsbHint = hint as HSBHint
  return hsbHint.type === 'hsb'
}

export interface HintVisitor<T> {
  rgb: (hint: RGBHint) => T
  hsl: (hint: HSLHint) => T
  hsb: (hint: HSBHint) => T
}

export function visitHint<T>(hint: Hint, visitor: HintVisitor<T>): T {
  if (isRGBHint(hint)) {
    return visitor.rgb(hint)
  } else if (isHSLHint(hint)) {
    return visitor.hsl(hint)
  } else if (isHSBHint(hint)) {
    return visitor.hsb(hint)
  }
  throw new Error('invalid hint type')
}

const getHintItemsAsArrayVisitor: HintVisitor<Array<HintItem | undefined>> = {
  rgb: (hint) => [hint.red, hint.green, hint.blue],
  hsl: (hint) => [hint.hue, hint.saturation, hint.luminance],
  hsb: (hint) => [hint.hue, hint.saturation, hint.brightness],
}

export function visitHintItems<T>(hint: Hint, visitor: (hintItem: HintItem) => T): Array<T | undefined> {
  const items = visitHint(hint, getHintItemsAsArrayVisitor)
  return items.map((item) => (item != null ? visitor(item) : undefined))
}
