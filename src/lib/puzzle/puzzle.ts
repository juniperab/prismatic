import base64 from 'base-64'
import utf8 from 'utf8'
import { HintGeneratorConfig } from './hint-generators/hintGeneratorConfig'
import { NamedColour } from '../colour/colours'
import { isNamed } from "../colour/colourConversions";

export type PuzzleId = string

export type Puzzle = PuzzleV0

export interface PuzzleBase {
  version: number
}

export interface PuzzleV0 extends PuzzleBase {
  answer: NamedColour
  version: 0
}

export function isPuzzleV1(puzzle: any): puzzle is PuzzleV0 {
  if (puzzle === undefined || typeof puzzle !== 'object') return false
  const puzzleV1 = puzzle as PuzzleV0
  return puzzleV1.version === 0 && isNamed(puzzleV1.answer)
}

export interface PuzzleConfig {
  hintGenerators: HintGeneratorConfig
}

export function getPuzzleId(puzzle: Puzzle): PuzzleId {
  if (isPuzzleV1(puzzle)) {
    return base64.encode(utf8.encode('0' + JSON.stringify(puzzle.answer)))
  }
  throw new Error('invalid puzzle')
}

export function loadPuzzleById(id: PuzzleId): Puzzle {
  // theoretically, this function could load a stored puzzle definition from a database
  // for now, it will parse structured data stored in the PuzzleId string
  if (id.startsWith('0')) {
    const answer: NamedColour =  JSON.parse(utf8.decode(base64.decode(id.slice(1))))
    return { answer, version: 0 }
  }
  throw new Error(`malformed puzzle id: ${id}`)
}
