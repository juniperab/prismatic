import { AnyColour, NamedColour, toCMYK, toHSB, toNamed, toRGB } from '../colour/colourConversions'
import { generateRandomColour } from '../colour/colourMath'
import { getPuzzleId, loadPuzzleById, Puzzle, PuzzleId } from './puzzle'
import { Hint, HintType, visitHintItems } from "./hint/hint";
import { puzzleConfig } from './puzzleConfig'
import { generateHintRGB } from './hint/hintGeneratorRGB'
import { generateHintHSB } from './hint/hintGeneratorHSB'
import { generateHintCMYK } from './hint/hintGeneratorCMYK'

export function getNewPuzzle(): PuzzleId {
  const answer = toNamed(generateRandomColour())
  const newPuzzleSpec: Puzzle = {
    answer: toHSB(answer),
    precision: 3,
  }
  return getPuzzleId(newPuzzleSpec)
}

export function evaluateGuess(guess: AnyColour, puzzleId: PuzzleId): Hint | NamedColour {
  const puzzle = loadPuzzleById(puzzleId)
  const hintConfig = puzzleConfig.hintGenerators
  let hint
  switch (puzzle.mode) {
    case HintType.RGB:
      hint = generateHintRGB(toRGB(guess), puzzle, hintConfig.rgb)
      break
    case HintType.HSB:
      hint = generateHintHSB(toHSB(guess), puzzle, hintConfig.hsb)
      break
    case HintType.CMYK:
      hint = generateHintCMYK(toCMYK(guess), puzzle, hintConfig.cmyk)
      break
    default:
      throw new Error('invalid mode')
  }
  if (visitHintItems(hint, (item) => item).every((item) => item?.match)) {
    return puzzle.answerName
  }
  return hint
}

export function revealAnswer(puzzleId: PuzzleId): NamedColour {
  const puzzle = loadPuzzleById(puzzleId)
  return puzzle.answerName
}
