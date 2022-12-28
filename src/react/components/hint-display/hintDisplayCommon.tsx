import { CSSProperties, ReactElement } from "react";
import { AnyColor, toCssColour } from "../../../lib/colour/colourConversions";
import { HintDisplayCentre } from "./hintDisplayLayout";

export function renderHintDisplayCentre(colour?: AnyColor, onClick?: () => void): ReactElement {
  const style: CSSProperties = {
    backgroundColor: colour !== undefined ? toCssColour(colour) : undefined,
    cursor: onClick !== undefined ? 'pointer' : undefined,
  }
  return <HintDisplayCentre style={style} onClick={() => onClick?.()}/>
}
