import { toNamed } from '../colour/colourConversions'
import { generateRandomColour } from '../colour/colourMath'
import { getPuzzleId, loadPuzzleById, Puzzle, PuzzleId } from './puzzle'
import { Hint, visitHintItems } from "./hint/hint";
import { puzzleConfig } from './puzzleConfig'
import { generateHintRGB } from './hint/hintGeneratorRGB'
import { generateHintHSB } from './hint/hintGeneratorHSB'
import { generateHintCMYK } from './hint/hintGeneratorCMYK'
import { AnyColour, NamedColour, visitColourOrThrow } from "../colour/colours";

export function getNewPuzzle(): PuzzleId {
  const answer = toNamed(generateRandomColour())
  const newPuzzleSpec: Puzzle = { answer, precision: 3 }
  return getPuzzleId(newPuzzleSpec)
}

export function evaluateGuess(guess: AnyColour, puzzleId: PuzzleId): Hint | NamedColour {
  const puzzle = loadPuzzleById(puzzleId)
  const hintConfig = puzzleConfig.hintGenerators
  const hint = visitColourOrThrow<Hint>(guess, {
    'cmyk': g => generateHintCMYK(g, puzzle, hintConfig.cmyk),
    'hsb': g => generateHintHSB(g, puzzle, hintConfig.hsb),
    'rgb': g => generateHintRGB(g, puzzle, hintConfig.rgb),
  }, new Error('unsupported colour type for guess'))
  if (visitHintItems(hint, (item) => item).every((item) => item?.match)) {
    return puzzle.answer
  }
  return hint
}

export function revealAnswer(puzzleId: PuzzleId): NamedColour {
  return loadPuzzleById(puzzleId).answer
}
