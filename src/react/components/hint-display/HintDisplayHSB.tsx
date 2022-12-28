import { CSSProperties, ReactElement } from "react";
import { HintDisplayInner, HintDisplayOuter, HintDisplayQuadrant } from "./hintDisplayLayout";
import { HintDisplayProps } from "./HintDisplay";
import { Hint, HintItem, HSBHint } from "../../../lib/puzzle/hint/hint";
import { renderHintDisplayCentre } from "./hintDisplayCommon";
import { AnyColor, toCssColour, toHSB } from "../../../lib/colour/colourConversions";
import { bounded } from "../../../lib/math/math";
import { rotateHue } from "../../../lib/colour/colourMath";

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint,
}

function showValueInQuadrant(hintItem: HintItem | undefined, signPositive: boolean): boolean {
  let show = false
  if (hintItem !== undefined) {
    if (hintItem.match) show = true
    if (Math.sign(hintItem.diff) === Math.sign(signPositive ? 1 : -1)) show = true
  }
  return show
}

function getCssGradiant(hint: HSBHint, top: boolean, right: boolean): string {
  const guessedColourHSB = toHSB(hint.guessedColour)
  const centreColour = toCssColour(hint.guessedColour)
  const edgeHue = rotateHue(guessedColourHSB.h, (hint.hue?.diff ?? 0))
  const edgeSaturation = bounded(guessedColourHSB.s + (hint.saturation?.diff ?? 0), 0, 100)
  const edgeBrightness = bounded(guessedColourHSB.b + (hint.brightness?.diff ?? 0), 0, 100)
  const edgeColour = toCssColour({h: edgeHue, s: edgeSaturation, b: edgeBrightness})
  return `radial-gradient(circle at ${right ? 0 : 100}% ${top ? 100 : 0}%, ${centreColour} 10%, ${edgeColour} 75%)`
}

function renderQuadrant(hint: HSBHint, top: boolean, right: boolean): ReactElement {
  const show = showValueInQuadrant(hint.brightness, top)
    && showValueInQuadrant(hint.saturation, right)
  const style: CSSProperties = {
    backgroundImage: show
      ? getCssGradiant(hint, top, right)
      : undefined,
  }
  return <HintDisplayQuadrant style={style}/>
}

export function HintDisplayHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, onClick } = props

  console.log(`${hint.hue?.diff ?? '_'}, ${hint.saturation?.diff ?? '_'}, ${hint.brightness?.diff ?? '_'}`)

  return <HintDisplayOuter>
    <HintDisplayInner>
      {renderQuadrant(hint, true, false)}
      {renderQuadrant(hint, true, true)}
      {renderQuadrant(hint, false, false)}
      {renderQuadrant(hint, false, true)}
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintDisplayInner>
  </HintDisplayOuter>
}