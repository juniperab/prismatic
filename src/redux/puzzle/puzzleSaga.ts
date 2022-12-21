/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { put, takeEvery } from "typed-redux-saga";
import { setCurrentColour, setStartingColour } from "./puzzleSlice";

function* foo(action: any) {
  console.log('foo')
  yield* put(setStartingColour('#2244DD'))
  yield* put(setStartingColour('#2244DE'))
  throw new Error('hello')
}

function* bar(action: any) {
  console.log('bar')
  yield* put(setStartingColour('#2244DF'))
}

export function* puzzleSaga() {
  console.log('puzzleSaga')
  yield* takeEvery(setCurrentColour, bar)
  yield* takeEvery(setCurrentColour, foo)
}
