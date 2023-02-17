import { uniformRandomColourHSB } from '../colour/colourMath'
import { getPuzzleId, loadPuzzleById, PuzzleId } from './puzzle'
import { Hint, visitHintItems } from './hint'
import { puzzleConfig } from './puzzleConfig'
import { generateHintRGB } from './hint-generators/hintGeneratorRGB'
import { generateHintHSB } from './hint-generators/hintGeneratorHSB'
import { generateHintCMYK } from './hint-generators/hintGeneratorCMYK'
import { AnyColour } from '../colour/colours'
import { lookupColourPizzaName } from '../color-pizza/colorPizzaClient'
import { NamedColour } from '../colour/colourNamed'
import { visitColourOrThrow } from '../colour/colourVisitor'
import { toNamed } from '../colour/colourConversions'

export async function getNewPuzzle(): Promise<PuzzleId> {
  const seedColour = uniformRandomColourHSB()
  const answer = await toNamed(seedColour, lookupColourPizzaName)
  if (answer === undefined) throw new Error('failed to generate a new puzzle')
  return getPuzzleId({ answer, version: 0 })
}

export async function evaluateGuess(guess: AnyColour, puzzleId: PuzzleId): Promise<Hint | NamedColour> {
  const puzzle = await loadPuzzleById(puzzleId)
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

export async function revealAnswer(puzzleId: PuzzleId): Promise<NamedColour> {
  const puzzle = await loadPuzzleById(puzzleId)
  return puzzle.answer
}
