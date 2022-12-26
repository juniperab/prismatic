import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../store'
import { AnyColor, NamedColor, toHSB, toNamed } from '../../lib/colour/colourConversions'
import { Hint } from '../../lib/puzzle/hint/hint'
import { getPuzzleId, Puzzle, PuzzleId, PuzzleMode } from '../../lib/puzzle/puzzle'
import { ClientPuzzleSpec, getNewPuzzle } from '../../lib/puzzle/puzzleServer'
import { rotateHue } from "../../lib/colour/colourMath";

export interface PuzzleState {
  answerName?: NamedColor
  currentColour: AnyColor
  gaveUp: boolean
  guesses: AnyColor[]
  hints: Hint[]
  mode: PuzzleMode
  precision: number
  puzzleId: PuzzleId
  startingColour: AnyColor
}

const initialPuzzle: Puzzle = {
  answer: toHSB('mediumseagreen'),
  answerName: toNamed('mediumseagreen'),
  mode: 'hsb',
  precision: 3,
}
const startingColour: AnyColor = 'slateblue'
const initialState: PuzzleState = {
  currentColour: startingColour,
  gaveUp: false,
  guesses: [],
  hints: [],
  mode: initialPuzzle.mode,
  precision: initialPuzzle.precision,
  puzzleId: getPuzzleId(initialPuzzle),
  startingColour,
}

export type MakeGuessAction = PayloadAction<AnyColor>
export type ReceiveAnswerAction = PayloadAction<NamedColor>
export type ReceiveHintAction = PayloadAction<Hint>

export const puzzleSlice = createSlice({
  name: 'puzzle',
  initialState,
  reducers: {
    giveUp: (state) => {
      state.gaveUp = true
    },
    makeGuess: (state, action: MakeGuessAction) => {
      state.guesses.push(action.payload)
    },
    receiveAnswer: (state, action: ReceiveAnswerAction) => {
      state.answerName = action.payload
    },
    receiveHint: (state, action: ReceiveHintAction) => {
      state.hints.push(action.payload)
    },
    resetPuzzleState: (state, action: PayloadAction<ClientPuzzleSpec>) => {
      state.answerName = undefined
      state.gaveUp = false
      state.hints = []
      state.mode = action.payload.mode
      state.precision = action.payload.precision
      state.puzzleId = action.payload.puzzleId
      state.startingColour = state.currentColour
    },
    setCurrentColour: (state, action: PayloadAction<AnyColor>) => {
      const hsb = toHSB(action.payload)
      hsb.h = rotateHue(hsb.h, 30)
      hsb.s = Math.min(hsb.s * 1.25, 100)
      state.currentColour = hsb
    },
    setStartingColour: (state, action: PayloadAction<AnyColor>) => {
      state.startingColour = action.payload
    },
  },
})

export const { giveUp, makeGuess, receiveAnswer, receiveHint, resetPuzzleState, setCurrentColour, setStartingColour } =
  puzzleSlice.actions
export const selectPuzzleState = (state: RootState): PuzzleState => state.puzzle
export default puzzleSlice.reducer

export const startNewGame = (): AppThunk => (dispatch) => {
  dispatch(resetPuzzleState(getNewPuzzle()))
}
