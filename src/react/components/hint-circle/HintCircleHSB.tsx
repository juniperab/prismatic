import { CSSProperties, ReactElement } from 'react'
import { _HintCircle as HintCircleElement, _HintCircleQuadrant as HCQuadrant } from './hintCircleLayout'
import { HintDisplayProps } from './HintCircle'
import { HSBHint } from '../../../lib/puzzle/hint/hint'
import { HintCircleDirection, hintIndicatorMagnitude, renderHintDisplayCentre } from './hintCircleCommon'
import { toCssColour, toHSB } from '../../../lib/colour/colourConversions'
import { rotateHue } from '../../../lib/colour/colourMath'
import { AnyColour, HSBColour } from '../../../lib/colour/colours'

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

function cssGradiant(innerColour: AnyColour, outerColour: AnyColour, dir: HintCircleDirection): string {
  let startAtLeft = true
  let startAtTop = true
  switch (dir) {
    case HintCircleDirection.N:
      startAtLeft = false
      startAtTop = false
      break
    case HintCircleDirection.NE:
      startAtLeft = false
      startAtTop = false
      break
    case HintCircleDirection.E:
      startAtLeft = true
      startAtTop = false
      break
    case HintCircleDirection.SE:
      startAtLeft = true
      startAtTop = false
      break
    case HintCircleDirection.S:
      startAtLeft = true
      startAtTop = true
      break
    case HintCircleDirection.SW:
      startAtLeft = true
      startAtTop = true
      break
    case HintCircleDirection.W:
      startAtLeft = false
      startAtTop = true
      break
    case HintCircleDirection.NW:
      startAtLeft = false
      startAtTop = true
      break
    default:
      throw new Error('invalid direction')
  }
  return (
    `radial-gradient(` +
    `circle at ${startAtLeft ? 0 : 100}% ${startAtTop ? 0 : 100}%, ` +
    `${toCssColour(innerColour)} 10%, ` +
    `${toCssColour(outerColour)} 75%)`
  )
}

function renderQuadrant(dir: HintCircleDirection, hint?: HSBHint): ReactElement {
  if (hint === undefined) return <HCQuadrant key={dir} />

  let innerColour: HSBColour = toHSB(hint?.guessedColour)
  let outerColour: HSBColour = innerColour

  if (hint.hue !== undefined) {
    // outerColour = { ...outerColour, h: rotateHue(outerColour.h, hint.hue.diff) }
    outerColour = {
      h: rotateHue(outerColour.h, hint.hue.error),
      s: outerColour.s + (hint.saturation?.error ?? 0),
      b: outerColour.b + (hint.brightness?.error ?? 0),
    }
    // switch(dir) {
    //   case HintCircleDirection.N:
    //   case HintCircleDirection.S:
    //     outerColour = { ...outerColour, b: outerColour.b + (hint.brightness?.diff ?? 0)}
    //     break
    //   case HintCircleDirection.E:
    //   case HintCircleDirection.W:
    //     outerColour = { ...outerColour, s: outerColour.s + (hint.saturation?.diff ?? 0)}
    //     break
    //   default:
    //     outerColour = {
    //       ...outerColour,
    //       s: outerColour.s + (hint.saturation?.diff ?? 0),
    //       b: outerColour.b + (hint.brightness?.diff ?? 0)
    //     }
    // }
  } else {
    // TODO: WTF AM I DOING HERE?
    switch (dir) {
      case HintCircleDirection.E:
      case HintCircleDirection.W:
        innerColour = {
          ...innerColour,
          b: innerColour.s,
        }
        outerColour = {
          ...outerColour,
          b: innerColour.b - (hint.saturation?.error ?? 0),
        }
        break
      default:
    }
    innerColour = { ...innerColour, s: 0 }
    outerColour = {
      ...outerColour,
      s: 0,
      b: outerColour.b + (hint.brightness?.error ?? 0),
    }
  }

  console.log(
    `${dir}   :   ` +
      `${innerColour.h.toFixed(0)} -> ${outerColour.h.toFixed(0)}   :   ` +
      `${innerColour.s.toFixed(0)} -> ${outerColour.s.toFixed(0)}   :   ` +
      `${innerColour.b.toFixed(0)} -> ${outerColour.b.toFixed(0)}`
  )

  const style: CSSProperties = {
    backgroundImage: cssGradiant(innerColour, outerColour, dir),
  }
  return <HCQuadrant key={dir} style={style} />
}

function renderQuadrants(hint: HSBHint): { quadrants: ReactElement; rotateQuadrants: boolean } {
  const quadrants = []
  let rotate

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
    default:
      throw new Error('invalid hint magnitudes for saturation and brightness')
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

  console.log('-------------')

  const { quadrants, rotateQuadrants } = renderQuadrants(hint)

  const hintCircleStyle: CSSProperties = {
    transform: `rotate(${rotateQuadrants ? 90 : 45}deg)`,
  }

  return (
    <HintCircleElement style={hintCircleStyle}>
      {quadrants}
      {renderHintDisplayCentre(hint.guessedColour, () => onClick?.(hint))}
    </HintCircleElement>
  )
}
