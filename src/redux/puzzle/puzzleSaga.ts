import { call, put, takeEvery } from 'typed-redux-saga'
import { appSelect } from '../hooks'
import { getPuzzleAnswerFromServer, submitGuessToServer } from './puzzleClient'
import { Hint, HintType, isHint } from '../../lib/puzzle/hint'
import {
  giveUp,
  makeGuess,
  MakeGuessAction,
  receiveAnswer,
  receiveHint,
  selectPuzzleState,
  setCurrentColour,
} from './puzzleSlice'
import { AnyColour } from '../../lib/colour/colours'
import { toCMYK, toHSB, toRGB } from '../../lib/colour/colourConversions'
import { selectConfigState } from '../config/configSlice'
import { NamedColour } from '../../lib/colour/colourNamed'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* evaluateGuess(action: MakeGuessAction) {
  const { puzzleId } = yield* appSelect(selectPuzzleState)
  if (puzzleId === undefined) return

  let guess: AnyColour = action.payload
  const { hintType } = yield* appSelect(selectConfigState)
  switch (hintType) {
    case HintType.CMYK:
      guess = toCMYK(guess)
      break
    case HintType.HSB:
      guess = toHSB(guess)
      break
    case HintType.RGB:
      guess = toRGB(guess)
      break
  }
  const response: Hint | NamedColour = yield* call(submitGuessToServer, guess, puzzleId)
  if (isHint(response)) {
    const hints = yield* appSelect((state) => state.puzzle.hints)
    const { guessGridShape } = yield* appSelect(selectConfigState)
    yield* put(receiveHint(response))
    if (hints.length + 1 === guessGridShape[0] * guessGridShape[1]) {
      // used all hints and did not get the right answer => lost the game
      yield* put(giveUp())
    }
  } else {
    yield* put(receiveAnswer(response))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* getAnswer() {
  const { puzzleId } = yield* appSelect(selectPuzzleState)
  if (puzzleId === undefined) return
  const response: NamedColour = yield* call(getPuzzleAnswerFromServer, puzzleId)
  yield* put(receiveAnswer(response))
  yield* put(setCurrentColour(response))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* puzzleSaga() {
  yield* takeEvery(makeGuess, evaluateGuess)
  yield* takeEvery(giveUp, getAnswer)
}
