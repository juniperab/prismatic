import { put, takeEvery } from "typed-redux-saga";
import { setCurrentColour, setStartingColour } from "./puzzleSlice";
import { ForkEffect, PutEffect } from "@redux-saga/core/effects";
import { Action } from "@reduxjs/toolkit";

function* foo(action: any): Generator<PutEffect<Action>> {
  console.log('foo')
  yield* put(setStartingColour('#2244DD'))
  yield* put(setStartingColour('#2244DE'))
  throw new Error('hello')
}

function* bar(action: any): Generator<PutEffect<Action>> {
  console.log('bar')
  yield* put(setStartingColour('#2244DF'))
}

export function* puzzleSaga(): Generator<ForkEffect<never>> {
  console.log('puzzleSaga')
  yield* takeEvery(setCurrentColour, bar)
  yield* takeEvery(setCurrentColour, foo)
}
