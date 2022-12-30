import base64 from 'base-64'
import utf8 from 'utf8'
import { HintGeneratorConfig } from './hint/hintGeneratorConfig'
import { NamedColour } from '../colour/colours'

export type PuzzleId = string

export interface Puzzle {
  answer: NamedColour
  precision: number
}

export interface PuzzleConfig {
  hintGenerators: HintGeneratorConfig
}

export function getPuzzleId(puzzle: Puzzle): PuzzleId {
  return base64.encode(utf8.encode(JSON.stringify(puzzle)))
}

export function loadPuzzleById(id: PuzzleId): Puzzle {
  // theoretically, this function could load a stored puzzle definition from a database
  // for now, it will parse structured data stored in the PuzzleId string
  return JSON.parse(utf8.decode(base64.decode(id))) as Puzzle
}
