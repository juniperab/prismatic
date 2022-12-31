import { CSSProperties, ReactElement } from 'react'
import { _HintCircle as HintCircleElement, _HintCircleQuadrant as HCQuadrant } from './hintCircleLayout'
import { HintDisplayProps } from './HintCircle'
import { HintItem, HSBHint } from "../../../lib/puzzle/hint/hint";
import { HintCircleDirection, hintIndicatorMagnitude, renderHintDisplayCentre } from './hintCircleCommon'
import { toCssColour, toHSB, withAlpha } from "../../../lib/colour/colourConversions";
import { rotateHue } from '../../../lib/colour/colourMath'
import { AnyColour, HSBColour } from '../../../lib/colour/colours'
import { useTheme } from "styled-components";
import { Theme } from "../theme/theme";

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint
}

function conicGradiantMask(mask: AnyColour, saturation?: HintItem, brightness?: HintItem): string {
  if (saturation === undefined && brightness === undefined) {
    return `conic-gradient(from 0deg, ${toCssColour(mask)}, ${toCssColour(mask)})`
  } else if (saturation !== undefined) {
    if (saturation?.match) {
      return `conic-gradient(from 0deg, ` +
        `${toCssColour(mask)} 45deg, transparent 45deg, ` +
        `transparent 135deg, ${toCssColour(mask)} 135deg, ` +
        `${toCssColour(mask)} 225deg, transparent 225deg, ` +
        `transparent 315deg, ${toCssColour(mask)} 315deg)`
    } else {
      return `conic-gradient(from ${saturation.error > 0 ? 0 : 180}deg, ` +
        `${toCssColour(mask)} 45deg, transparent 45deg, ` +
        `transparent 135deg, ${toCssColour(mask)} 135deg)`
    }
  } else if (brightness !== undefined) {
    return '' // FIXME
  } else {
    return '' // FIXME
  }
  return `conic-gradient(from 15deg, red 45deg, blue 180deg, yellow 270deg)`

  // const maskCss = toCssColour(mask)
  // const points = [
  //   start - sideBuffer,
  //   sideBuffer,
  //   end - start + sideBuffer,
  //   end - start + sideBuffer * 2,
  // ]
  // return (
  //   `conic-gradient(from ${points[0]}deg, ${maskCss},` +
  //   `transparent ${points[1]}deg,` +
  //   `transparent ${points[2]}deg, ` +
  //   `${maskCss} ${points[3]}deg, ` +
  //   `${maskCss})`
  // )
}

export function HintCircleHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, onClick } = props
  const theme = useTheme() as Theme

  const hintCircleStyle: CSSProperties = {
    backgroundColor: 'white',
    backgroundImage: [
      conicGradiantMask(theme.colours.background, hint.saturation, hint.brightness),
      ...hint.cssGradients,
    ].join(', '),
  }

  return (
    <HintCircleElement style={hintCircleStyle}>
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintCircleElement>
  )
}
