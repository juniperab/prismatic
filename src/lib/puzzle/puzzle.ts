import { AnyColor, CMYKColor, HSBColor } from '../colour/colourConversions'
import { RGBColor } from 'react-color'
import base64 from 'base-64'
import utf8 from 'utf8'
import { HintConfig } from './hint/hintConfig'
import { HintType } from './hint/hint'

export type PuzzleId = string

export type PuzzleMode = HintType.RGB | HintType.HSB | HintType.CMYK

export type Puzzle = PuzzleRGB | PuzzleHSB | PuzzleCMYK

export const allPuzzleModes: PuzzleMode[] = [HintType.RGB, HintType.HSB, HintType.CMYK]

interface PuzzleBase {
  answer: AnyColor
  answerName: string
  mode: PuzzleMode
  precision: number
}
export interface PuzzleRGB extends PuzzleBase {
  mode: HintType.RGB
  answer: RGBColor
}

export interface PuzzleHSB extends PuzzleBase {
  mode: HintType.HSB
  answer: HSBColor
}

export interface PuzzleCMYK extends PuzzleBase {
  mode: HintType.CMYK
  answer: CMYKColor
}

export interface PuzzleConfig {
  hint: HintConfig
}

export function getPuzzleId(puzzle: Puzzle): PuzzleId {
  return base64.encode(utf8.encode(JSON.stringify(puzzle)))
}

export function loadPuzzleById(id: PuzzleId): Puzzle {
  // theoretically, this function could load a stored puzzle definition from a database
  // for now, it will parse structured data stored in the PuzzleId string
  return JSON.parse(utf8.decode(base64.decode(id))) as Puzzle
}
