import { call, put, takeEvery } from 'typed-redux-saga'
import { ForkEffect } from '@redux-saga/core/effects'
import { appSelect } from '../hooks'
import { getPuzzleAnswerFromServer, submitGuessToServer } from './puzzleClient'
import { AnyColor, NamedColor } from '../../lib/colour/colourConversions'
import { PuzzleId } from '../../lib/puzzle/puzzle'
import { Hint, isHint } from '../../lib/puzzle/hint/hint'
import { giveUp, makeGuess, MakeGuessAction, receiveAnswer, receiveHint } from './puzzleSlice'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* evaluateGuess(action: MakeGuessAction) {
  const guess: AnyColor = action.payload
  const puzzleId: PuzzleId = yield* appSelect((state) => state.puzzle.puzzleId)
  const response: Hint | NamedColor = yield* call(submitGuessToServer, guess, puzzleId)
  if (isHint(response)) {
    yield* put(receiveHint(response))
  } else {
    yield* put(receiveAnswer(response))
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* getAnswer() {
  const puzzleId: PuzzleId = yield* appSelect((state) => state.puzzle.puzzleId)
  const response: NamedColor = yield* call(getPuzzleAnswerFromServer, puzzleId)
  yield* put(receiveAnswer(response))
}

export function* puzzleSaga(): Generator<ForkEffect<never>> {
  yield* takeEvery(makeGuess, evaluateGuess)
  yield* takeEvery(giveUp, getAnswer)
}
