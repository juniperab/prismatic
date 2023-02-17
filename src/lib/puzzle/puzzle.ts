import base64 from 'base-64'
import utf8 from 'utf8'
import { HintGeneratorConfig } from './hint-generators/hintGeneratorConfig'
import { toHex } from '../colour/colourConversions'
import { lookupColourName } from '../color-pizza/colorPizzaClient'
import { isNamed, NamedColour } from '../colour/colourNamed'
import { HexColour } from '../colour/colourHex'

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
    // return '0' + base64.encode(utf8.encode(JSON.stringify(toHex(puzzle.answer))))
    return '0' + base64.encode(utf8.encode(toHex(puzzle.answer).slice(1)))
  }
  throw new Error('invalid puzzle')
}

export async function loadPuzzleById(id: PuzzleId): Promise<Puzzle> {
  // theoretically, this function could load a stored puzzle definition from a database
  // for now, it will parse structured data stored in the PuzzleId string
  console.log(id)
  if (id.startsWith('0')) {
    const hex: HexColour = '#' + utf8.decode(base64.decode(id.slice(1)))
    const answer = await lookupColourName(hex)
    if (answer !== undefined) return { answer, version: 0 }
  }
  throw new Error(`malformed puzzle id: ${id}`)
}
