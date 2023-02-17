import { toCssColour, toHSB } from '../../colour/colourConversions'
import { HintItem, HintType, HSBHint } from '../hint'
import { hueDiff, rotateHue } from '../../colour/colourMath'
import { HintGeneratorConfigHSB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { HSBColour } from '../../colour/colours'
import { Puzzle } from '../puzzle'
import { hintCircleLayout } from '../../../app/hint-display/hintCircleLayout'

const innerVisibleRadius = hintCircleLayout.centre.diameter * 0.8
const outerVisibleRadius = 75
const innerVisibleLine = 40
const outerVisibleLine = 90

export function generateHintHSB(guess: HSBColour, puzzle: Puzzle, config: HintGeneratorConfigHSB): HSBHint {
  const { precision } = config
  const answer = toHSB(puzzle.answer)

  let huePrecision = precision
  let saturationPrecision = precision
  const saturationPrecisionMultiplier = Math.pow(
    config.brightnessPrecisionMultiplier,
    (100 - answer.s) / (100 - config.saturationPrecisionThreshold)
  )
  const brightnessPrecisionMultiplier = Math.pow(
    config.brightnessPrecisionMultiplier,
    (100 - answer.b) / (100 - config.brightnessPrecisionThreshold)
  )
  huePrecision *= saturationPrecisionMultiplier * brightnessPrecisionMultiplier
  saturationPrecision *= brightnessPrecisionMultiplier
  if (answer.s < config.saturationPrecisionThreshold) huePrecision = 360
  if (answer.b < config.brightnessPrecisionThreshold) huePrecision = 360

  const hue = hueHint(guess, answer, huePrecision, config)
  const saturation = saturationHint(guess, answer, saturationPrecision, config)
  const brightness = brightnessHint(guess, answer, precision, config)

  let innerColour = guess
  let outerColour = guess

  if (hue !== undefined) {
    outerColour = {
      h: rotateHue(guess.h, Math.sign(hue.error) * config.hueRange),
      s: outerColour.s + (saturation?.error ?? 0) * config.saturationRange * 2,
      b: outerColour.b + (brightness?.error ?? 0) * config.brightnessRange * 2,
    }
    if (outerColour.s < config.saturationVisibilityThreshold) {
      outerColour = { ...outerColour, s: config.saturationVisibilityThreshold }
    }
  } else {
    innerColour = { ...innerColour, s: 0 }
    outerColour = {
      ...outerColour,
      s: 0,
      b: outerColour.b + (brightness?.error ?? 0) * config.brightnessRange * 2,
    }
  }

  if (saturation?.match !== true) {
    if (outerColour.s > 100) {
      const extra = outerColour.s - 100
      outerColour = { ...outerColour, s: 100 }
      innerColour = { ...innerColour, s: innerColour.s - extra / 2 }
    } else if (outerColour.s < 0) {
      const extra = outerColour.s
      outerColour = { ...outerColour, s: 0 }
      innerColour = { ...innerColour, s: innerColour.s - extra / 2 }
    }
  }
  if (brightness?.match !== true) {
    if (outerColour.b > 100) {
      const extra = outerColour.b - 100
      outerColour = { ...outerColour, b: 100 }
      innerColour = { ...innerColour, b: innerColour.b - extra / 2 }
    } else if (outerColour.b < 0) {
      const extra = outerColour.b
      outerColour = { ...outerColour, b: 0 }
      innerColour = { ...innerColour, b: innerColour.b - extra / 2 }
    }
  }

  return {
    type: HintType.HSB,
    guessedColour: guess,
    cssGradients: [
      brightnessGradient(innerColour, outerColour, brightness),
      saturationGradient(innerColour, outerColour, saturation),
      hueGradiant(innerColour, outerColour, hue),
    ].filter((g) => typeof g === 'string') as string[],
    hue,
    saturation,
    brightness,
  }
}

function hueGradiant(innerColour: HSBColour, outerColour: HSBColour, hint?: HintItem): string | undefined {
  if (hint === undefined) return undefined
  const startRadius = innerVisibleRadius + (1 - Math.abs(hint.error)) * (outerVisibleRadius - innerVisibleRadius) * 0.8
  if (hint.match) {
    const cssColour = toCssColour({ ...innerColour, s: 100, b: 100 })
    return `radial-gradient(circle at 50% 50%, ${cssColour}, ${cssColour})`
  }
  return (
    `radial-gradient(` +
    `circle at 50% 50%, ` +
    `${toCssColour({ ...innerColour, s: innerColour.s === 0 ? 0 : 100, b: 100 })} ${cssPct(startRadius)}, ` +
    `${toCssColour({ ...outerColour, s: innerColour.s === 0 ? 0 : 100, b: 100 })} ${cssPct(outerVisibleRadius)})`
  )
}

function saturationGradient(innerColour: HSBColour, outerColour: HSBColour, hint?: HintItem): string | undefined {
  if (hint === undefined) {
    return `linear-gradient(to right, white, white)`
  }
  const startLine = innerVisibleLine + (1 - Math.abs(hint.error)) * (outerVisibleLine - innerVisibleLine) * 0.8
  if (hint.match) {
    return (
      `radial-gradient(circle at 50% 50%, ` +
      `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - innerColour.s })} ${cssPct(innerVisibleRadius)}, ` +
      `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - outerColour.s })} ${cssPct(outerVisibleRadius)})`
    )
  }
  return (
    `linear-gradient(to ${outerColour.s >= innerColour.s ? 'right' : 'left'}, ` +
    `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - innerColour.s })} ${cssPct(startLine)}, ` +
    `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - outerColour.s })} ${cssPct(outerVisibleLine)})`
  )
}

function brightnessGradient(innerColour: HSBColour, outerColour: HSBColour, hint?: HintItem): string | undefined {
  if (hint === undefined) return undefined
  const startLine = innerVisibleLine + (1 - Math.abs(hint.error)) * (outerVisibleLine - innerVisibleLine) * 0.8
  if (hint.match) {
    const cssColour = toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b })
    return `linear-gradient(to top, ${cssColour}, ${cssColour})`
  }
  return (
    `linear-gradient(to ${outerColour.b >= innerColour.b ? 'top' : 'bottom'}, ` +
    `${toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b })} ${cssPct(startLine)}, ` +
    `${toCssColour({ h: 0, s: 0, b: 0, a: 100 - outerColour.b })} ${cssPct(outerVisibleLine)})`
  )
}

function hueHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  return simpleHintItem(hueDiff(target.h, guess.h), precision, config.hueCutoff, config.hueRange)
}

function saturationHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  return simpleHintItem(target.s - guess.s, precision, config.saturationCutoff, config.saturationRange)
}

function brightnessHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  return simpleHintItem(target.b - guess.b, precision, config.brightnessCutoff, config.brightnessRange)
}

function cssPct(val: number): string {
  return `${val.toFixed(1)}%`
}
