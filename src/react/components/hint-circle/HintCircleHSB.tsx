import { CSSProperties, ReactElement } from "react";
import { _HintCircle as HintCircleElement, _HintCircleQuadrant as HCQuadrant } from "./hintCircleLayout";
import { HintDisplayProps } from "./HintCircle";
import { HSBHint } from "../../../lib/puzzle/hint/hint";
import { HintCircleDirection, hintIndicatorMagnitude, renderHintDisplayCentre } from "./hintCircleCommon";
import { AnyColor, HSBColor, toCssColour, toHSB } from "../../../lib/colour/colourConversions";
import { rotateHue } from "../../../lib/colour/colourMath";

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint
}

// function showValueInQuadrant(hintItem: HintItem | undefined, signPositive: boolean): boolean {
//   let show = false
//   if (hintItem !== undefined) {
//     if (hintItem.match) show = true
//     if (Math.sign(hintItem.diff) === Math.sign(signPositive ? 1 : -1)) show = true
//   }
//   return show
// }

function cssGradiant(
  innerColour: AnyColor,
  outerColour: AnyColor,
  dir: HintCircleDirection,
): string {
  let startAtLeft = true
  let startAtTop = true
  switch(dir) {
    case HintCircleDirection.N: startAtLeft = false; startAtTop = false; break
    case HintCircleDirection.NE: startAtLeft = false; startAtTop = false; break
    case HintCircleDirection.E: startAtLeft = true; startAtTop = false; break
    case HintCircleDirection.SE: startAtLeft = true; startAtTop = false; break
    case HintCircleDirection.S: startAtLeft = true; startAtTop = true; break
    case HintCircleDirection.SW: startAtLeft = true; startAtTop = true; break
    case HintCircleDirection.W: startAtLeft = false; startAtTop = true; break
    case HintCircleDirection.NW: startAtLeft = false; startAtTop = true; break
    default: throw new Error('invalid direction')
  }
  return `radial-gradient(` +
    `circle at ${startAtLeft ? 0 : 100}% ${startAtTop ? 0 : 100}%, ` +
    `${toCssColour(innerColour)} 10%, ` +
    `${toCssColour(outerColour)} 75%)`
}

// function renderQuadrant(hint: HSBHint, top: boolean, right: boolean): ReactElement {
//   const show = showValueInQuadrant(hint.brightness, top) && showValueInQuadrant(hint.saturation, right)
//   const style: CSSProperties = {
//     backgroundImage: show ? getCssGradiant(hint, top, right) : undefined,
//   }
//   return <HCQuadrant style={style} />
// }

function renderQuadrant(dir: HintCircleDirection, hint?: HSBHint): ReactElement {
  if (hint === undefined) return <HCQuadrant key={dir}/>

  let innerColour: HSBColor = toHSB(hint?.guessedColour)
  let outerColour: HSBColor = innerColour

  if (hint.hue !== undefined) {
    // innerColour = { ...innerColour, h: rotateHue(innerColour.h, hint.hue.diff) }
    outerColour = { ...outerColour, h: rotateHue(outerColour.h, hint.hue.diff)}
  } else {
    innerColour = { ...innerColour, s: 0 }
    outerColour = { ...outerColour, s: 0 }
  }

  const style: CSSProperties = {
    backgroundImage: cssGradiant(innerColour, outerColour, dir)
  }
  return <HCQuadrant key={dir} style={style}/>
}

function renderQuadrants(hint: HSBHint): { quadrants: ReactElement, rotateQuadrants: boolean } {
  const quadrants = []
  let rotate

  // const hueMagnitude = hintIndicatorMagnitude(hint.hue)
  const saturationMagnitude = hintIndicatorMagnitude(hint.saturation)
  const brightnessMagnitude = hintIndicatorMagnitude(hint.brightness)

  // TODO: this is kind of a hack that relies on the string values of the HintIndicatorMagnitude enum
  const sAndBMags: string = `${saturationMagnitude}${brightnessMagnitude}`

  switch (sAndBMags) {
    case '++':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.E, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.W))
      quadrants.push(renderQuadrant(HintCircleDirection.S))
      break
    case '+-':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N))
      quadrants.push(renderQuadrant(HintCircleDirection.E, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.W))
      quadrants.push(renderQuadrant(HintCircleDirection.S, hint))
      break
    case '+=':
      rotate = true
      quadrants.push(renderQuadrant(HintCircleDirection.NE, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.SE, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.NW))
      quadrants.push(renderQuadrant(HintCircleDirection.SW))
      break
    case '+x':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N))
      quadrants.push(renderQuadrant(HintCircleDirection.E, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.W))
      quadrants.push(renderQuadrant(HintCircleDirection.S))
      break
    case '-+':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.E))
      quadrants.push(renderQuadrant(HintCircleDirection.W, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.S))
      break
    case '--':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N))
      quadrants.push(renderQuadrant(HintCircleDirection.E))
      quadrants.push(renderQuadrant(HintCircleDirection.W, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.S, hint))
      break
    case '-=':
      rotate = true
      quadrants.push(renderQuadrant(HintCircleDirection.NE))
      quadrants.push(renderQuadrant(HintCircleDirection.SE))
      quadrants.push(renderQuadrant(HintCircleDirection.NW, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.SW, hint))
      break
    case '-x':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N))
      quadrants.push(renderQuadrant(HintCircleDirection.E))
      quadrants.push(renderQuadrant(HintCircleDirection.W, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.S))
      break
    case '=+':
      rotate = true
      quadrants.push(renderQuadrant(HintCircleDirection.NE, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.SE))
      quadrants.push(renderQuadrant(HintCircleDirection.NW, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.SW))
      break
    case '=-':
      rotate = true
      quadrants.push(renderQuadrant(HintCircleDirection.NE))
      quadrants.push(renderQuadrant(HintCircleDirection.SE, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.NW))
      quadrants.push(renderQuadrant(HintCircleDirection.SW, hint))
      break
    case '==':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.E, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.W, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.S, hint))
      break
    case '=x':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N))
      quadrants.push(renderQuadrant(HintCircleDirection.E, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.W, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.S))
      break
    case 'x+':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.E))
      quadrants.push(renderQuadrant(HintCircleDirection.W))
      quadrants.push(renderQuadrant(HintCircleDirection.S))
      break
    case 'x-':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N))
      quadrants.push(renderQuadrant(HintCircleDirection.E))
      quadrants.push(renderQuadrant(HintCircleDirection.W))
      quadrants.push(renderQuadrant(HintCircleDirection.S, hint))
      break
    case 'x=':
      rotate = false
      quadrants.push(renderQuadrant(HintCircleDirection.N, hint))
      quadrants.push(renderQuadrant(HintCircleDirection.E))
      quadrants.push(renderQuadrant(HintCircleDirection.W))
      quadrants.push(renderQuadrant(HintCircleDirection.S, hint))
      break
    case 'xx':
      rotate = false
      break
    default: throw new Error('invalid hint magnitudes for saturation and brightness')
  }

  return {
    quadrants: <>{quadrants}</>,
    rotateQuadrants: rotate,
  }
}

// {renderQuadrant(hint, true, false)}
// {renderQuadrant(hint, true, true)}
// {renderQuadrant(hint, false, false)}
// {renderQuadrant(hint, false, true)}

export function HintCircleHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, onClick } = props

  const { quadrants, rotateQuadrants } = renderQuadrants(hint)

  const hintCircleStyle: CSSProperties = {
    transform: `rotate(${rotateQuadrants ? 90 : 45}deg)`
  }

  return (
    <HintCircleElement style={hintCircleStyle}>
      {quadrants}
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintCircleElement>
  )
}
