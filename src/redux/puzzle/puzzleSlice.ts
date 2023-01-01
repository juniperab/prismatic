import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Hint } from '../../lib/puzzle/hint'
import { getPuzzleId, PuzzleId } from '../../lib/puzzle/puzzle'
import { AnyColour, NamedColour } from '../../lib/colour/colours'
import { configSlice } from '../config/configSlice'

export interface PuzzleState {
  answer?: NamedColour
  currentColour: AnyColour
  gaveUp: boolean
  guesses: AnyColour[]
  hints: Hint[]
  puzzleId: PuzzleId
}

const initialState: PuzzleState = {
  currentColour: configSlice.getInitialState().startingColour,
  gaveUp: false,
  guesses: [],
  hints: [],
  puzzleId: getPuzzleId({ answer: 'white', precision: 3 }),
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
      state.answer = action.payload
    },
    receiveHint: (state, action: ReceiveHintAction) => {
      state.hints.push(action.payload)
    },
    resetPuzzleState: (state, action: PayloadAction<PuzzleId>) => {
      state.answer = undefined
      state.gaveUp = false
      state.hints = []
      state.puzzleId = action.payload
    },
    setCurrentColour: (state, action: PayloadAction<AnyColour>) => {
      state.currentColour = action.payload
    },
  },
})

export const { giveUp, makeGuess, receiveAnswer, receiveHint, resetPuzzleState, setCurrentColour } = puzzleSlice.actions
export const selectPuzzleState = (state: RootState): PuzzleState => state.puzzle
export default puzzleSlice.reducer
