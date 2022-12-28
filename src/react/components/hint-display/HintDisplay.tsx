import { ReactElement } from "react";
import { HintDisplayInner, HintDisplayOuter } from "./hintDisplayLayout";
import { Hint, HintType } from "../../../lib/puzzle/hint/hint";
import { renderHintDisplayCentre } from "./hintDisplayCommon";
import { HintDisplayHSB } from "./HintDisplayHSB";
import { AnyColor, toCssColour } from "../../../lib/colour/colourConversions";

export interface HintDisplayProps {
  answer?: AnyColor
  hint?: Hint
  onClick?: (hint: Hint) => void
}



export function HintDisplay(props: HintDisplayProps): ReactElement {
  const { answer, hint, onClick } = props

  if (answer !== undefined) {
    return (
      <HintDisplayOuter>
        <HintDisplayInner style={{backgroundColor: toCssColour(answer)}}>
        </HintDisplayInner>
      </HintDisplayOuter>
    )
  }

  const emptyHintDisplay = (
    <HintDisplayOuter>
      <HintDisplayInner>
        {renderHintDisplayCentre()}
      </HintDisplayInner>
    </HintDisplayOuter>
  )

  switch(hint?.type) {
    case HintType.RGB: return emptyHintDisplay
    case HintType.HSB: return <HintDisplayHSB hint={hint} onClick={onClick}/>
    case HintType.CMYK: return emptyHintDisplay
    default: return emptyHintDisplay
  }
}
