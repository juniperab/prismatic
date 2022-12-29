import { CSSProperties, ReactElement } from 'react'
import { AnyColor, toCssColour } from '../../../lib/colour/colourConversions'
import { _HintCircleCentre as HCCentre } from './hintCircleLayout'

export function renderHintDisplayCentre(colour?: AnyColor, onClick?: () => void): ReactElement {
  const style: CSSProperties = {
    backgroundColor: colour !== undefined ? toCssColour(colour) : undefined,
    cursor: onClick !== undefined ? 'pointer' : undefined,
  }
  return <HCCentre style={style} onClick={() => onClick?.()} />
}
