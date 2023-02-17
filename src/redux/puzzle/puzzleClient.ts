import { Hint } from '../../lib/puzzle/hint'
import { PuzzleId } from '../../lib/puzzle/puzzle'
import { evaluateGuess, getNewPuzzle, revealAnswer } from '../../lib/puzzle/puzzleServer'
import { AnyColour } from '../../lib/colour/colours'
import { NamedColour } from '../../lib/colour/colourNamed'

export async function getNewRandomPuzzleFromServer(): Promise<PuzzleId> {
  // a mock call to a server-side puzzle controller
  return await getNewPuzzle()
}

export async function submitGuessToServer(guess: AnyColour, puzzleId: PuzzleId): Promise<Hint | NamedColour> {
  // a mock call to a server-side puzzle controller
  return await evaluateGuess(guess, puzzleId)
}

export async function getPuzzleAnswerFromServer(puzzleId: PuzzleId): Promise<NamedColour> {
  // a mock call to a server-side puzzle controller
  return await revealAnswer(puzzleId)
}
