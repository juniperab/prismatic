import { ReactElement } from 'react'
import { _HintCircle as HintCircleElement } from './hintCircleLayout'
import { Hint, HintType } from '../../../lib/puzzle/hint/hint'
import { renderHintDisplayCentre } from './hintCircleCommon'
import { HintCircleHSB } from './HintCircleHSB'
import { AnyColor, toCssColour } from '../../../lib/colour/colourConversions'

export interface HintDisplayProps {
  answer?: AnyColor
  hint?: Hint
  onClick?: (hint: Hint) => void
}

export function HintCircle(props: HintDisplayProps): ReactElement {
  const { answer, hint, onClick } = props

  if (answer !== undefined) {
    return <HintCircleElement style={{ backgroundColor: toCssColour(answer) }} />
  }

  const emptyHintDisplay = <HintCircleElement>{renderHintDisplayCentre()}</HintCircleElement>

  switch (hint?.type) {
    case HintType.RGB:
      return emptyHintDisplay
    case HintType.HSB:
      return <HintCircleHSB hint={hint} onClick={onClick} />
    case HintType.CMYK:
      return emptyHintDisplay
    default:
      return emptyHintDisplay
  }
}