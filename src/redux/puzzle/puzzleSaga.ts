import { call, put, takeEvery } from 'typed-redux-saga'
import { ForkEffect } from '@redux-saga/core/effects'
import { appSelect } from '../hooks'
import { getPuzzleAnswerFromServer, submitGuessToServer } from './puzzleClient'
import { PuzzleId } from '../../lib/puzzle/puzzle'
import { Hint, isHint } from '../../lib/puzzle/hint/hint'
import { giveUp, makeGuess, MakeGuessAction, receiveAnswer, receiveHint, setCurrentColour } from './puzzleSlice'
import { AnyColour, NamedColour } from '../../lib/colour/colours'

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

export function* puzzleSaga(): Generator<ForkEffect<never>> {
  yield* takeEvery(makeGuess, evaluateGuess)
  yield* takeEvery(giveUp, getAnswer)
}
