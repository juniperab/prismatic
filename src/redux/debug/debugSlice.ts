import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { PuzzleMode } from "../../lib/puzzle/puzzle";
import { HintType } from "../../lib/puzzle/hint/hint";

export interface DebugState {
  displayMode: PuzzleMode
}

const initialState: DebugState = {
  displayMode: HintType.HSB,
}

export const debugSlice = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    setDisplayMode: (state, action: PayloadAction<PuzzleMode>) => {
      state.displayMode = action.payload
    },
  },
})

export const { setDisplayMode } = debugSlice.actions
export const selectDebugState = (state: RootState): DebugState => state.debug
export default debugSlice.reducer
