import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "../../redux/store";
import {isNamed, NamedColor} from "../../lib/colour/colourConversions";
import {setStartingColour} from "../../features/colour-guesser/colourGuesserSlice";
import {Hint} from "../../lib/puzzle/api/hint";
import {PuzzleId, PuzzleMode} from "../../lib/puzzle/api/puzzle";
import {getPuzzleAnswerFromServer, submitGuessToServer} from "./puzzleClient";
import {ClientPuzzleSpec, getInitialPuzzle, getNewPuzzle} from "../../lib/puzzle/api/client";
import {stat} from "fs";

export interface PuzzleState {
    puzzleId: PuzzleId
    mode: PuzzleMode;
    precision: number,
    hints: Hint[],
    answerName?: NamedColor,
    gaveUp: boolean
}

const initialState: PuzzleState = {
    puzzleId: getInitialPuzzle().puzzleId,
    mode: getInitialPuzzle().mode,
    precision: getInitialPuzzle().precision,
    hints: [],
    gaveUp: false,
}

export const getNextHint = createAsyncThunk(
    "puzzle/getNextHint",
    async (_, api) => {
        const state: RootState = api.getState() as RootState
        return await submitGuessToServer(state.colourGuesser.currentColour, state.puzzle.puzzleId)
    }
)

export const giveUp = createAsyncThunk(
    "puzzle/giveUp",
    async (__, api) => {
        const state: RootState = api.getState() as RootState
        return await getPuzzleAnswerFromServer(state.puzzle.puzzleId)
    }
)

export const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        resetPuzzleState: (state, action: PayloadAction<ClientPuzzleSpec>) => {
            state.puzzleId = action.payload.puzzleId
            state.mode = action.payload.mode
            state.precision = action.payload.precision
            state.hints = []
            state.gaveUp = false
        },
    },
    extraReducers: (builder) => {
      builder
          .addCase(getNextHint.fulfilled, (state, action: PayloadAction<Hint | NamedColor>) => {
              if (isNamed(action.payload)) {
                  state.answerName = action.payload
              } else {
                  state.hints.push(action.payload)
              }
          })
          .addCase(giveUp.fulfilled, (state, action: PayloadAction<NamedColor>) => {
              state.answerName = action.payload
              state.gaveUp = true
          })
    },
})

export const { resetPuzzleState } = puzzleSlice.actions
export const selectPuzzleState = (state: RootState) => state.puzzle
export default puzzleSlice.reducer

export const startNewGame =
    (): AppThunk =>
        (dispatch, getState) => {
            dispatch(setStartingColour(getState().colourGuesser.currentColour))
            dispatch(resetPuzzleState(getNewPuzzle()));
        };