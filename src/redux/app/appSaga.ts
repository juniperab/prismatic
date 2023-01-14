import { uniformRandomColourHSB } from "../../lib/colour/colourMath";
import { put, takeEvery } from "typed-redux-saga";
import { setStartingColour } from '../config/configSlice'
import { reinitializePuzzle, setCurrentColour } from "../puzzle/puzzleSlice";
import { getNewRandomPuzzleFromServer } from "../puzzle/puzzleClient";
import { PuzzleId } from "../../lib/puzzle/puzzle";
import { restartWithNewPuzzle } from "./appActions";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* initializeWithStartingColour() {
  const startingColour = uniformRandomColourHSB()
  yield* put(setStartingColour(startingColour))
  yield* put(setCurrentColour(startingColour))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* initializeWithStartingPuzzle() {
  // TODO: load the puzzle-of-the-day instead of a random puzzle
  const newPuzzleId: PuzzleId = yield getNewRandomPuzzleFromServer()
  yield* put(reinitializePuzzle(newPuzzleId))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* reinitializeWithNewRandomPuzzle() {
  const newPuzzleId: PuzzleId = yield getNewRandomPuzzleFromServer()
  yield* put(reinitializePuzzle(newPuzzleId))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* appSaga() {
  yield* initializeWithStartingColour()
  yield* initializeWithStartingPuzzle()
  yield* takeEvery(restartWithNewPuzzle.type, reinitializeWithNewRandomPuzzle)
}
