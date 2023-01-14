import { CSSProperties, ReactElement } from 'react'
import { _HintCircle as HintCircleElement } from './hintCircleLayout'
import { HintDisplayProps } from './HintCircle'
import { HintItem, HintStyle, HSBHint } from '../../../lib/puzzle/hint'
import { renderHintDisplayCentre } from './hintCircleCommon'
import { mostContrasting, toCssColour } from '../../../lib/colour/colourConversions'
import { AnyColour } from '../../../lib/colour/colours'
import { useTheme } from 'styled-components'
import { Theme } from '../../../theme/theme'

export interface HintDisplayHSBProps extends HintDisplayProps {
  hint: HSBHint
  hintStyle: HintStyle
}

function conicGradiantMask(mask: AnyColour, saturation?: HintItem, brightness?: HintItem): string {
  function singleQuarterMask(start: number): string {
    return (
      `conic-gradient(from ${start}deg, ` +
      `${toCssColour(mask)} 0deg, transparent 0deg, ` +
      `transparent 90deg, ${toCssColour(mask)} 90deg)`
    )
  }
  function doubleQuarterMark(start: number): string {
    return (
      `conic-gradient(from ${start}deg, ` +
      `${toCssColour(mask)} 0deg, transparent 0deg, ` +
      `transparent 90deg, ${toCssColour(mask)} 90deg, ` +
      `${toCssColour(mask)} 180deg, transparent 180deg, ` +
      `transparent 270deg, ${toCssColour(mask)} 270deg)`
    )
  }
  function halfMask(start: number): string {
    return (
      `conic-gradient(from ${start}deg, ` +
      `${toCssColour(mask)} 0deg, transparent 0deg, ` +
      `transparent 180deg, ${toCssColour(mask)} 180deg)`
    )
  }

  if (saturation !== undefined && brightness !== undefined) {
    if (saturation.match && brightness.match) {
      return `conic-gradient(from 0deg, transparent, transparent)`
    } else if (saturation.match && brightness.error >= 0) {
      return halfMask(-90)
    } else if (saturation.match && brightness.error < 0) {
      return halfMask(90)
    } else if (brightness.match && saturation.error >= 0) {
      return halfMask(0)
    } else if (brightness.match && saturation.error < 0) {
      return halfMask(180)
    } else if (saturation.error >= 0 && brightness.error >= 0) {
      return halfMask(-45)
    } else if (saturation.error >= 0 && brightness.error < 0) {
      return halfMask(45)
    } else if (saturation.error < 0 && brightness.error >= 0) {
      return halfMask(-135)
    } else {
      return halfMask(135)
    }
  } else if (saturation !== undefined) {
    if (saturation?.match) {
      return doubleQuarterMark(45)
    } else {
      return singleQuarterMask(saturation.error > 0 ? 45 : 225)
    }
  } else if (brightness !== undefined) {
    if (brightness?.match) {
      return doubleQuarterMark(-45)
    } else {
      return singleQuarterMask(brightness.error > 0 ? -45 : 135)
    }
  } else {
    return `conic-gradient(from 0deg, ${toCssColour(mask)}, ${toCssColour(mask)})`
  }
}

export function HintCircleHSB(props: HintDisplayHSBProps): ReactElement {
  const { hint, hintStyle, onClick } = props
  const theme = useTheme() as Theme

  const gradients = [...hint.cssGradients]
  if (hintStyle === HintStyle.EASY) {
    gradients.unshift(conicGradiantMask(theme.colours.appBackground, hint.saturation, hint.brightness))
  }

  const hintCircleStyle: CSSProperties = {
    backgroundColor: 'white',
    backgroundImage: gradients.join(', '),
  }

  const centreBorderColour = mostContrasting(
    hint.guessedColour,
    theme.colours.appBorders,
    ...theme.colours.appBordersAlt
  )

  return (
    <HintCircleElement style={hintCircleStyle}>
      {renderHintDisplayCentre(hint.guessedColour, centreBorderColour, () => onClick?.(hint))}
    </HintCircleElement>
  )
}
