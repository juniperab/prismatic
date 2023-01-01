import { Hint } from '../../lib/puzzle/hint'
import { PuzzleId } from '../../lib/puzzle/puzzle'
import { evaluateGuess, revealAnswer } from '../../lib/puzzle/puzzleServer'
import { AnyColour, NamedColour } from '../../lib/colour/colours'

export async function submitGuessToServer(guess: AnyColour, puzzleId: PuzzleId): Promise<Hint | NamedColour> {
  return await new Promise<Hint | NamedColour>((resolve) => {
    // a mock call to a server-side puzzle controller
    resolve(evaluateGuess(guess, puzzleId))
  })
}

export async function getPuzzleAnswerFromServer(puzzleId: PuzzleId): Promise<NamedColour> {
  return await new Promise<NamedColour>((resolve) => {
    // a mock call to a server-side puzzle controller
    resolve(revealAnswer(puzzleId))
  })
}
