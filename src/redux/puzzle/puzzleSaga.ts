import { call, put, takeEvery } from 'typed-redux-saga'
import { appSelect } from '../hooks'
import { getPuzzleAnswerFromServer, submitGuessToServer } from './puzzleClient'
import { PuzzleId } from '../../lib/puzzle/puzzle'
import { Hint, isHint } from '../../lib/puzzle/hint/hint'
import {
  giveUp,
  makeGuess,
  MakeGuessAction,
  receiveAnswer,
  receiveHint,
  resetPuzzleState,
  setCurrentColour,
  setStartingColour,
} from './puzzleSlice'
import { AnyColour, NamedColour } from '../../lib/colour/colours'
import { getNewPuzzle } from '../../lib/puzzle/puzzleServer'
import { toNamed } from '../../lib/colour/colourConversions'
import { generateRandomColour } from '../../lib/colour/colourMath'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* evaluateGuess(action: MakeGuessAction) {
  const guess: AnyColour = action.payload
  const puzzleId: PuzzleId = yield* appSelect((state) => state.puzzle.puzzleId)
  const response: Hint | NamedColour = yield* call(submitGuessToServer, guess, puzzleId)
  if (isHint(response)) {
    const hints = yield* appSelect((state) => state.puzzle.hints)
    const guessGridShape: [number, number] = yield* appSelect((state) => state.config.guessGridShape)
    yield* put(receiveHint(response))
    if (hints.length + 1 === guessGridShape[0] * guessGridShape[1]) {
      // lost the game -- used all hints and did not get the right answer
      yield* put(giveUp())
    }
  } else {
    yield* put(receiveAnswer(response))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* getAnswer() {
  const puzzleId: PuzzleId = yield* appSelect((state) => state.puzzle.puzzleId)
  const response: NamedColour = yield* call(getPuzzleAnswerFromServer, puzzleId)
  yield* put(receiveAnswer(response))
  yield* put(setCurrentColour(response))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* initializePuzzle() {
  const startingColour = toNamed(generateRandomColour())
  yield* put(setStartingColour(startingColour))
  yield* put(setCurrentColour(startingColour))
  yield* put(resetPuzzleState(getNewPuzzle()))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* puzzleSaga() {
  yield* takeEvery(makeGuess, evaluateGuess)
  yield* takeEvery(giveUp, getAnswer)
  yield* initializePuzzle()
}
