import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { Hint, HintItem, isHSBHint } from '../../lib/puzzle/hint'
import { PuzzleId } from '../../lib/puzzle/puzzle'
import { AnyColour } from '../../lib/colour/colours'
import { configSlice } from '../config/configSlice'
import { NamedColour } from '../../lib/colour/colourNamed'

export interface PuzzleState {
  answer?: NamedColour
  currentColour: AnyColour
  gaveUp: boolean
  guesses: AnyColour[]
  hints: Hint[]
  puzzleId: PuzzleId | undefined
}

const initialState: PuzzleState = {
  currentColour: configSlice.getInitialState().startingColour,
  gaveUp: false,
  guesses: [],
  hints: [],
  puzzleId: undefined,
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
      if (isHSBHint(action.payload)) {
        const hint = action.payload
        function fmtHintItem(hi?: HintItem): string {
          return (hi?.match === true ? '==' : hi?.error.toFixed(2)) ?? '__'
        }
        console.log(
          `H: ${fmtHintItem(hint.hue)}, S: ${fmtHintItem(hint.saturation)}, B: ${fmtHintItem(hint.brightness)}`
        )
      }
      state.hints.push(action.payload)
    },
    reinitializePuzzle: (state, action: PayloadAction<PuzzleId>) => {
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

export const { giveUp, makeGuess, receiveAnswer, receiveHint, reinitializePuzzle, setCurrentColour } =
  puzzleSlice.actions
export const selectPuzzleState = (state: RootState): PuzzleState => state.puzzle
export default puzzleSlice.reducer
