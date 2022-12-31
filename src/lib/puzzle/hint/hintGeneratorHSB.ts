import { toCssColour, toHSB } from "../../colour/colourConversions";
import { HintItem, HintType, HSBHint } from './hint'
import { hueDiff, rotateHue } from "../../colour/colourMath";
import { HintGeneratorConfigHSB } from './hintGeneratorConfig'
import { simpleHintItem } from './hintGeneratorCommon'
import { AnyColour, HSBColour } from "../../colour/colours";
import { Puzzle } from '../puzzle'
import { start } from "repl";
import { hintCircleLayout } from "../../../react/components/hint-circle/hintCircleLayout";
import { filter } from "lodash";
import { css } from "styled-components";

const innerVisibleRadius = hintCircleLayout.centre.diameter * 0.8
const outerVisibleRadius = 80
const innerVisibleLine = 40
const outerVisibleLine = 90

export function generateHintHSB(guess: HSBColour, puzzle: Puzzle, config: HintGeneratorConfigHSB): HSBHint {
  const { precision } = puzzle
  const answer = toHSB(puzzle.answer)
  const hue = hueHint(guess, answer, precision, config)
  const saturation = saturationHint(guess, answer, precision, config)
  const brightness = brightnessHint(guess, answer, precision, config)

  let innerColour = guess
  let outerColour = guess

  if (hue !== undefined) {
    outerColour = {
      h: rotateHue(guess.h, Math.sign(hue.error) * config.hueRange),
      s: outerColour.s + Math.sign(saturation?.error ?? 0) * config.saturationRange,
      b: outerColour.b + (brightness?.error ?? 0) * config.brightnessRange * 2,
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
      // saturation !== undefined && saturationGradient(innerColour, 0),
      hueGradiant(innerColour, outerColour,hue?.error ?? 1),
    ].filter(g => typeof g === 'string') as string[],
    innerColour,
    outerColour,
    hue,
    saturation,
    brightness,
  }
}

function hueGradiant(innerColour: HSBColour, outerColour: HSBColour, error: number): string {
  const startRadius = innerVisibleRadius + (1 - Math.abs(error)) * (outerVisibleRadius - innerVisibleRadius) * 0.8

  return (
    `radial-gradient(` +
    `circle at 50% 50%, ` +
    `${toCssColour({ ...innerColour, s: innerColour.s === 0 ? 0 : 100, b: 100 })} ${cssPct(startRadius)}, ` +
    `${toCssColour({ ...outerColour, s: innerColour.s === 0 ? 0 : 100, b: 100 })} ${cssPct(outerVisibleRadius)})`
  )
}

function saturationGradient(innerColour: HSBColour, centreBuffer: number = 0): string {
  return `linear-gradient(to right, ` +
    `white, ` +
    `${toCssColour({h: 0, s: 0, b: 100, a: 100 - innerColour.s})} ${cssPct(50 - centreBuffer)}, ` +
    `${toCssColour({h: 0, s: 0, b: 100, a: 100 - innerColour.s})} ${cssPct(50 + centreBuffer)}, ` +
    `transparent)`
}

function brightnessGradient(innerColour: HSBColour, outerColour: HSBColour, hint?: HintItem): string | undefined {
  if (hint === undefined) return undefined
  const startLine = innerVisibleLine + (1 - Math.abs(hint.error)) * (outerVisibleLine - innerVisibleLine) * 0.8
  if (hint.match) {
    const cssColour = toCssColour({ h: 0, s: 0, b: 0, a: 100 - innerColour.b })
    return `linear-gradient(to top, ${cssColour}, ${cssColour})`
  } else {
    return `linear-gradient(to ${outerColour.b >= innerColour.b ? 'top' : 'bottom'}, ` +
      `${toCssColour({h: 0, s: 0, b: 0, a: 100 - innerColour.b})} ${cssPct(startLine)}, ` +
      `${toCssColour({h: 0, s: 0, b: 0, a: 100 - outerColour.b})} ${cssPct(outerVisibleLine)})`
  }
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