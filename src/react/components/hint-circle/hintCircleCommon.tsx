import { CSSProperties, ReactElement } from 'react'
import { AnyColour, toCssColour } from '../../../lib/colour/colourConversions'
import { _HintCircleCentre as HCCentre } from './hintCircleLayout'
import { HintItem } from "../../../lib/puzzle/hint/hint";

export enum HintCircleDirection {
  N = 0,
  NE = 45,
  E = 90,
  SE = 135,
  S = 180,
  SW = 225,
  W = 270,
  NW = 315,
}

export enum HintIndicatorMagnitude {
  POS = '+',
  NEG = '-',
  EQUAL = '=',
  NONE = 'x',
}

export function hintIndicatorMagnitude(hintItem?: HintItem): HintIndicatorMagnitude {
  if (hintItem === undefined) return HintIndicatorMagnitude.NONE
  if (hintItem.match) return HintIndicatorMagnitude.EQUAL
  if (hintItem.error > 0) return HintIndicatorMagnitude.POS
  if (hintItem.error < 0) return HintIndicatorMagnitude.NEG
  throw new Error('malformed hint item') // should never get here
}

export function renderHintDisplayCentre(colour?: AnyColour, onClick?: () => void): ReactElement {
  const style: CSSProperties = {
    backgroundColor: colour !== undefined ? toCssColour(colour) : undefined,
    cursor: onClick !== undefined ? 'pointer' : undefined,
  }
  return <HCCentre style={style} onClick={() => onClick?.()} />
}
