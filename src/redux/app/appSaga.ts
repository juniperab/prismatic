import { toNamed } from '../../lib/colour/colourConversions'
import { generateRandomColour } from '../../lib/colour/colourMath'
import { put } from 'typed-redux-saga'
import { setStartingColour } from '../config/configSlice'
import { resetPuzzleState, setCurrentColour } from '../puzzle/puzzleSlice'
import { getNewPuzzle } from '../../lib/puzzle/puzzleServer'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function* initializePuzzle() {
  const startingColour = toNamed(generateRandomColour())
  yield* put(setStartingColour(startingColour))
  yield* put(setCurrentColour(startingColour))
  yield* put(resetPuzzleState(getNewPuzzle()))
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function* appSaga() {
  yield* initializePuzzle()
}
