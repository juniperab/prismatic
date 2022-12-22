import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { HintType } from "../../lib/puzzle/hint/hint";

export interface ConfigState {
  maxGuesses: number,
  hintType: HintType,
}

const initialState: ConfigState = {
  maxGuesses: 6,
  hintType: HintType.HSB,
}

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setHintType: (state, action: PayloadAction<HintType>) => {
      state.hintType = action.payload
    },
    setMaxGuesses: (state, action: PayloadAction<number>) => {
      state.maxGuesses = action.payload
    },
  },
})

export const { setHintType, setMaxGuesses } = configSlice.actions
export const selectConfigState = (state: RootState): ConfigState => state.config
export default configSlice.reducer
