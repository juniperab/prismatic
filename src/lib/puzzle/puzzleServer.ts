import { uniformRandomColourHSB } from '../colour/colourMath'
import { getPuzzleId, loadPuzzleById, Puzzle, PuzzleId } from './puzzle'
import { Hint, visitHintItems } from './hint'
import { puzzleConfig } from './puzzleConfig'
import { generateHintRGB } from './hint-generators/hintGeneratorRGB'
import { generateHintHSB } from './hint-generators/hintGeneratorHSB'
import { generateHintCMYK } from './hint-generators/hintGeneratorCMYK'
import { AnyColour, NamedColour, visitColourOrThrow } from '../colour/colours'
import { lookupColourName } from '../color-pizza/colorPizzaClient'

export async function getNewPuzzle(): Promise<PuzzleId> {
  const seedColour = uniformRandomColourHSB()
  const answer = await lookupColourName(seedColour)
  if (answer === undefined) throw new Error('failed to generate a new puzzle')
  const newPuzzleSpec: Puzzle = { answer, precision: 3 }
  return getPuzzleId(newPuzzleSpec)
}

export function evaluateGuess(guess: AnyColour, puzzleId: PuzzleId): Hint | NamedColour {
  const puzzle = loadPuzzleById(puzzleId)
  const hintConfig = puzzleConfig.hintGenerators
  const hint = visitColourOrThrow<Hint>(
    guess,
    {
      cmyk: (g) => generateHintCMYK(g, puzzle, hintConfig.cmyk),
      hsb: (g) => generateHintHSB(g, puzzle, hintConfig.hsb),
      rgb: (g) => generateHintRGB(g, puzzle, hintConfig.rgb),
    },
    new Error('unsupported colour type for guess')
  )
  if (visitHintItems(hint, (item) => item).every((item) => item?.match)) {
    return puzzle.answer
  }
  return hint
}

export function revealAnswer(puzzleId: PuzzleId): NamedColour {
  return loadPuzzleById(puzzleId).answer
}
