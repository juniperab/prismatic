import { CSSProperties, ReactElement } from 'react'
import { _HintCircle as HintCircleElement, _HintCircleQuadrant as HCQuadrant } from './hintCircleLayout'
import { HintDisplayProps } from './HintCircle'
import { HSBHint } from '../../../lib/puzzle/hint/hint'
import { HintCircleDirection, hintIndicatorMagnitude, renderHintDisplayCentre } from './hintCircleCommon'
import { toCssColour, toHSB, withAlpha } from "../../../lib/colour/colourConversions";
import { rotateHue } from '../../../lib/colour/colourMath'
import { AnyColour, HSBColour } from '../../../lib/colour/colours'
import { useTheme } from "styled-components";
import { Theme } from "../theme/theme";

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint
}

function radialGradiant(innerColour: AnyColour, outerColour: AnyColour, left: number, top: number, ): string {
  return (
    `radial-gradient(` +
    `circle at ${left}% ${top}%, ` +
    `${toCssColour(innerColour)} 10%, ` +
    `${toCssColour(outerColour)} 75%)`
  )
}

function conicGradiantMask(start: number, end: number, mask: AnyColour, sideBuffer: number = 0): string {
  const maskCss = toCssColour(mask)
  const points = [
    start - sideBuffer,
    sideBuffer,
    end - start + sideBuffer,
    end - start + sideBuffer * 2,
  ]
  return (
    `conic-gradient(from ${points[0]}deg, ${maskCss},` +
    `transparent ${points[1]}deg,` +
    `transparent ${points[2]}deg, ` +
    `${maskCss} ${points[3]}deg, ` +
    `${maskCss})`
  )
}

export function HintCircleHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, onClick } = props
  const theme = useTheme() as Theme

  const hintCircleStyle: CSSProperties = {
    backgroundColor: toCssColour({ h: hint.guessedColour.h, s: 100, b: 100 }),
    backgroundImage: hint.cssGradients.join(', ')
    // backgroundImage: [
    //   // conicGradiantMask(15, 345, theme.colours.background),
    //   // radialGradiant(hint.innerColour, hint.outerColour, 50, 50),
    //   `linear-gradient(to top, black, ${toCssColour({h: 0, s: 0, b: 0, a: 100 - hint.guessedColour.b})}, transparent)`,
    //   `linear-gradient(to right, white, ${toCssColour({h: 0, s: 0, b: 100, a: 100 - hint.guessedColour.s})}, transparent)`
    // ].join(', ')
  }

  console.log(hintCircleStyle.backgroundImage)

  return (
    <HintCircleElement style={hintCircleStyle}>
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintCircleElement>
  )
}
