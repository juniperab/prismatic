import { toCssColour, toHSB } from '../../colour/colourConversions'
import { HintItem, HintType, HSBHint } from '../hint'
import { hueDiff, rotateHue } from '../../colour/colourMath'
import { HintGeneratorConfigHSB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { Puzzle } from '../puzzle'
import { HSBColour } from '../../colour/colourHSB'

const innerVisibleRadius = 25
const outerVisibleRadius = 75
const innerVisibleLine = 60
const outerVisibleLine = 100

export function generateHintHSB(guess: HSBColour, puzzle: Puzzle, config: HintGeneratorConfigHSB): HSBHint {
  const { precision } = config
  const answer = toHSB(puzzle.answer)
  let { hueRange, saturationRange, brightnessRange } = config
  hueRange = hueRange ?? config.hueCutoff
  saturationRange = saturationRange ?? config.saturationCutoff
  brightnessRange = brightnessRange ?? config.brightnessCutoff

  const hue = hueHint(guess, answer, precision, config)
  const saturation = saturationHint(guess, answer, precision, config)
  const brightness = brightnessHint(guess, answer, precision, config)

  let innerColour = guess
  let outerColour = {
    ...guess,
    h: rotateHue(guess.h, Math.sign(hue?.error ?? 0) * hueRange),
    s: guess.s + Math.sign(saturation?.error ?? 0) * saturationRange,
    b: guess.b + Math.sign(brightness?.error ?? 0) * brightnessRange,
  }

  // do an additional 50% hue rotation in the greens -- they're much harder to see
  // 60º - 180º = danger zone
  if (guess.h > 60 && guess.h < 180 && outerColour.h > 60 && outerColour.h < 180) {
    outerColour = {
      ...outerColour,
      h: rotateHue(outerColour.h, (Math.sign(hue?.error ?? 0) * hueRange) / 2),
    }
  }

  // adjust for cases where the outer brightness extends beyond the range [0, 100]
  if (outerColour.b < 0 || outerColour.b > 100) {
    const correction = (outerColour.b > 100 ? 100 : 0) - outerColour.b
    console.log(`adjusting brightness ${correction}`)
    innerColour = { ...innerColour, b: innerColour.b + correction }
    outerColour = { ...outerColour, b: outerColour.b + correction }
  }

  console.log(`Hin: ${innerColour.h}, Hout: ${outerColour.h}`)
  console.log(`Sin: ${innerColour.s}, Sout: ${outerColour.s}`)
  console.log(`Bin: ${innerColour.b}, Bout: ${outerColour.b}`)

  return {
    type: HintType.HSB,
    guessedColour: guess,
    cssGradients: [
      brightnessGradient(innerColour, outerColour, hue, brightness),
      saturationGradient(innerColour, outerColour, hue, saturation),
      hueGradiant(innerColour, outerColour, hue),
    ].filter((g) => typeof g === 'string') as string[],
    hue,
    saturation,
    brightness,
  }
}

function hueGradiant(innerColour: HSBColour, outerColour: HSBColour, hint?: HintItem): string | undefined {
  if (hint === undefined) {
    // const stopRadius = outerVisibleRadius - (outerVisibleRadius - innerVisibleRadius) * 0.2
    // return (
    //   `radial-gradient(` +
    //   `circle at 50% 50%, ` +
    //   `${toCssColour({ ...innerColour, s: 100, b: 100 })} ${cssPct(innerVisibleRadius)}, ` +
    //   `${toCssColour({ ...outerColour, s: 0, b: 100 })} ${cssPct(stopRadius)})`
    // )
    return undefined
  }

  if (hint.match) {
    const cssColour = toCssColour({ ...innerColour, s: 100, b: 100 })
    return `radial-gradient(circle at 50% 50%, ${cssColour}, ${cssColour})`
  }

  const startRadius = innerVisibleRadius + (1 - Math.abs(hint.error)) * (outerVisibleRadius - innerVisibleRadius) * 0.8
  return (
    `radial-gradient(` +
    `circle at 50% 50%, ` +
    `${toCssColour({ ...innerColour, s: 100, b: 100 })} ${cssPct(startRadius)}, ` +
    `${toCssColour({ ...outerColour, s: 100, b: 100 })} ${cssPct(outerVisibleRadius)})`
  )
}

function saturationGradient(
  innerColour: HSBColour,
  outerColour: HSBColour,
  hueHint?: HintItem,
  saturationHint?: HintItem
): string | undefined {
  if (saturationHint === undefined) {
    return (
      `linear-gradient(to right,` +
      `${toCssColour({ h: 0, s: 0, b: 100, a: 100 })}, ` +
      `${toCssColour({ h: 0, s: 0, b: 100, a: 0 })}, ` +
      `${toCssColour({ h: 0, s: 0, b: 100, a: 100 })})`
    )
  }

  const stepSize = 35 * (1 - Math.abs(saturationHint.error)) + 5
  console.log(`saturationError: ${saturationHint.error}`)
  console.log(`stepSize: ${stepSize}`)

  if (hueHint === undefined) {
    const bEquiv = 15 * Math.sign(saturationHint.error)
    return (
      `repeating-linear-gradient(to right,` +
      `${toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b })}, ` +
      `${toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b + bEquiv })} ${cssPct(stepSize / 2)}, ` +
      `${toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b })} ${cssPct(stepSize)})`
    )
  }

  return (
    `repeating-linear-gradient(to right,` +
    `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - innerColour.s })}, ` +
    `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - outerColour.s })} ${cssPct(stepSize / 2)}, ` +
    `${toCssColour({ h: 0, s: 0, b: 100, a: 100 - innerColour.s })} ${cssPct(stepSize)})`
  )
}

function brightnessGradient(
  innerColour: HSBColour,
  outerColour: HSBColour,
  hueHint?: HintItem,
  brightnessHint?: HintItem
): string | undefined {
  if (brightnessHint === undefined && hueHint === undefined) return undefined

  if (brightnessHint === undefined) {
    return (
      `linear-gradient(to top,` +
      `${toCssColour({ h: 0, s: 0, b: 0, a: 100 })}, ` +
      `${toCssColour({ h: 0, s: 0, b: 0, a: 0 })}, ` +
      `${toCssColour({ h: 0, s: 0, b: 0, a: 100 })})`
    )
  }

  if (brightnessHint.match) {
    const cssColour = toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b })
    return `linear-gradient(to top, ${cssColour}, ${cssColour})`
  }

  const startLine =
    innerVisibleLine + (1 - Math.abs(brightnessHint.error)) * (outerVisibleLine - innerVisibleLine) * 0.8
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
  let huePrecision = precision
  if (target.s < config.saturationVisibilityFloor) huePrecision = 360
  if (target.b < config.brightnessVisibilityFloor) huePrecision = 360
  return simpleHintItem(hueDiff(target.h, guess.h), huePrecision, config.hueCutoff, config.hueRange)
}

function saturationHint(
  guess: HSBColour,
  target: HSBColour,
  precision: number,
  config: HintGeneratorConfigHSB
): HintItem | undefined {
  let saturationPrecision = precision
  if (target.b < config.brightnessVisibilityFloor) saturationPrecision = 100
  return simpleHintItem(target.s - guess.s, saturationPrecision, config.saturationCutoff, config.saturationRange)
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
