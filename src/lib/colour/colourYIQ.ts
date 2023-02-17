import { RGBColour } from './colourRGB'

export interface YIQColour {
  a?: number | undefined // [0, 100]
  y: number // [0, 100]
  i: number // [-100, 100]
  q: number // [-100, 100]
}

export function isYIQ(colour: any): colour is YIQColour {
  if (colour === undefined || typeof colour !== 'object') return false
  const yiq = colour as YIQColour
  return yiq.y !== undefined && yiq.i !== undefined && yiq.q !== undefined
}

export function rgbToYIQ(colour: RGBColour): YIQColour {
  const r = colour.r / 255
  const g = colour.g / 255
  const b = colour.b / 255

  // Source: https://en.wikipedia.org/wiki/YIQ#Formulas
  const y = (r * 0.299 + g * 0.587 + b * 0.114) * 100
  const i = ((r * 0.5959 + g * -0.2746 + b * -0.3231) / 0.5957) * 100
  const q = ((r * 0.2115 + g * -0.5227 + b * 0.3112) / 0.5226) * 100

  return { y, i, q, a: colour.a }
}

export function yiqToRGB(colour: YIQColour): RGBColour {
  const y = colour.y / 100
  const i = (colour.i / 100) * 0.5957
  const q = (colour.q / 100) * 0.5226

  // Source: https://en.wikipedia.org/wiki/YIQ#Formulas
  const r = (y + i * 0.956 + q * 0.619) * 255
  const g = (y + i * -0.272 + q * 0.647) * 255
  const b = (y + i * -1.106 + q * 1.703) * 255

  return { r, g, b, a: colour.a }
}
