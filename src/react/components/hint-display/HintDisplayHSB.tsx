import { CSSProperties, ReactElement } from "react";
import { HintDisplayInner, HintDisplayOuter, HintDisplayQuadrant } from "./hintDisplayLayout";
import { HintDisplayProps } from "./HintDisplay";
import { HintItem, HSBHint } from "../../../lib/puzzle/hint/hint";
import { renderHintDisplayCentre } from "./hintDisplayCommon";

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint,
}

function showValueInQuadrant(hintItem: HintItem | undefined, sign: number): boolean {
  let show = false
  if (hintItem !== undefined) {
    if (hintItem.match) show = true
    if (Math.sign(hintItem.value) === Math.sign(sign)) show = true
  }
  return show
}

function renderQuadrantUpperLeft(hint: HSBHint): ReactElement {
  const showSaturation = showValueInQuadrant(hint.saturation, -1)
  const showBrightness = showValueInQuadrant(hint.brightness, 1)
  const style: CSSProperties = {
    backgroundColor: showSaturation && showBrightness ? 'black' : undefined
  }
  return <HintDisplayQuadrant style={style}/>
}

function renderQuadrantUpperRight(hint: HSBHint): ReactElement {
  const showSaturation = showValueInQuadrant(hint.saturation, 1)
  const showBrightness = showValueInQuadrant(hint.brightness, 1)
  const style: CSSProperties = {
    backgroundColor: showSaturation && showBrightness ? 'black' : undefined
  }
  return <HintDisplayQuadrant style={style}/>
}

function renderQuadrantLowerLeft(hint: HSBHint): ReactElement {
  const showSaturation = showValueInQuadrant(hint.saturation, -1)
  const showBrightness = showValueInQuadrant(hint.brightness, -1)
  const style: CSSProperties = {
    backgroundColor: showSaturation && showBrightness ? 'black' : undefined
  }
  return <HintDisplayQuadrant style={style}/>
}

function renderQuadrantLowerRight(hint: HSBHint): ReactElement {
  const showSaturation = showValueInQuadrant(hint.saturation, 1)
  const showBrightness = showValueInQuadrant(hint.brightness, -1)
  const style: CSSProperties = {
    backgroundColor: showSaturation && showBrightness ? 'black' : undefined
  }
  return <HintDisplayQuadrant style={style}/>
}

export function HintDisplayHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, onClick } = props

  return <HintDisplayOuter>
    <HintDisplayInner>
      {renderQuadrantUpperLeft(hint)}
      {renderQuadrantUpperRight(hint)}
      {renderQuadrantLowerLeft(hint)}
      {renderQuadrantLowerRight(hint)}
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintDisplayInner>
  </HintDisplayOuter>
}