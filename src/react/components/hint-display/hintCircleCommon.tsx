import { CSSProperties, ReactElement } from 'react'
import { toCssColour } from '../../../lib/colour/colourConversions'
import { _HintCircleCentre as HCCentre } from './hintCircleLayout'
import { AnyColour } from '../../../lib/colour/colours'

export function renderHintDisplayCentre(
  colour?: AnyColour,
  borderColour?: AnyColour,
  onClick?: () => void
): ReactElement {
  const style: CSSProperties = {
    borderColor: borderColour !== undefined ? toCssColour(borderColour) : undefined,
    backgroundColor: colour !== undefined ? toCssColour(colour) : undefined,
    cursor: onClick !== undefined ? 'pointer' : undefined,
  }
  return <HCCentre style={style} onClick={() => onClick?.()} />
}
