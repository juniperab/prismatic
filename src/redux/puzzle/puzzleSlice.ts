import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";
import { Hint, HintType } from "../../lib/puzzle/hint/hint";
import { getPuzzleId, PuzzleId } from "../../lib/puzzle/puzzle";
import { getNewPuzzle } from "../../lib/puzzle/puzzleServer";
import { AnyColour, NamedColour } from "../../lib/colour/colours";

export interface PuzzleState {
  answerName?: NamedColour
  currentColour: AnyColour
  gaveUp: boolean
  guessMode: HintType
  guesses: AnyColour[]
  hints: Hint[]
  puzzleId: PuzzleId
  startingColour: AnyColour
}

// TODO: need a better way of creating a random puzzle
const startingColour: AnyColour = 'slateblue'
const initialState: PuzzleState = {
  currentColour: startingColour,
  gaveUp: false,
  guessMode: HintType.HSB,
  guesses: [],
  hints: [],
  puzzleId: getPuzzleId({ answer: 'mediumseagreen', precision: 3 }),
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
    resetPuzzleState: (state, action: PayloadAction<PuzzleId>) => {
      state.answerName = undefined
      state.gaveUp = false
      state.hints = []
      state.puzzleId = action.payload
      state.startingColour = state.currentColour
    },
    setCurrentColour: (state, action: PayloadAction<AnyColour>) => {
      state.currentColour = action.payload
    },
    setGuessMode: (state, action: PayloadAction<HintType>) => {
      state.guessMode = action.payload
    },
    setStartingColour: (state, action: PayloadAction<AnyColour>) => {
      state.startingColour = action.payload
    },
  },
})

export const { giveUp, makeGuess, receiveAnswer, receiveHint, resetPuzzleState, setCurrentColour, setGuessMode, setStartingColour } =
  puzzleSlice.actions
export const selectPuzzleState = (state: RootState): PuzzleState => state.puzzle
export default puzzleSlice.reducer

export const startNewGame = (): AppThunk => (dispatch) => {
  dispatch(resetPuzzleState(getNewPuzzle()))
}
