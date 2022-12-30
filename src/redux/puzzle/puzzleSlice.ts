import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../store'
import { AnyColour, NamedColour, toHSB, toNamed } from '../../lib/colour/colourConversions'
import { Hint, HintType } from '../../lib/puzzle/hint/hint'
import { getPuzzleId, Puzzle, PuzzleId, PuzzleMode } from '../../lib/puzzle/puzzle'
import { ClientPuzzleSpec, getNewPuzzle } from '../../lib/puzzle/puzzleServer'
import { generateRandomColour } from '../../lib/colour/colourMath'

export interface PuzzleState {
  answerName?: NamedColour
  currentColour: AnyColour
  gaveUp: boolean
  guesses: AnyColour[]
  hints: Hint[]
  mode: PuzzleMode
  precision: number
  puzzleId: PuzzleId
  startingColour: AnyColour
}

// TODO: need a better way of creating a random puzzle
const secretColour = 'mediumseagreen' // toNamed(generateRandomColour()) // 'mediumseagreen'
const initialPuzzle: Puzzle = {
  answer: toHSB(secretColour),
  answerName: toNamed(secretColour),
  mode: HintType.HSB,
  precision: 3,
}
const startingColour: AnyColour = 'slateblue'
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

export type MakeGuessAction = PayloadAction<AnyColour>
export type ReceiveAnswerAction = PayloadAction<NamedColour>
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
    setCurrentColour: (state, action: PayloadAction<AnyColour>) => {
      state.currentColour = action.payload
    },
    setStartingColour: (state, action: PayloadAction<AnyColour>) => {
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
